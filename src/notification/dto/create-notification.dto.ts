import { IsBoolean, IsDateString, IsOptional } from "class-validator";

export class CreateNotificationDto {
  @IsDateString() // ISO8601 (ej: "2025-07-10T14:00:00.000Z")
  sendAt: string;

  @IsOptional()
  @IsBoolean()
  sent?: boolean;

  @IsOptional()
  @IsDateString()
  sentAt?: string;
}
