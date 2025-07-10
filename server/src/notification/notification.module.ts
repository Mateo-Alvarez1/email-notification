import { forwardRef, Module } from "@nestjs/common";
import { NotificationService } from "./notification.service";
import { NotificationController } from "./notification.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Notification } from "./entities/notification.entity";
import { MailerModule } from "src/mailer/mailer.module";
import { TurnModule } from "src/turn/turn.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification]),
    MailerModule,
    forwardRef(() => TurnModule),
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
