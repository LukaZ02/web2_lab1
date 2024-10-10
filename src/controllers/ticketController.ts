import { TicketRepository } from "../repositories/ticketRepository";
import { Request, Response } from "express";
import { Ticket } from "../entities/ticket";

export class TicketController {
    private static ticketRepository = new TicketRepository();

    // Render the ticket creation form
    public static renderCreateTicketForm(req: Request, res: Response) {
        res.status(200).render('create');
    }

    // Create a new ticket
    public static async createTicket(req: Request, res: Response) {
        const { oib, firstName, lastName } = req.body;
        if(!TicketController.isValidOIB(oib)) {
            res.status(400).render('failure', { code: "400", message: "Invalid OIB!" });
            return;
        }
        try {
            const newTicket = new Ticket(oib, firstName, lastName);
            await TicketController.ticketRepository.create(newTicket);
            res.status(200).render('success');
        } catch (error) {
            res.status(500).render('failure', { code: "500", message: "Internal server error!" });
        }
    }

    // Get all tickets
    public static async getAllTickets(req: Request, res: Response) {
        const tickets = await TicketController.ticketRepository.getAll();
        res.status(200).render('home', { tickets: tickets });
    }

    // Get the total number of tickets
    public static async getTotalTicketNumber(req: Request, res: Response) {
        const tickets = await TicketController.ticketRepository.getAll();
        const formattedTickets = TicketController.formatToFourDigits(tickets.length);
        res.status(200).render('home', { totalTickets: formattedTickets.split('') });
    }

    // Format number to four digits
    private static formatToFourDigits(num: number): string {
        return num.toString().padStart(4, '0');
    }

    // Check if the OIB is valid
    private static isValidOIB(oib: string): boolean {
        return /^\d{11}$/.test(oib);
    }
}
