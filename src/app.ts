import express, { Application } from 'express';
import expressEjsLayouts from 'express-ejs-layouts';
import { AppDataSource } from './data-source';
import dotenv from 'dotenv';
import path from 'path';
import { ticketRoutes } from './routes/ticketRoutes';
import {auth} from 'express-openid-connect';
import * as https from "node:https";
import * as fs from "node:fs";

const app : Application = express();

//Setup Port
dotenv.config();
const externalUrl = process.env.RENDER_EXTERNAL_URL;
const port = externalUrl && process.env.PORT ? parseInt(process.env.PORT) : 4080;

const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.SECRET,
    baseURL: externalUrl || `https://localhost:${port}`,
    clientID: process.env.CLIENTID,
    issuerBaseURL: process.env.ISSUER
};

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
    if (externalUrl) {
        const hostname = '0.0.0.0'; //ne 127.0.0.1
        app.listen(port, hostname, () => {
            console.log(`Server locally running at http://${hostname}:${port}/ and from outside on ${externalUrl}`);
        });
    } else {
        https.createServer({
            key: fs.readFileSync('server.key'),
            cert: fs.readFileSync('server.cert')
        }, app)
            .listen(port, function () {
                console.log(`Server running at https://localhost:${port}/`);
        });
    }
});