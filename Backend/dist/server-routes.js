"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const file_handler_1 = require("./file/file-handler");
const error_handler_1 = require("./error-handler");
const data_fetch_1 = require("./data-fetch");
const init_routes = (app) => {
    app.get('/', (req, res, next) => {
        res.send('Huiui.....');
    });
    app.post('/upload_files', file_handler_1.file_handler, error_handler_1.error_handler);
    app.get('/get_unique_words', data_fetch_1.get_unique_words, error_handler_1.error_handler);
    app.post('/filter_data_using_words', data_fetch_1.filter_data_using_words, error_handler_1.error_handler);
    app.post('/fetch_graphs', data_fetch_1.fetch_graphs, error_handler_1.error_handler);
};
exports.default = init_routes;
