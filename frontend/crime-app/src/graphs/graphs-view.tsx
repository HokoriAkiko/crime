import React, { useEffect, useState } from "react";
import { fetched_data } from "../interfaces";
import "./graphs.css"
import { extract_fetched_data } from "../helpers";

import GraphsViewLeftSide from "./graphs-view-left-side";
import GraphsNavigation from "./graphs-navigation";


export const is_no_filter_value_selected = (filter: any): boolean => {
    const working_obj = filter || {};
    const num_keys: string[] = Object.keys(filter);

    let empty_keys: number = 0;
    for (let i = 0; i < num_keys.length; i++) {
        if (!!!working_obj[num_keys[i]].length) { empty_keys++ }
    }

    return num_keys.length === empty_keys;
}



const GraphsView = (props: any) => {
    const waid = props?.words_array_id?._id || 'not-yet';
    const [data, set_data] = useState<any>();
    const [filter, set_filter] = useState<any>([]);
    const [show_graphs, set_show_graphs] = useState<any>({ index: -1, list: [] });


    // let graph_list_ref = useRef(null);

    const fetch_graphs = async () => {
        const { data: { wac, operational }, error }: fetched_data = await fetch('http://localhost:5612/fetch_graphs', {
            method: 'POST',
            body: JSON.stringify({ words_array_id: waid }),
            headers: { "Content-Type": "application/json", }
        })
            .then(extract_fetched_data)
            .catch(err => console.log(err || error)) as fetched_data;

        set_data({ wac, operational })
    }

    const matching_with_filter = (data: any[], filter: any) => {
        if (!!!data) return [];
        if (!!!filter) return [];
        let result: any[] = [];

        //data.length
        for (let i = 0; i < data.length; i++) {
            const obj = data[i];
            let condtion: any = {};
            for (const filter_key in filter) {
                const arr: any[] = filter[filter_key];
                for (let j = 0; j < arr.length; j++) {
                    if (obj[filter_key] === arr[j].value) { condtion[filter_key] = arr[j].value; break; }
                }
            }
            if (Object.keys(filter).length === Object.keys(condtion).length) { result.push(i); }
        }
        set_show_graphs({
            index: result.length > 0 ? 0 : -1,
            list: result
        })
    }

    // const handle_center_scrolling = (target: any) => {
    //     const graph_list_exposed: any = graph_list_ref.current;
    //     graph_list_exposed?.scroll_to_graph(target);
    // }

    useEffect(() => { fetch_graphs() }, []);
    useEffect(() => { matching_with_filter(data?.operational, filter) }, [filter]);


    return <>{!!data ?
        <div className="box_to_hold_everything">
            <GraphsViewLeftSide data={data} set_filter={set_filter} filter={filter} />
            <GraphsNavigation
                show_graphs={show_graphs}
                filter={filter}
                original={data?.operational || []}
                set_show_graphs={set_show_graphs}
            />
        </div>
        : 'Retrieving information...'}
    </>
};

export default GraphsView;