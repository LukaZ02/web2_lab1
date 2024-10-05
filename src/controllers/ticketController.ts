import {TicketService} from "../service/ticketService";
import {Request, Response} from "express";

export class TicketController {

    public static async createTicket(req: Request, res: Response) {
        await TicketService.createTicket(req, res);
        res.status(201).render('index', { message: 'Ticket created successfully' });
    }

    public static async getAllTickets(req: Request, res: Response) {
        const tickets = await TicketService.getAllTickets(req, res);
        res.status(200).render('index', { tickets: tickets });
    }
}