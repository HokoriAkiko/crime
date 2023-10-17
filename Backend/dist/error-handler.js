"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.error_handler = void 0;
const error_handler = (req, res, err) => {
    res.send({
        message: `${err}`
    });
};
exports.error_handler = error_handler;
