import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('ticket')
export class Ticket {
  @PrimaryGeneratedColumn("uuid")
  uuid!: string;

  @Column({ type: "text" })
  oib: string;

  @Column({ type: "text" })
  firstName: string;

  @Column({ type: "text" })
  lastName: string;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  constructor(oib: string, firstName: string, lastName: string) {
    this.oib = oib;
    this.firstName = firstName;
    this.lastName = lastName;
  }
}