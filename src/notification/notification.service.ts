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
  // ARREGLAR DUPLICADOS Y LISTORTI
  async notify() {
    const now = new Date();
    try {
      const pendingNotifications = await this.findAll();
      for (const notifications of pendingNotifications) {
        if (!notifications.sent) {
          const freshNotification = await this.findOne(notifications?.id!);
          if (freshNotification?.sent) {
            continue;
          }

          const turn = await this.turnService.findOne(notifications.turnId);
          const sendTime = notifications.sendAt.getTime();
          const currentTime = now.getTime();
          const tolerance = 10000;
          if (Math.abs(sendTime - currentTime) <= tolerance) {
            notifications.sent = true;
            notifications.sentAt = now;

            await this.notificationRepository.save(notifications);

            await this.mailerService.sendMail(
              turn.email,
              "Recordatorio de turno",
              "reminder"
            );
            console.log("Mail Enviadisimo");
          }
        }
      }
    } catch (error) {}
  }
}
