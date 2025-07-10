import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Notification {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "timestamptz" }) // fecha programada de envío nosotros seteamos si mandamos la noti 1hora antes o cuando se nos cante
  sendAt: Date;

  @Column({ default: false })
  sent: boolean;

  @Column({ type: "timestamptz", nullable: true }) // fecha real en que se envió
  sentAt: Date | null;

  @Column({ type: "uuid" })
  turnId: string;
}
