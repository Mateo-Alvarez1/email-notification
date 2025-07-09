import { forwardRef, Module } from "@nestjs/common";
import { TurnService } from "./turn.service";
import { TurnController } from "./turn.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Turn } from "./entities/turn.entity";
import { NotificationModule } from "src/notification/notification.module";

@Module({
  controllers: [TurnController],
  providers: [TurnService],
  exports: [TurnService],
  imports: [
    TypeOrmModule.forFeature([Turn]),
    forwardRef(() => NotificationModule),
  ],
})
export class TurnModule {}
