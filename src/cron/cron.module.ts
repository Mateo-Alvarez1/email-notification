import { Module } from "@nestjs/common";
import { CronService } from "./cron.service";
import { NotificationModule } from "src/notification/notification.module";

@Module({
  providers: [CronService],
  imports: [NotificationModule],
})
export class CronModule {}
