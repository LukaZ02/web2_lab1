import * as express from "express";
import { registerTicketRoutes} from "./ticketRoutes";

export const register = (app: express.Application) => {
    app.get('/', (req, res) => {
        res.render('index', { layout: 'layouts/layout' });
    });
    registerTicketRoutes(app);
}