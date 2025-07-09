import { Injectable, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { NotificationService } from "src/notification/notification.service";

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);
  constructor(private notificationService: NotificationService) {}

  @Cron("*/10 * * * * *") // Este cron va a ejectuar el metodo todos los dias cada 1 segundo para chequear si tiene que enviar alguna notificacion
  async hanldeNotifications() {
    this.logger.log("Ejecutando cron de notificaciones...");
    try {
      await this.notificationService.notify();
    } catch (error) {
      this.logger.error("Error en cron de notificaciones:", error);
    }
  }
}
