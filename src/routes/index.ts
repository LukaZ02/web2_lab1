import * as express from "express";
import { registerTicketRoutes} from "./ticketRoutes";

export const register = (app: express.Application) => {
    registerTicketRoutes(app)
}