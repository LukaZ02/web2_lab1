import { Repository } from "typeorm";
import { Ticket } from "../entities/ticket";
import { TicketRepositoryInterface } from "./ticketRepositoryInterface";
import { AppDataSource } from "../data-source";

export class TicketRepository implements TicketRepositoryInterface {
    private repository: Repository<Ticket>;

    constructor() {
        this.repository = AppDataSource.getRepository(Ticket);
    }

    async create(ticket: Ticket): Promise<Ticket> {
        return await this.repository.save(ticket);
    }

    async getAll(): Promise<Ticket[]> {
        return await this.repository.find();
    }
}