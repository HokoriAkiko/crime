import { Express, NextFunction, Request, Response } from "express";
import { file_handler } from "./file/file-handler";
import { error_handler } from "./error-handler";
import { fetch_graphs, filter_data_using_words, get_unique_words } from "./data-fetch";

const init_routes = (app: Express) => {
    app.get('/', (req: Request, res: Response, next: NextFunction) => {
        res.send('Huiui.....');
    });

    app.post('/upload_files', file_handler, error_handler);

    app.get('/get_unique_words', get_unique_words, error_handler);

    app.post('/filter_data_using_words', filter_data_using_words, error_handler);

    app.post('/fetch_graphs', fetch_graphs, error_handler);

};

export default init_routes;