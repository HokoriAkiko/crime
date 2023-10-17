import React, { useEffect, useState } from "react";
import "./home-style.css";
import { fetched_data, filter_data } from "../interfaces";
import { fetched_results, home_header_state } from "./home";

const EachSuggestion = (props: any) => {
    const { item, handle_suggestion_click } = props;
    const [h, set_h] = useState<boolean>(false);

    const str = !!item ? `${item[0].toUpperCase()}${item.slice(1).toLocaleLowerCase()}` : '';

    return <div className="suggestion_each"
        onMouseEnter={() => set_h(true)}
        onMouseLeave={() => set_h(false)}
        style={{
            backgroundColor: h ? 'rgba(225,225,225,0.5)' : 'rgba(255,255,255,1)'
        }}
        onClick={() => handle_suggestion_click(item)}
    >{str}</div>
}

const SuggestionList = (props: any) => {
    const states: home_header_state = props?.states;
    const { fetch_suggestions, set_header_states } = props;

    const [list, set_list] = useState<any[]>([]);
    const [in_focus, set_in_focus] = useState<boolean>(false);

    const handle_suggestion_click = (sugg: string) => {
        set_header_states({ ...states, input_string: sugg, input_focus: false });
        set_in_focus(false);
    }

    const list_height: string | number = !!states.input_string.length && list.length > 7 ? 450 : 'auto';

    useEffect(() => { handle_fetching() }, [states.input_string]);

    const handle_fetching = async () => {
        if (!!states.input_string) {
            const { data }: fetched_data = await fetch_suggestions({
                words: states.input_string.toLowerCase().split(' '),
                limit: 0,
                skip: 0,
                operational: 'NONE',
            });
            set_list(Array.from(data || [], (obj: fetched_results, i: number) => {
                return <EachSuggestion key={i} handle_suggestion_click={handle_suggestion_click} item={obj.from_chunk_collection.cleaned} />
            }));
        }
        else set_list([]);
    }

    if (states.input_focus || in_focus) {
        return (<div className="suggestion_box"
            style={{ height: list_height }}
            onMouseEnter={() => set_in_focus(true)}
            onMouseLeave={() => set_in_focus(false)}
        > {list}</div>)
    }
    return <></>;
}

const HeaderSearch = (props: any) => {
    const states: home_header_state = props?.header_states;
    const { set_header_states, fetch_suggestions, set_results, set_is_fetching } = props;

    const on_search = async () => {
        set_is_fetching(true);
        const { data }: fetched_data = await fetch_suggestions({
            words: states.input_string.toLowerCase().split(' '),
            limit: 100,
            skip: 0,
            operational: 'ONE'
        } as filter_data);
        set_results(data);
        set_is_fetching(false);
    }

    return (
        <div className="box_to_hold_search_input_and_button">
            <input className="input_search"
                placeholder="Try typing 'crime'"
                value={states.input_string}
                onChange={(e) => set_header_states({ ...states, input_string: e.target.value })}
                onFocus={() => { set_header_states({ ...states, input_focus: true }) }}
                onBlur={() => { set_header_states({ ...states, input_focus: false }) }}
            />
            <SuggestionList states={states} set_header_states={set_header_states} fetch_suggestions={fetch_suggestions} />
            <div className="clear_input_box" onClick={() => set_header_states({ ...states, input_string: '' })}>X</div>
            <div className="button_search" style={{ color: states.search_button_hover ? 'blue' : 'black' }}
                onMouseEnter={() => set_header_states({ ...states, search_button_hover: true })}
                onMouseLeave={() => set_header_states({ ...states, search_button_hover: false })}
                onClick={on_search}
            >
                search</div>
        </div>
    )
};

export default HeaderSearch;