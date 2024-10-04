import {Request, Response} from "express";
import {Ticket} from "../entities/ticket";
import {TicketRepository} from "../repositories/ticketRepository";

export class TicketController {
    private static ticketRepository = new TicketRepository();

    public static async createTicket(req: Request, res: Response) {
        const { oib, firstName, lastName } = req.body;
        const newTicket = new Ticket(oib, firstName, lastName);
        await TicketController.ticketRepository.create(newTicket);
        res.status(201).send("Ticket has been created");
    }

    public static async getAllTickets(req: Request, res: Response) {
        const tickets = await TicketController.ticketRepository.getAll();
        res.status(200).json(tickets);
    }
}