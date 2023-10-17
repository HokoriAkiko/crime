import React, { useState } from "react";
import HomeHeader from "./header";
import HomeMain from "./home-main";
import { fetched_data, filter_data } from "../interfaces";
import { extract_fetched_data } from "../helpers";


export interface home_header_state {
    search_button_hover: boolean;
    input_string: string;
    input_focus: boolean;
}

export interface fetched_results {
    from_chunk_collection: { cleaned: string; },
    from_operational_collection: any[]
}

const Home = (props: any) => {
    const [header_states, set_header_states] = useState<home_header_state>({
        search_button_hover: false,
        input_string: '',
        input_focus: false,
    });
    const [results, set_results] = useState<fetched_results>();
    const [is_fetching, set_is_fetching] = useState<boolean>(false);

    const fetch_suggestions = async (for_back: filter_data): Promise<fetched_data> => {
        return await fetch("http://localhost:5612/filter_data_using_words", {
            method: "POST",
            body: JSON.stringify(for_back),
            headers: { "Content-Type": "application/json", }
        })
            .then(extract_fetched_data)
            .catch(e => { return { error: `${e}` } }) as fetched_data;
    }

    return (
        <>
            <HomeHeader header_states={header_states}
                set_header_states={set_header_states}
                results={results}
                set_results={set_results} fetch_suggestions={fetch_suggestions}
                set_is_fetching={set_is_fetching}
            />

            <HomeMain info={results} is_fetching={is_fetching} {...props} />
        </>
    );
};

export default Home;