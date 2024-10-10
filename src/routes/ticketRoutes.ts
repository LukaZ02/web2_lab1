import * as express from "express";
import { TicketController } from "../controllers/ticketController";

export const ticketRoutes = (app: express.Application) => {
    //GET methods
    app.get('/', (req, res) => {
        res.redirect('/ticket/home');
    });
    app.get('/ticket/create', TicketController.renderCreateTicketForm);
    app.get('/ticket/home', TicketController.getTotalTicketNumber);

    //POST methods
    app.post('/ticket/create', TicketController.createTicket);
}