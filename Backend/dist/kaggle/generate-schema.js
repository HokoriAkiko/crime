"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate_schema = void 0;
const csvtojson_1 = __importDefault(require("csvtojson"));
const helpers_1 = require("../helpers");
const generate_schema = (files) => __awaiter(void 0, void 0, void 0, function* () {
    let skip = [];
    let converter_arr = [];
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
    let files_and_its_records = [];
    yield Promise.all(converter_arr).then((result) => {
        result.forEach((current, index) => {
            let final_obj = { info: [], words: [] };
            if (!!!(skip.findIndex((val) => val == index) >= 0) && Array.isArray(files.data)) {
                //TODO the error object to handle is left
                final_obj = Object.assign({ info: current, words: (0, helpers_1.extract_words_from_string)(files.data[index].name, ['_', '.'], true) }, files.data[index]);
                files_and_its_records.push(final_obj);
            }
        });
    });
    let schema = {};
    files_and_its_records.forEach((current_file) => {
        schema = Object.assign(Object.assign({}, schema), current_file.info[0]);
    });
    return files_and_its_records;
});
exports.generate_schema = generate_schema;
const check_file = (file) => {
    // const { name, data, size, encoding, tempFilePath, truncated, mimetype, md5, mv } = file;
    if (!check_mimetype(file.mimetype))
        return false;
    return true;
};
const check_mimetype = (mimetype) => mimetype == 'text/csv';
const csv_file_to_record = (file) => __awaiter(void 0, void 0, void 0, function* () {
    let arr = [];
    return yield (0, csvtojson_1.default)({ trim: true, flatKeys: true }).fromFile((0, helpers_1.get_file_path_from_tmp)(file.tempFilePath))
        .on('data', (data) => {
        arr.push(JSON.parse(data.toString()));
    })
        .on('error', (err) => { return { message: err.message, name: err.name }; })
        .on('end', () => {
        return Object.assign({ info: arr }, file);
    });
});
