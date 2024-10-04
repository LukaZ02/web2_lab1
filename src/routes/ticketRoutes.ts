import * as express from "express";
import { TicketController } from "../controllers/ticketController";

export const registerTicketRoutes = (app: express.Application) => {
    app.post('/ticket/create', TicketController.createTicket);
    app.get('/ticket/getAll', TicketController.getAllTickets);
}