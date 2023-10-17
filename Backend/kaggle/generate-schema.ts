import { UploadedFile } from "express-fileupload";
import { error_info, file_info, record } from "../interfaces"
import converter from "csvtojson";
import { extract_words_from_string, get_file_path_from_tmp, get_readstream_from_tmp_filepath, unlink_file_in_temp_filepath } from "../helpers";

export const generate_schema = async (files: file_info): Promise<record[]> => {

    let skip: number[] = [];
    let converter_arr: Promise<any>[] = [];

    if (Array.isArray(files.data)) {
        files.data.forEach((element, index) => {
            if (check_file(element)) {
                converter_arr.push(csv_file_to_record(element));
            }
            else {
                skip.push(index);
            }
        });
    }


    let files_and_its_records: record[] = [];

    await Promise.all(converter_arr).then((result) => {
        result.forEach((current: any[], index: number) => {
            let final_obj: Partial<record> = { info: [], words: [] };

            if (! !!(skip.findIndex((val) => val == index) >= 0) && Array.isArray(files.data)) {

                //TODO the error object to handle is left
                final_obj = {
                    info: current,
                    words: extract_words_from_string(files.data[index].name, ['_', '.'], true),
                    ...files.data[index]
                };
                files_and_its_records.push(final_obj as record);
            }
        })
    })

    let schema: any = {};

    files_and_its_records.forEach((current_file: record) => {
        schema = { ...schema, ...current_file.info[0] };
    })

    return files_and_its_records;
}



const check_file = (file: UploadedFile) => {
    // const { name, data, size, encoding, tempFilePath, truncated, mimetype, md5, mv } = file;

    if (!check_mimetype(file.mimetype)) return false;

    return true;
}

const check_mimetype = (mimetype: string) => mimetype == 'text/csv';

const csv_file_to_record = async (file: UploadedFile) => {
    let arr: any[] = [];
    return await converter({ trim: true, flatKeys: true }).fromFile(get_file_path_from_tmp(file.tempFilePath))
        .on('data', (data) => {
            arr.push(JSON.parse(data.toString()));
        })
        .on('error', (err) => { return { message: err.message, name: err.name } as error_info })
        .on('end', () => {
            return {
                info: arr,
                ...file
            } as record;
        });
}