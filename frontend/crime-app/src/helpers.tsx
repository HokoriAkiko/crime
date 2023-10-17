import { fetched_data } from "./interfaces";

export const extract_fetched_data = async (data: any): Promise<fetched_data> => {
    const to_text: string = await data?.text();
    try {
        if (!!to_text) {
            return { data: JSON.parse(to_text) }
        }
        else {
            return { error: `Error data obtained is : ${to_text}` }
        }
    }
    catch (e) {
        if (!!to_text) { return { data: to_text } }
        else { return { error: e } }
    }
}

export const clean_string = (input: string, auto_cap_first: boolean = true): string => {
    let final: string = '';
    let arr: string[] = input.split('_');

    if (auto_cap_first) { arr[0] = arr[0][0].toUpperCase() + arr[0].slice(1).toLowerCase(); }
    else { arr[0] = arr[0].toLowerCase() }

    arr.forEach((str: string) => {
        final += str + ' '
    })

    return final;
}