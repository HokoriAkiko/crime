import React, { useEffect, useState } from 'react'
import './graphs-left.css'
import { clean_string } from '../helpers';
import toggle_svg from '../Assets/icons/down-arrow.svg'
import tick_svg from '../Assets/icons/tick.svg';
const _ = require('lodash');


const categorize_data = (obj: any): void => {
    // will be like this ->
    // key_val_dup = {
    //     'STATE/UT': [{ value: 'UP',count: 1}, {},{},{}],
    //     'YEAR': [{value: '2002',count: 4},{},{},{}],
    //     ......
    // }
    let key_val_dup: any = {};
    if (!!!obj) { console.log('data not present yet...'); return; }

    const operational: any[] = obj.operational;
    const keys = Object.keys(operational[0]);


    keys.forEach((k) => {
        const val = parseInt(operational[0][k]);
        if (!!!val && val !== 0) { key_val_dup[k] = []; }
        else {
            if (k.toLocaleLowerCase() === 'year') { key_val_dup[k] = []; }
        }
    })

    const get_index_of_a_column_value = (name: string, value: string): number => {
        const arr: any[] = key_val_dup[name];
        for (let i = 0; i < arr.length; i++) {
            //will have value and count in it
            // arr[i] will be like this {value: 'some-column-name',count: 1}
            //if arr[i] is simply not there then simply return -1 saying not found 
            if (!!arr[i].value) {
                if (arr[i].value === value) { return i; }
            }
        }
        return -1;
    }

    operational.forEach(element => {
        for (const k in element) {
            const present_in_kvd = !!key_val_dup[k];
            if (present_in_kvd) {
                const current_key = k; //STATE/UT
                const current_value = element[k];//AHMEDABAD
                const i = get_index_of_a_column_value(current_key, current_value);

                if (i === -1) {
                    key_val_dup[current_key].push({ value: current_value, count: 1 })
                }
                else key_val_dup[current_key][i].count++;
            }

        }
    })
    return key_val_dup;
}

const StringFilterEachValue = (props: any) => {
    const { label: { key, value }, filter_info, set_filter_info } = props;
    const [h, set_h] = useState<boolean>(false);
    const is_present = (): boolean => {
        const arr: any[] = filter_info[key] || [];
        return arr.findIndex((current_obj: any) => current_obj.value === value) >= 0;
    }

    const handle_click = () => {
        let temp: any[] = [];
        if (is_present()) {
            filter_info[key].forEach((current: any) => {
                if (current.value !== value) { temp.push(current) }
            });
        }
        else {
            temp = filter_info[key];
            temp.push({ value });
        }

        set_filter_info({ ...filter_info, [key]: temp })
    }

    return (
        <div className='box_to_hold_each_filter_value_and_icon'
            onMouseEnter={() => set_h(true)}
            onMouseLeave={() => set_h(false)}
            onClick={handle_click}
            style={{
                backgroundColor: h ? 'rgba(72,201,176,1)' : 'white',
                color: h ? 'white' : 'grey',
            }}
        >
            <div className='box_to_hold_each_filter_value'>
                {clean_string(value)}
            </div>
            <div className='box_to_hold_each_filter_icon'>
                {is_present() ? <img
                    src={tick_svg}
                    alt='tick'
                    style={{
                        width: '10px',
                        height: '10px',
                        filter: h ? 'invert(99%) sepia(75%) saturate(691%) hue-rotate(202deg) brightness(122%) contrast(100%)' : ''
                    }} /> : null}
            </div>
        </div>
    )
}

const StringFilterValuesList = (props: any) => {
    const { working_obj: { key, value }, search_str, filter_info, set_filter_info } = props;
    const match_string = (search: string, original: string): boolean => {
        return original.split(',').join().toLowerCase().includes(search.toLowerCase());
    }

    const make_list_using_search_string = () => {
        let arr: any[] = [];
        if (!!!search_str) return arr;
        if (!!!value) return arr;
        for (let i = 0; i < value.length; i++) {
            const for_check: string = value[i].value;
            if (match_string(search_str, for_check)) {
                arr.push(<StringFilterEachValue key={i} label={{ key, value: for_check }} filter_info={filter_info} set_filter_info={set_filter_info} />)
            }
        }
        return arr;
    }

    return (
        <div className='box_to_hold_filter_values'>
            {make_list_using_search_string()}
        </div>
    );
}

