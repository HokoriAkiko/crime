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
Object.defineProperty(exports, "__esModule", { value: true });
exports.file_handler = void 0;
const generate_schema_1 = require("../kaggle/generate-schema");
const kaggle_1 = require("../mongodb/kaggle");
const file_handler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let source_obj = { source: ((_a = req.body) === null || _a === void 0 ? void 0 : _a.source) ? req.body.source : "" };
    let files = Object.assign({ data: [] }, source_obj);
    if (req.files && req.files.data)
        files = Object.assign({ data: req.files.data }, source_obj);
    if (!Array.isArray(files.data))
        files.data = [files.data];
    //from hereon the files will come in data as array of objects
    if (source_obj.source == "") {
    }
    else if (source_obj.source == "kaggle") {
        const result = yield (0, generate_schema_1.generate_schema)(files);
        try {
            yield (0, kaggle_1.handle_file_upload_to_mongo)(result);
        }
        catch (err) {
            next(err);
        }
    }
    else if (source_obj.source == "data.gov") {
    }
    res.send('I am on it.....');
});
exports.file_handler = file_handler;
