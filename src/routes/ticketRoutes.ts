import * as express from "express";
import { TicketController } from "../controllers/ticketController";
import {verifyToken} from "../middleware/auth";

export const ticketRoutes = (app: express.Application) => {
    //GET methods
    app.get('/', (req, res) => {
        res.redirect('/ticket/home');
    });
    app.get('/ticket/home', TicketController.getTotalTicketNumber);
    app.get('/ticket/:uuid', TicketController.getTicket);
    app.get('/login', TicketController.logIn);
    app.get('/logout', TicketController.logOut);

    //POST methods
    app.post('/ticket/createFromEndPoint', verifyToken, TicketController.createTicketFromEndPoint);
}