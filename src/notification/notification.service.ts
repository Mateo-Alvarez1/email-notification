import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateNotificationDto } from "./dto/create-notification.dto";
import { UpdateNotificationDto } from "./dto/update-notification.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Notification } from "./entities/notification.entity";
import { Repository } from "typeorm";
import { validate as IsUUID } from "uuid";

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>
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
}
