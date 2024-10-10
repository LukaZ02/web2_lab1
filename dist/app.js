"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_ejs_layouts_1 = __importDefault(require("express-ejs-layouts"));
const data_source_1 = require("./data-source");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const ticketRoutes_1 = require("./routes/ticketRoutes");
const app = (0, express_1.default)();
//Setup Port
dotenv_1.default.config();
const port = process.env.SERVER_PORT || undefined;
//Setup Layouts
app.use(express_ejs_layouts_1.default);
app.set('layout', 'layouts/layout');
//Setup View Engine
app.set('view engine', 'ejs');
app.set('views', path_1.default.join(__dirname, 'views'));
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
//Setup Json Parser
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
//Setup Routes
(0, ticketRoutes_1.ticketRoutes)(app);
//Connect to DataSource
data_source_1.AppDataSource.initialize().then(() => {
    console.log('DataSource connected successfully');
    app.listen(port, () => {
        console.log(`Connected successfully on port ${port}`);
    });
}).catch((error) => {
    console.log('DataSource connection failed');
    console.log(error);
});
