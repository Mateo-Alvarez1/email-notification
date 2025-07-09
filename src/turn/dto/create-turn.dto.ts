import {
  IsDate,
  IsEmail,
  IsOptional,
  IsString,
  MinDate,
  MinLength,
} from "class-validator";

export class CreateTurnDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsEmail()
  email: string;

  @IsDate()
  @IsOptional()
  date: Date;
}
