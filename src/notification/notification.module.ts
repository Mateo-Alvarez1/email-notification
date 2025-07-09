import { Module } from "@nestjs/common";
import { NotificationService } from "./notification.service";
import { NotificationController } from "./notification.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Notification } from "./entities/notification.entity";
import { TurnModule } from "src/turn/turn.module";

@Module({
  imports: [TypeOrmModule.forFeature([Notification]), TurnModule],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
