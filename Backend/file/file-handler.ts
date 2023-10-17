
import { Request, Response, NextFunction } from "express";
import { file_info } from "../interfaces";
import { generate_schema as kaggle_schema } from "../kaggle/generate-schema";
import { handle_file_upload_to_mongo } from "../mongodb/kaggle";




export const file_handler = async (req: Request, res: Response, next: NextFunction) => {

    let source_obj = { source: req.body?.source ? req.body.source : "" };
    let files: file_info = { data: [], ...source_obj };

    if (req.files && req.files.data) files = { data: req.files.data, ...source_obj }

    if (!Array.isArray(files.data)) files.data = [files.data];


    //from hereon the files will come in data as array of objects

    if (source_obj.source == "") {

    }
    else if (source_obj.source == "kaggle") {
        const result = await kaggle_schema(files);
        try {
            await handle_file_upload_to_mongo(result);
        }
        catch (err) {
            next(err);
        }
    }
    else if (source_obj.source == "data.gov") {

    }



    res.send('I am on it.....')
}