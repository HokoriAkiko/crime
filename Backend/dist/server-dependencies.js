"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors = require('cors');
const init_dependencies = (app) => {
    app.use((0, express_fileupload_1.default)({
        useTempFiles: true,
        tempFileDir: 'tmp'
    }));
    app.use(cors()); // to by pass cross origin policy something
    app.use(body_parser_1.default.json()); // this will let me to extract request body object to process further
};
exports.default = init_dependencies;
