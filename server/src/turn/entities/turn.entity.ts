import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
@Entity()
export class Turn {
  @PrimaryGeneratedColumn("uuid")
  id: string;
  @Column("text", {
    nullable: false,
  })
  name: string;
  @Column("text", {
    unique: true,
    nullable: false,
  })
  email: string;
  @Column({ type: "timestamptz", default: new Date() })
  date: Date;
  @Column({
    default: new Date().toISOString(),
  })
  createdAt: Date;
}
