import { Module } from "@nestjs/common";
import { TurnModule } from "./turn/turn.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { NotificationModule } from "./notification/notification.module";
import { MailerModule } from "./mailer/mailer.module";
import { CronModule } from "./cron/cron.module";
import { ScheduleModule } from "@nestjs/schedule";
import { CronService } from "./cron/cron.service";

@Module({
  imports: [
    TurnModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,
    }),
    NotificationModule,
    MailerModule,
    CronModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [],
  providers: [CronService],
})
export class AppModule {}
