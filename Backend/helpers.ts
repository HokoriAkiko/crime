import * as file_system from "fs";
import path from "path";

const arr = [' ', '_', '.'];
const my_connector = '|';
const file_formats = ['.csv'];

export const extract_words_from_string = (str: string, split_on_char: string[], remove_non_years: boolean): string[] => {

    let temp_str = str;

    //doing primary cleanup
    split_on_char.forEach((current) => {
        temp_str = temp_str.split(current).join(my_connector);
    })

    //removing any file format in the file name 
    file_formats.forEach((current) => {
        temp_str = temp_str.split(current).join('');
    })

    //removing unneccary numbers except any year 
    if (remove_non_years) temp_str = remove_non_years_from_string(temp_str, my_connector);

    //finishing touches
    const words: string[] = temp_str.split(my_connector);
    words.pop(); // removing empty string 
    return words;
}

const remove_non_years_from_string = (str: string, split_on_char: string) => {
    let arr: string[] = str.split(split_on_char);
    let final: string = '';

    arr.forEach((item) => {
        const num = parseInt(item);
        if (num) {
            if (num >= 1970) { final = final + item + split_on_char; }
        }
        else { final = final + item + split_on_char; }

    })

    return final;
}

export const get_file_path_from_tmp = (temp_file_path: string): string => {
    return path.join(process.cwd(), temp_file_path);
}

export const get_readstream_from_tmp_filepath = (temp_file_path: string): file_system.ReadStream => {

    return file_system.createReadStream(path.join(process.cwd(), temp_file_path));
}

export const unlink_file_in_temp_filepath = (temp_file_path: string) => {
    file_system.unlinkSync(temp_file_path);
}