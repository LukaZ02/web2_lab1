import { Column, Entity } from "typeorm";

@Entity('ticket')
export class Ticket {
  @Column({ type: "text", primary: true })
  oib: string;

  @Column({ type: "text" })
  firstName: string;

  @Column({ type: "text" })
  lastName: string;

  constructor(oib: string, firstName: string, lastName: string) {
    this.oib = oib;
    this.firstName = firstName;
    this.lastName = lastName;
  }
}