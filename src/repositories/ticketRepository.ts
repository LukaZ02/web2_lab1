import { Repository } from "typeorm";
import { Ticket } from "../entities/ticket";
import { AppDataSource } from "../data-source";

export class TicketRepository {
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

    async findByOIB(oib: string) {
        return await this.repository.find({ where: { oib: oib } });
    }

    async findByUUID(uuid: string) {
        return await this.repository.findOne({ where: { uuid: uuid } });
    }
}