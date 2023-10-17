import efu from "express-fileupload";
import { Express } from "express";
import bodyParser from "body-parser";
const cors = require('cors');



const init_dependencies = (app: Express) => {
    app.use(efu({
        useTempFiles: true,
        tempFileDir: 'tmp'
    }));

    app.use(cors()); // to by pass cross origin policy something

    app.use(bodyParser.json()) // this will let me to extract request body object to process further
};

export default init_dependencies;
