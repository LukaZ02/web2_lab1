"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const ticketRoutes_1 = require("./ticketRoutes");
const register = (app) => {
    (0, ticketRoutes_1.registerTicketRoutes)(app);
};
exports.register = register;
