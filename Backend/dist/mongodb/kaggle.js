"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handle_file_upload_to_mongo = void 0;
const server_1 = require("../server");
const helpers_1 = require("../helpers");
const file_system = __importStar(require("fs"));
const handle_file_upload_to_mongo = (f) => { var _a, f_1, f_1_1; return __awaiter(void 0, void 0, void 0, function* () {
    var _b, e_1, _c, _d;
    try {
        for (_a = true, f_1 = __asyncValues(f); f_1_1 = yield f_1.next(), _b = f_1_1.done, !_b; _a = true) {
            _d = f_1_1.value;
            _a = false;
            const rec = _d;
            const skip = yield should_skip(rec);
            console.log('filename is : ', rec.name, '   skip : ', skip);
            if (!skip) {
                const { id } = yield handle_raw_file_upload(rec); //id will be renamed as raw_id
                console.log('uploading of raw file result is : ', id);
                const { insertedId } = yield handle_words_array_upload(rec, id);
                console.log('words array inseert result --->>', insertedId);
                const res = yield handle_file_info_upload(rec, insertedId);
                console.log('file info result is --->>', res);
            }
            //once uploaded then temp file will be deleted
            (0, helpers_1.unlink_file_in_temp_filepath)(rec.tempFilePath);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (!_a && !_b && (_c = f_1.return)) yield _c.call(f_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
}); };
exports.handle_file_upload_to_mongo = handle_file_upload_to_mongo;
//how to skip insertion 
const should_skip = (rec) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_2, _b, _c;
    const list = server_1.my_mongo.bucket.find({ metadata: { __filename: rec.name } });
    try {
        for (var _d = true, list_1 = __asyncValues(list), list_1_1; list_1_1 = yield list_1.next(), _a = list_1_1.done, !_a; _d = true) {
            _c = list_1_1.value;
            _d = false;
            const d = _c;
            return true;
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (!_d && !_a && (_b = list_1.return)) yield _b.call(list_1);
        }
        finally { if (e_2) throw e_2.error; }
    }
    return false;
});
//step 1 insert the raw file first
const handle_raw_file_upload = (rec) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return file_system.createReadStream((0, helpers_1.get_file_path_from_tmp)(rec.tempFilePath))
            .pipe(server_1.my_mongo.bucket.openUploadStream((0, helpers_1.get_file_path_from_tmp)(rec.name), { chunkSizeBytes: 1048576, metadata: { __filename: rec.name } }));
    }
    catch (err) {
        (0, helpers_1.unlink_file_in_temp_filepath)(rec.tempFilePath);
        throw err;
    }
});
//step 2 use the raw file returned object id and uploasd words array as one record i.e.
// {
//     raw_id: 'jo-bhi-mili',
//     words_array : [],
// }
const handle_words_array_upload = (rec, raw_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield server_1.my_mongo.db.collection(server_1.my_mongo.collection_names.words_array).insertOne({
            raw_id: raw_id,
            words_array: rec.words,
            source: 'kaggle'
        });
    }
    catch (err) {
        (0, helpers_1.unlink_file_in_temp_filepath)(rec.tempFilePath);
        throw err;
    }
});
//step 3 using the filename_words_id to insert its info i.e.
// {
//     filename_words_id : 'jo-bhi-id-aaye',
//     info : info_array_ka_each_element_hoga
// }
const handle_file_info_upload = (rec, words_array_id) => __awaiter(void 0, void 0, void 0, function* () {
    let docu_arr = [];
    rec.info.forEach(element => {
        docu_arr.push(Object.assign({ words_array_id: words_array_id }, element));
    });
    try {
        return yield server_1.my_mongo.db.collection(server_1.my_mongo.collection_names.operational).insertMany(docu_arr);
    }
    catch (err) {
        (0, helpers_1.unlink_file_in_temp_filepath)(rec.tempFilePath);
        throw (err);
    }
});