const CurrentlySelected = (props: any) => {
    const { working_obj: { key }, filter_info } = props;

    const make_list = () => {
        let arr: any[] = [];
        if (!!!filter_info[key]) return arr;
        for (let i = 0; i < filter_info[key].length; i++) {
            const v = filter_info[key][i].value;
            arr.push(
                <div
                    key={i}
                    style={{
                        color: 'white',
                        backgroundColor: 'rgba(93,173,226,0.75)',
                        fontSize: '12px',
                        borderRadius: '5px',
                        padding: '3px',
                        display: 'inline-block',
                        margin: '2px'
                    }}
                >{clean_string(v)}
                </div>
            )
        }
        return arr;
    }

    return (
        <div
            style={{
                backgroundColor: 'white',
                height: !!filter_info[key] && filter_info[key].length > 5 ? '150px' : 'auto',
                overflowY: 'scroll',
                borderRight: '0px',
            }}>
            {make_list()}
        </div>
    )
}

const StringFilter = (props: any) => {
    const { working_obj, filter_info, original_map, set_filter_info } = props;
    const { key } = working_obj;

    const [toggle_expand, set_toggle_expand] = useState<boolean>(true);
    const [search_str, set_search_str] = useState<string>('');
    const [clear_h, set_clear_h] = useState<boolean>(false);
    const [clear_button_h, set_clear_button_h] = useState<boolean>(false);
    const [select_all_h, set_select_all_h] = useState<boolean>(false);
    const [toggle_h, set_toggle_h] = useState<boolean>(false);

    const handle_clear_all = () => {
        set_filter_info({ ...filter_info, [key]: [] });
    }

    const handle_select_all = () => {
        set_filter_info({ ...filter_info, [key]: original_map[key] });
    }

    return (
        <div className='box_to_hold_each_filter'>
            <div className='box_to_hold_each_filter_title'>
                <div className='box_to_hold_expand_button'
                    onClick={() => set_toggle_expand(!toggle_expand)}
                >
                    <img
                        src={toggle_svg}
                        onMouseEnter={() => set_toggle_h(true)}
                        onMouseLeave={() => set_toggle_h(false)}
                        alt='toggle button'
                        style={{
                            width: '10px',
                            height: '10px',
                            transform: toggle_expand ? 'rotate(180deg)' : 'rotate(0deg)',
                            border: toggle_h ? '1px solid black' : '1px solid transparent',
                            borderRadius: '3px',
                            padding: '2px'
                        }}
                    />
                </div>
                {clean_string(key)}
                <div style={{ width: '10px', height: '10px', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>{' '}</div>
            </div>
            {toggle_expand ? <CurrentlySelected working_obj={working_obj} filter_info={filter_info} /> : null}
            {toggle_expand ?
                <div className='box_to_hold_filter_buttons'>
                    <div
                        className='filter_button_properties'
                        onMouseEnter={() => set_clear_button_h(true)}
                        onMouseLeave={() => set_clear_button_h(false)}
                        style={{
                            backgroundColor: clear_button_h ? 'rgba(243,156,18,1)' : 'rgba(245,176,65,1)',
                            boxShadow: clear_button_h ? '2px 2px 2px rgba(243,156,18,1)' : '',
                        }}
                        onClick={handle_clear_all}
                    >
                        Clear
                    </div>
                    <div
                        className='filter_button_properties'
                        onMouseEnter={() => set_select_all_h(true)}
                        onMouseLeave={() => set_select_all_h(false)}
                        style={{
                            backgroundColor: select_all_h ? 'rgba(66,165,245,1)' : 'rgba(100,181,246,1)',
                            boxShadow: select_all_h ? '2px 2px 2px rgba(66,165,245,1)' : '',
                        }}
                        onClick={handle_select_all}
                    >Select All </div>
                </div>
                : null
            }
            {toggle_expand ? <div className='box_to_hold_input_search_and_related'>
                <div
                    className='box_to_hold_clear_input_button'
                    onMouseEnter={() => set_clear_h(true)}
                    onMouseLeave={() => set_clear_h(false)}
                    onClick={() => set_search_str('')}
                    style={{
                        color: clear_h ? 'blue' : 'black'
                    }}
                >
                    X
                </div>
                <input
                    className='input_search_properties'
                    placeholder='search'
                    value={search_str}
                    onChange={(e) => set_search_str(e.target.value)}
                />
            </div> : null}

            {toggle_expand ?
                <div className='box_to_hold_filter_values'>
                    <StringFilterValuesList {...props} search_str={search_str} />
                </div> : null}
        </div>
    );
}

const PrepareFilterList = (props: any) => {
    const { original_map, filter_info, set_filter_info } = props;

    const make_list = () => {
        let arr: any[] = [];
        let i = 0;
        for (const key in original_map) {
            arr.push(
                <div className='box_to_hold_each_filter' key={i++}>
                    <StringFilter
                        working_obj={{ key, value: original_map[key] }}
                        original_map={original_map}
                        filter_info={filter_info}
                        set_filter_info={set_filter_info}
                    />
                </div>
            );
        }
        return arr;
    }

    return <div className='box_to_hold_filter_list'>
        {make_list()}
    </div>
}

const GraphsViewLeftSide = (props: any) => {
    const { data, set_filter, filter } = props;
    const my_map: any = categorize_data(data);

    const [filter_info, set_filter_info] = useState<any>({});
    const [reset_h, set_reset_h] = useState<boolean>(false);
    const [apply_h, set_apply_h] = useState<boolean>(false);
    const [change_h, set_change_h] = useState<boolean>(false);

    const handle_reset = () => {
        set_filter([]);
        set_filter_info({});
    }
    const handle_apply = () => {
        set_filter({ ...filter_info })
    }

    useEffect(() => {
        set_filter_info({ ...my_map });
        set_filter({ ...my_map })
    }, [])

    const filename_str = () => {
        let str = '';
        data?.wac?.words_array?.forEach((element: string, index: number) => {
            if (index === 0) { str += `${element[0].toUpperCase()}${element.slice(1).toLowerCase()} ` }
            else str += ` ${element.toLowerCase()} `;
        });
        return str;
    }

    return (
        <div className="box_to_hold_left_side" style={{ height: window.innerHeight }}>
            <div className="box_to_hold_filename">
                {filename_str()}
            </div>
            <div style={{
                backgroundColor: 'white',
                display: 'inline',
                color: 'purple',
                boxShadow: '2px 2px 2px lightblue',
                fontSize: '16px',
                paddingLeft: '10px',
                paddingRight: '5px',
                borderTop: '1px solid lightblue',
            }}>Filters</div>
            {!!data ? <PrepareFilterList original_map={my_map} filter_info={filter_info} set_filter_info={set_filter_info} /> : null}
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                padding: '20px 0px',
                // borderBottom: '1px solid rgba(128,222,234,1)'
            }}>
                <div
                    onClick={handle_apply}
                    onMouseEnter={() => set_apply_h(true)}
                    onMouseLeave={() => set_apply_h(false)}
                    style={{
                        backgroundColor: 'rgba(128,222,234,1)',
                        color: 'white',
                        borderRadius: '5px',
                        paddingLeft: '2px',
                        paddingRight: '2px',
                        fontSize: '14px',
                        boxShadow: apply_h ? '2px 2px 2px rgba(128,222,234,1)' : '',
                        cursor: 'pointer'
                    }}
                >Apply</div>
                <div
                    onClick={handle_reset}
                    onMouseEnter={() => set_reset_h(true)}
                    onMouseLeave={() => set_reset_h(false)}
                    style={{
                        border: '2px solid rgba(128,222,234,1)',
                        borderRadius: '5px',
                        paddingLeft: '2px',
                        paddingRight: '2px',
                        fontSize: '14px',
                        boxShadow: reset_h ? '2px 2px 2px rgba(128,222,234,1)' : '',
                        cursor: 'pointer'
                    }}
                >Clear All</div>
            </div>
            <div
                onMouseEnter={() => set_change_h(true)}
                onMouseLeave={() => set_change_h(false)}
                onClick={handle_apply}
                style={{
                    borderBottom: '1px solid rgba(128,222,234,1)',
                    color: change_h ? 'blue' : 'green',
                    fontSize: '10px',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textDecoration: 'underline',
                    padding: '4px',
                    cursor: _.isEqual(filter_info, filter) ? '' : 'pointer',
                }}>{_.isEqual(filter_info, filter) ? '' : 'Click on Apply Changes'}</div>
        </div>
    )
}

export default GraphsViewLeftSide;