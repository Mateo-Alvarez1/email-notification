import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateNotificationDto } from "./dto/create-notification.dto";
import { UpdateNotificationDto } from "./dto/update-notification.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Notification } from "./entities/notification.entity";
import { Repository } from "typeorm";
import { validate as IsUUID } from "uuid";
import { MailerService } from "src/mailer/mailer.service";
import { TurnService } from "src/turn/turn.service";

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    private readonly mailerService: MailerService,
    @Inject(forwardRef(() => TurnService))
    private readonly turnService: TurnService
  ) {}

  async create(createNotificationDto: CreateNotificationDto) {
    try {
      const notification = this.notificationRepository.create(
        createNotificationDto
      );

      await this.notificationRepository.save(notification);
    } catch (error) {
      console.log(error);
    }
  }

  async findAll() {
    return this.notificationRepository.find();
  }

  async findOne(term: string) {
    let notification: Notification | null;

    notification = await this.notificationRepository.findOneBy({ id: term });

    if (!notification) {
      throw new NotFoundException(`Notification with ${term} not found`);
    }

    return notification;
  }

  async update(id: string, updateNotificationDto: UpdateNotificationDto) {
    try {
      const notification = await this.notificationRepository.preload({
        id: id,
        ...updateNotificationDto,
      });

      if (!notification) {
        throw new BadRequestException(
          `notification Whit id ${id} not found in database`
        );
      }

      await this.notificationRepository.save(notification);
      return notification;
    } catch (error) {
      console.log(error);
    }
  }

  async remove(id: string) {
    const { affected } = await this.notificationRepository.delete({ id });
    if (affected === 0)
      throw new BadRequestException(
        `Not found notification whit ${id} in the database`
      );

    return;
  }

  async notify() {
    const now = new Date();
    try {
      const pendingNotifications = await this.findAll();

      for (const notification of pendingNotifications) {
        if (!notification.sent) {
          // Usar transacción para evitar race conditions

          await this.notificationRepository.manager.transaction(
            async (manager) => {
              // Buscar la notificación con LOCK FOR UPDATE --> Esto lo que hace es bloquear las filas seleccionadas
              //  para que otros procesos no puedan modificarlas hasta que termine el proceso actual , en este caso
              // lo usamos para evitar el envio por duplicado cuando estamos trabajando con procesos de Cron o Colas
              // ya que pueden haber casos donde el proceso B se empiece a ejecutar y el Proceso A todavia no haya terminado
              //  su ejecucion en lockForUpdate.txt tienen un grafico donde se entiende mejor :)
              const freshNotification = await manager
                .createQueryBuilder()
                .select()
                .from("notification", "n")
                .where("n.id = :id", { id: notification.id })
                .andWhere("n.sent = false")
                .setLock("pessimistic_write")
                .getRawOne();

              if (!freshNotification) {
                // vamos a cortar la ejecucion si es que la notificacion ya fue ejecutada por otro proceso
                return;
              }

              const turn = await this.turnService.findOne(notification.turnId);
              const sendTime = notification.sendAt.getTime();
              const currentTime = now.getTime();
              const tolerance = 10000;

              if (Math.abs(sendTime - currentTime) <= tolerance) {
                await manager.update(
                  "notification",
                  { id: notification.id },
                  { sent: true, sentAt: now }
                );

                // Enviar email
                await this.mailerService.sendMail(
                  turn.email,
                  "Recordatorio de turno",
                  `Hola ${turn.name}
Te recordamos que tenés un turno agendado para el dia ${turn.date.toISOString().slice(0, 10)} a las ${new Date(turn.date.getTime() - 3 * 60 * 60 * 1000).toISOString().slice(11, 16)}hs.
Si necesitás reprogramar o cancelar el turno, por favor comunicate con nosotros con al menos 24 horas de anticipación.
Gracias por confiar en nuestro trabajo. ¡Te esperamos!
-----------------------------------------------------------------------
Este es un mensaje automático. Por favor, no respondas a este correo.`
                );
              }
            }
          );
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
}
