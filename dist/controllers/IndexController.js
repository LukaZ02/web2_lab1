"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class IndexController {
}
IndexController.index = (req, res) => {
    res.render('index.ejs');
};
exports.default = IndexController;
