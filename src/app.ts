import express, {Application, Request, Response} from 'express';
import expressEjsLayouts from "express-ejs-layouts";
import dotenv from "dotenv";
import path from "path";

import * as routes from "./routes";

const app : Application = express();

//Setup Port
dotenv.config();
const port = process.env.SERVER_PORT;
app.listen(port, () => {
    console.log(`Connected successfully on port ${port}`);
});

//Setup Layouts
app.use(expressEjsLayouts);
app.set('layout', 'layouts/layout');

//Setup View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Setup Routes
routes.register(app);
