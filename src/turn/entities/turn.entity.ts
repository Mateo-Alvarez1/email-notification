import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Notification } from "../../notification/entities/notification.entity";

@Entity()
export class Turn {
  @PrimaryGeneratedColumn("uuid")
  id: string;
  @Column("text")
  name: string;
  @Column("text", {
    unique: true,
  })
  email: string;
  @Column({
    default: new Date(),
  })
  date: Date;
  @Column({
    default: new Date(),
  })
  createdAt: Date;

  @OneToMany(() => Notification, (notification) => notification.turn)
  notification: Notification;
}
