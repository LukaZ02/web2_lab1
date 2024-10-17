import { TicketRepository } from "../repositories/ticketRepository";
import { Request, Response } from "express";
import { Ticket } from "../entities/ticket";
import QRCode from 'qrcode-generator';

export class TicketController {
    private static ticketRepository = new TicketRepository();

    //logIn using auth0 OIDC
    public static logIn(req: Request, res: Response) {
        res.redirect('/login');
    }

    //logOut using auth0 OIDC
    public static logOut(req: Request, res: Response) {
        res.redirect('/logout');
    }

    //Create a new ticket from an endpoint
    public static async createTicketFromEndPoint(req: Request, res: Response) {
        const { vatin, firstName, lastName } = req.body;
        if(!TicketController.isValidOIB(vatin)) {
            res.status(400).json({ message: "Invalid OIB!" });
            return;
        }
        if (!firstName || !lastName || firstName === "" || lastName === "") {
            res.status(400).json({ message: "First name and last name are required!" });
            return;
        }
        if (await TicketController.getAllTicketsByOIB(vatin) >= 3) {
            res.status(400).json({ message: "You have reached the maximum number of tickets!" });
            return;
        }
        try {
            const newTicket = new Ticket(vatin, firstName, lastName);
            const uuid = (await TicketController.ticketRepository.create(newTicket)).uuid;
            const qr = QRCode(0, 'M');
            qr.addData('https://web2-lab1-kz9s.onrender.com/ticket/' + uuid);
            qr.make();
            const qrImage : string = qr.createDataURL(10, 0);
            if (!req.oidc.isAuthenticated()) {
                res.status(200).render("ticketQR", {qrCodeData: qrImage, isAuthenticated: false, name: undefined});
                return;
            }
            res.status(200).render("ticketQR", {qrCodeData: qrImage, isAuthenticated: true, name: req.oidc.user?.name});
        } catch (error) {
            res.status(500).json({ message: "Internal server error!" });
        }
    }

    //Show ticket information
    public static async getTicket(req: Request, res: Response) {
        const uuid = req.params.uuid;
        if (!req.oidc.isAuthenticated()) {
            res.status(400).render('failure', { code: "401", message: "Please login to view the ticket!", isAuthenticated: false, name: undefined });
            return;
        }
        try {
            const ticket = await TicketController.ticketRepository.findByUUID(uuid);
            if (!ticket) {
                res.status(400).render('failure', { code: "404", message: "Ticket not found!", isAuthenticated: true, name: req.oidc.user?.name });
                return;
            }
            res.status(200).render('ticketInfo', { oib: ticket.oib, firstName: ticket.firstName , lastName: ticket.lastName ,isAuthenticated: true, name: req.oidc.user?.name });

        } catch (error) {
            res.status(500).render('failure', { code: "500", message: "Internal server error!", isAuthenticated: true, name: req.oidc.user?.name });
        }
    }

    // Get all tickets
    private static async getAllTicketsByOIB(oib : string) {
        const tickets = await TicketController.ticketRepository.findByOIB(oib);
        return tickets.length;
    }

    // Get the total number of tickets
    public static async getTotalTicketNumber(req: Request, res: Response) {
        const tickets = await TicketController.ticketRepository.getAll();
        const formattedTickets = TicketController.formatToFourDigits(tickets.length);
        if(req.oidc.isAuthenticated()) {
            res.status(200).render('home', { totalTickets: formattedTickets.split(''), isAuthenticated: true , name: req.oidc.user?.name });
        } else {
            res.status(200).render('home', { totalTickets: formattedTickets.split(''), isAuthenticated: false, name: undefined });
        }
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
