import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
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
  @Column({ type: "timestamptz", default: new Date() })
  date: Date;
  @Column({
    default: new Date(),
  })
  createdAt: Date;
}
