import { Request, Response, NextFunction } from "express"
import { my_mongo } from "./server";
import { FindOptions, ObjectId } from "mongodb";
import { extract_words_from_string } from "./helpers";
import { fetch_graphs_front, filter_data_front } from "./interfaces";

export const get_unique_words = async (req: Request, res: Response, next: NextFunction) => {
    let all_words: any = {};

    const result = my_mongo.db.collection(my_mongo.collection_names.words_array).find({});

    for await (const d of result) {
        const words_array: string[] = d.words_array;
        words_array.forEach(element => {
            if (!parseInt(element)) {
                all_words[element] = element;
            }
        });
    }

    res.send(Object.keys(all_words));
}

export const filter_data_using_words = async (req: Request, res: Response, next: NextFunction) => {
    const { words, limit, skip, operational }: filter_data_front = req.body;
    console.log('data from front is: ', req.body);
    let result = [];
    console.log('preparing response');
    const words_array_cursor = my_mongo.db.collection(my_mongo.collection_names.words_array).find().limit(limit).skip(skip);
    for await (const cursor of words_array_cursor) {
        const { words_array, raw_id, _id } = cursor;
        const original = await get_raw_file_filename(raw_id);
        const cleaned = extract_words_from_string(original, [' ', '_'], true).join(' ');

        const match = present_in_words_array(words, words_array);

        if (match) {
            const oper = await fetch_operational_using_words_array_id(_id, operational, limit, skip);
            result.push({
                from_chunk_collection: { cleaned },
                words_array_id: operational === 'LIMIT_SKIP' || operational === 'ONE' ? cursor : {},
                from_operational_collection: oper
            });
        }
    }

    console.log('results count : ', result.length);
    res.send(result);
}

//filter data using words exported function helpers below 
const present_in_words_array = (from_front: string[], from_db: string[]): boolean => {
    let present = false;
    for (let w = 0; w < from_front.length; w++) {
        const word = from_front[w];
        for (let i = 0; (!!word && i < from_db.length); i++) {
            const a = from_db[i].toLocaleLowerCase();
            const b = word.toLowerCase();
            present = a.includes(b) || b.includes(a);
            if (present) break;
        }
    }
    return present;
}

const get_raw_file_filename = async (id: ObjectId): Promise<string> => {
    const cursor = my_mongo.bucket.find({ _id: id });
    let result: string = '';
    for await (const c of cursor) {
        result = c?.metadata?.__filename;
        break;
    }
    return result;
}

const fetch_operational_using_words_array_id = async (id: ObjectId, dependency: string, limit: number = 0, skip: number = 0) => {

    let arr: any = [];
    try {
        const cursor = my_mongo.db.collection(my_mongo.collection_names.operational).find({ words_array_id: id });
        if (dependency == 'NONE') {
            return arr;
        }
        else if (dependency == 'ONE') {
            cursor.limit(1);
        }
        else if (dependency == 'LIMIT_SKIP') {
            cursor.limit(limit).skip(skip);
        }
        for await (const c of cursor) {
            arr.push(c);
        }
    }
    catch (err) { throw err; }
    return arr;
}

export const fetch_graphs = async (req: Request, res: Response, next: NextFunction) => {
    const { words_array_id } = req.body as fetch_graphs_front;
    const waid: ObjectId = new ObjectId(words_array_id);
    let operational: any[] = [];

    try {

        const p1: FindOptions<Document> = { projection: { raw_id: 0 } } //not asking for raw_id only
        const wac: any = await my_mongo.db.
            collection(my_mongo.collection_names.words_array).
            findOne({ _id: waid }, p1);

        const p2: FindOptions<Document> = { projection: { _id: 0, words_array_id: 0 } };
        const cursor = my_mongo.db.collection(my_mongo.collection_names.operational).find({ words_array_id: waid }, p2);
        for await (const c of cursor) {
            operational.push(c);
        }
        res.send({ wac, operational });
    }
    catch (err) { next(err) }
}