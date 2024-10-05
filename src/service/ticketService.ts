import {TicketRepository} from "../repositories/ticketRepository";
import {Request, Response} from "express";
import {Ticket} from "../entities/ticket";

export class TicketService {
    private static ticketRepository = new TicketRepository();

    public static async createTicket(req: Request, res: Response) {
        const { oib, firstName, lastName } = req.body;
        const newTicket = new Ticket(oib, firstName, lastName);
        await TicketService.ticketRepository.create(newTicket);
    }

    public static async getAllTickets(req: Request, res: Response) {
        return await TicketService.ticketRepository.getAll();
    }
}