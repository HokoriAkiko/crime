import { UploadedFile } from "express-fileupload";
import { ObjectId } from "mongodb";

export interface file_info {
    data: UploadedFile | UploadedFile[];
    source: "data.gov" | "kaggle" | "";
}

export interface record extends UploadedFile {
    info: any[];
    words: string[];
}

export interface error_info {
    message: string;
    name: string;
}

//look at it when needed reference mayidk
export interface words_array_interface {
    _id?: ObjectId;
    raw_id: ObjectId;
    words_array: string[];
    source: string;
}

//front end based interfaces 
export interface filter_data_front {
    words: string[] | [];
    limit: number;
    skip: number;
    operational: 'ONE' | 'NONE' | 'LIMIT_SKIP';
}

export interface fetch_graphs_front {
    words_array_id: string
}