import express, { Application } from 'express';
import expressEjsLayouts from 'express-ejs-layouts';
import { AppDataSource } from './data-source';
import dotenv from 'dotenv';
import path from 'path';
import { ticketRoutes } from './routes/ticketRoutes';

const app : Application = express();

//Setup Port
dotenv.config();
const port = process.env.SERVER_PORT || undefined;

//Setup Layouts
app.use(expressEjsLayouts);
app.set('layout', 'layouts/layout');

//Setup View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

//Setup Json Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Setup Routes
ticketRoutes(app)

//Connect to DataSource
AppDataSource.initialize().then(() => {
    console.log('DataSource connected successfully');
    app.listen(port, () => {
        console.log(`Connected successfully on port ${port}`);
    });
    }).catch((error) => {
        console.log('DataSource connection failed');
        console.log(error);
    });