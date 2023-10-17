import { record } from "../interfaces";
import { my_mongo } from "../server";
import { get_file_path_from_tmp, unlink_file_in_temp_filepath } from "../helpers";
import { GridFSBucketWriteStream, InsertManyResult, InsertOneResult, ObjectId } from "mongodb";
import * as file_system from 'fs';

export const handle_file_upload_to_mongo = async (f: record[]) => {

    for await (const rec of f) {
        const skip = await should_skip(rec);
        console.log('filename is : ', rec.name, '   skip : ', skip);

        if (!skip) {
            const { id } = await handle_raw_file_upload(rec); //id will be renamed as raw_id
            console.log('uploading of raw file result is : ', id);

            const { insertedId } = await handle_words_array_upload(rec, id);
            console.log('words array inseert result --->>', insertedId);

            const res = await handle_file_info_upload(rec, insertedId);
            console.log('file info result is --->>', res);
        }


        //once uploaded then temp file will be deleted
        unlink_file_in_temp_filepath(rec.tempFilePath);
    }
}

//how to skip insertion 
const should_skip = async (rec: record): Promise<boolean> => {

    const list = my_mongo.bucket.find({ metadata: { __filename: rec.name } });
    for await (const d of list) {
        return true;
    }
    return false;
}

//step 1 insert the raw file first
const handle_raw_file_upload = async (rec: record): Promise<GridFSBucketWriteStream> => {
    try {
        return file_system.createReadStream(get_file_path_from_tmp(rec.tempFilePath))
            .pipe(my_mongo.bucket.openUploadStream(get_file_path_from_tmp(rec.name), { chunkSizeBytes: 1048576, metadata: { __filename: rec.name } }));
    }
    catch (err) {
        unlink_file_in_temp_filepath(rec.tempFilePath);
        throw err;
    }
}

//step 2 use the raw file returned object id and uploasd words array as one record i.e.
// {
//     raw_id: 'jo-bhi-mili',
//     words_array : [],
// }
const handle_words_array_upload = async (rec: record, raw_id: ObjectId): Promise<InsertOneResult> => {
    try {
        return await my_mongo.db.collection(my_mongo.collection_names.words_array).insertOne({
            raw_id: raw_id,
            words_array: rec.words,
            source: 'kaggle'
        });
    }
    catch (err) {
        unlink_file_in_temp_filepath(rec.tempFilePath);
        throw err;
    }
}

//step 3 using the filename_words_id to insert its info i.e.
// {
//     filename_words_id : 'jo-bhi-id-aaye',
//     info : info_array_ka_each_element_hoga
// }
const handle_file_info_upload = async (rec: record, words_array_id: ObjectId): Promise<InsertManyResult> => {

    let docu_arr: any[] = [];
    rec.info.forEach(element => {
        docu_arr.push({
            words_array_id: words_array_id,
            ...element
        });
    });

    try {
        return await my_mongo.db.collection(my_mongo.collection_names.operational).insertMany(docu_arr);
    }
    catch (err) {
        unlink_file_in_temp_filepath(rec.tempFilePath);
        throw (err);
    }
}
