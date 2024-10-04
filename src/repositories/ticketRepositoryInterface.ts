import {Ticket} from "../entities/ticket";

export interface TicketRepositoryInterface {
    create(ticket: Ticket): Promise<Ticket>;
    getAll(): Promise<Ticket[]>;
}