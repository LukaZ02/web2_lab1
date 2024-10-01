import {Request, Response} from "express";

class IndexController {
    public static index = (req : Request, res : Response) => {
        res.render('index.ejs');
    }
}
export default IndexController;