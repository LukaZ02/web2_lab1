"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketController = void 0;
const ticketRepository_1 = require("../repositories/ticketRepository");
const ticket_1 = require("../entities/ticket");
const qrcode_generator_1 = __importDefault(require("qrcode-generator"));
class TicketController {
    //logIn using auth0 OIDC
    static logIn(req, res) {
        res.redirect('/login');
    }
    //logOut using auth0 OIDC
    static logOut(req, res) {
        res.redirect('/logout');
    }
    //Create a new ticket from an endpoint
    static createTicketFromEndPoint(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { vatin, firstName, lastName } = req.body;
            if (!TicketController.isValidOIB(vatin)) {
                res.status(400).json({ message: "Invalid OIB!" });
                return;
            }
            if (!firstName || !lastName || firstName === "" || lastName === "") {
                res.status(400).json({ message: "First name and last name are required!" });
                return;
            }
            if ((yield TicketController.getAllTicketsByOIB(vatin)) >= 3) {
                res.status(400).json({ message: "You have reached the maximum number of tickets!" });
                return;
            }
            try {
                const newTicket = new ticket_1.Ticket(vatin, firstName, lastName);
                const uuid = (yield TicketController.ticketRepository.create(newTicket)).uuid;
                const qr = (0, qrcode_generator_1.default)(0, 'M');
                qr.addData('http://localhost:3000/ticket/' + uuid);
                qr.make();
                const qrImage = qr.createDataURL(10, 0);
                if (!req.oidc.isAuthenticated()) {
                    res.status(200).render("ticketQR", { qrCodeData: qrImage, isAuthenticated: false, name: undefined });
                    return;
                }
                res.status(200).render("ticketQR", { qrCodeData: qrImage, isAuthenticated: true, name: (_a = req.oidc.user) === null || _a === void 0 ? void 0 : _a.name });
            }
            catch (error) {
                res.status(500).json({ message: "Internal server error!" });
            }
        });
    }
    //Show ticket information
    static getTicket(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const uuid = req.params.uuid;
            if (!req.oidc.isAuthenticated()) {
                res.status(400).render('failure', { code: "401", message: "Please login to view the ticket!", isAuthenticated: false, name: undefined });
                return;
            }
            try {
                const ticket = yield TicketController.ticketRepository.findByUUID(uuid);
                if (!ticket) {
                    res.status(400).render('failure', { code: "404", message: "Ticket not found!", isAuthenticated: true, name: (_a = req.oidc.user) === null || _a === void 0 ? void 0 : _a.name });
                    return;
                }
                res.status(200).render('ticketInfo', { oib: ticket.oib, firstName: ticket.firstName, lastName: ticket.lastName, isAuthenticated: true, name: (_b = req.oidc.user) === null || _b === void 0 ? void 0 : _b.name });
            }
            catch (error) {
                res.status(500).render('failure', { code: "500", message: "Internal server error!", isAuthenticated: true, name: (_c = req.oidc.user) === null || _c === void 0 ? void 0 : _c.name });
            }
        });
    }
    // Get all tickets
    static getAllTicketsByOIB(oib) {
        return __awaiter(this, void 0, void 0, function* () {
            const tickets = yield TicketController.ticketRepository.findByOIB(oib);
            return tickets.length;
        });
    }
    // Get the total number of tickets
    static getTotalTicketNumber(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const tickets = yield TicketController.ticketRepository.getAll();
            const formattedTickets = TicketController.formatToFourDigits(tickets.length);
            if (req.oidc.isAuthenticated()) {
                res.status(200).render('home', { totalTickets: formattedTickets.split(''), isAuthenticated: true, name: (_a = req.oidc.user) === null || _a === void 0 ? void 0 : _a.name });
            }
            else {
                res.status(200).render('home', { totalTickets: formattedTickets.split(''), isAuthenticated: false, name: undefined });
            }
        });
    }
    // Format number to four digits
    static formatToFourDigits(num) {
        return num.toString().padStart(4, '0');
    }
    // Check if the OIB is valid
    static isValidOIB(oib) {
        return /^\d{11}$/.test(oib);
    }
}
exports.TicketController = TicketController;
TicketController.ticketRepository = new ticketRepository_1.TicketRepository();
