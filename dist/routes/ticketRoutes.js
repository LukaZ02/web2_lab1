"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ticketRoutes = void 0;
const ticketController_1 = require("../controllers/ticketController");
const auth_1 = require("../middleware/auth");
const ticketRoutes = (app) => {
    //GET methods
    app.get('/', (req, res) => {
        res.redirect('/ticket/home');
    });
    app.get('/ticket/home', ticketController_1.TicketController.getTotalTicketNumber);
    app.get('/ticket/:uuid', ticketController_1.TicketController.getTicket);
    app.get('/login', ticketController_1.TicketController.logIn);
    app.get('/logout', ticketController_1.TicketController.logOut);
    //POST methods
    app.post('/ticket/createFromEndPoint', auth_1.verifyToken, ticketController_1.TicketController.createTicketFromEndPoint);
};
exports.ticketRoutes = ticketRoutes;
