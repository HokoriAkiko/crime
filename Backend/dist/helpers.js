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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unlink_file_in_temp_filepath = exports.get_readstream_from_tmp_filepath = exports.get_file_path_from_tmp = exports.extract_words_from_string = void 0;
const file_system = __importStar(require("fs"));
const path_1 = __importDefault(require("path"));
const arr = [' ', '_', '.'];
const my_connector = '|';
const file_formats = ['.csv'];
const extract_words_from_string = (str, split_on_char, remove_non_years) => {
    let temp_str = str;
    //doing primary cleanup
    split_on_char.forEach((current) => {
        temp_str = temp_str.split(current).join(my_connector);
    });
    //removing any file format in the file name 
    file_formats.forEach((current) => {
        temp_str = temp_str.split(current).join('');
    });
    //removing unneccary numbers except any year 
    if (remove_non_years)
        temp_str = remove_non_years_from_string(temp_str, my_connector);
    //finishing touches
    const words = temp_str.split(my_connector);
    words.pop(); // removing empty string 
    return words;
};
exports.extract_words_from_string = extract_words_from_string;
const remove_non_years_from_string = (str, split_on_char) => {
    let arr = str.split(split_on_char);
    let final = '';
    arr.forEach((item) => {
        const num = parseInt(item);
        if (num) {
            if (num >= 1970) {
                final = final + item + split_on_char;
            }
        }
        else {
            final = final + item + split_on_char;
        }
    });
    return final;
};
const get_file_path_from_tmp = (temp_file_path) => {
    return path_1.default.join(process.cwd(), temp_file_path);
};
exports.get_file_path_from_tmp = get_file_path_from_tmp;
const get_readstream_from_tmp_filepath = (temp_file_path) => {
    return file_system.createReadStream(path_1.default.join(process.cwd(), temp_file_path));
};
exports.get_readstream_from_tmp_filepath = get_readstream_from_tmp_filepath;
const unlink_file_in_temp_filepath = (temp_file_path) => {
    file_system.unlinkSync(temp_file_path);
};
exports.unlink_file_in_temp_filepath = unlink_file_in_temp_filepath;
