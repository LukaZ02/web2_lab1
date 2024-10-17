import express, { Application } from 'express';
import expressEjsLayouts from 'express-ejs-layouts';
import { AppDataSource } from './data-source';
import dotenv from 'dotenv';
import path from 'path';
import { ticketRoutes } from './routes/ticketRoutes';
import {auth} from 'express-openid-connect';

const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.SECRET,
    baseURL: process.env.BASEURL,
    clientID: process.env.CLIENTID,
    issuerBaseURL: process.env.ISSUER
};

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

//Auth0
app.use(auth(config))

//Setup Routes
ticketRoutes(app)

//Connect to DataSource
AppDataSource.initialize().then(() => {
    app.listen(port, () => {

    });
    }).catch((error) => {

    });