import React, { useRef, useEffect, useState } from 'react'
import { is_no_filter_value_selected } from './graphs-view';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { clean_string } from '../helpers';
import "./graphs.css"

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const graph_top_label = (condition: any) => {
    let str: string = ''
    for (const key in condition) {
        str += `${condition[key]},`;
    }
    return str.slice(0, str.length - 1);
}

const find_label_matches = (condition: any, main_data: any) => {
    let main_labels: string[] = [];

    Object.keys(main_data).forEach((key_name: string) => {
        const c = condition[key_name];
        if (!!!c) main_labels.push(clean_string(key_name).toLowerCase());
    })

    // console.log('main labels ->', main_labels);
    for (let ml: number = 0; ml < main_labels.length; ml++) {
        const testing = main_labels[ml].split(' ');
        testing.pop();
        console.log('testing : ', testing);
    }
}

const MakeGraph = (props: any) => {
    const { condition, main_data } = props;
    //preparing labels and its respective data array
    let labels: any[] = [];
    let labels_data_arr: any[] = [];

    find_label_matches(condition, main_data);

    Object.keys(main_data).forEach((key_name: string) => {
        const c = condition[key_name];
        if (!!!c) {
            labels.push(clean_string(key_name));
            labels_data_arr.push(main_data[key_name]);
        }
    })

    const bar_colors = Array.from(labels, () => `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`);

    const bar_data = {
        labels: Array.from(labels, (v, index) => index + 1),
        datasets: [{
            label: graph_top_label(condition),
            data: labels_data_arr,
            backgroundColor: bar_colors,
            barThickness: 25,
            maxBarThickness: 50,
        }]
    }
    const bar_options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: '',
            },
        },
    }

    const make_label_color_list = () => {
        const temp = Array.from(labels, (l: string, i: number) => {
            return (<div className="box_to_hold_label_color_each" key={i}>
                <div className="box_to_hold_label_index">{i + 1}</div>
                <div className="box_to_hold_label_respective_color"
                    style={{
                        width: '30px',
                        backgroundColor: bar_colors[i],
                        color: bar_colors[i]
                    }}
                >
                    a
                </div>
                <div className="box_to_hold_label_text">{l}</div>
            </div>)
        })
        return (
            <div className="box_to_hold_label_color_list">
                {temp}
            </div>
        );
    }

    const make_conditions_title = () => {
        return (
            <div className="box_to_hold_current_graph_conditions_title">
                {graph_top_label(condition)}
            </div>
        )
    }

    const temp_ref = useRef(null)
    return (<div className="box_to_hold_graph_and_related_content" ref={temp_ref}>
        {make_conditions_title()}
        <div className="box_to_hold_each_graph">
            <Bar data={bar_data} options={bar_options} />
        </div>
        {make_label_color_list()}
    </div>);
}


const GraphsViewCenter = (props: any) => {
    const { filter, original, show_graphs, set_element_list } = props;
    const { list, index } = show_graphs;
    const temp_ref = useRef(null);

    useEffect(() => {
        if (temp_ref && temp_ref.current && temp_ref.current['children']) {
            const obj: any = temp_ref.current['children'];

            let temp: any[] = [];
            for (const key in obj) {
                const first_element_child: HTMLElement | any = obj &&
                    obj[key] &&
                    obj[key]['firstElementChild'] ? obj[key]['firstElementChild'] : { outerText: '' };

                if (first_element_child.outerText) { temp.push({ label: first_element_child.outerText, element: first_element_child }) }
            }
            set_element_list(temp);
        }
    }, [filter, show_graphs])

    if (is_no_filter_value_selected(filter)) {
        return (
            <div className="box_to_hold_center_side" style={{ height: window.innerHeight, overflowY: 'scroll' }}>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: '20px',
                        color: 'rgba(100,100,100,1)',
                        height: window.innerHeight,
                        cursor: "default"
                    }}>
                    Please select a filter.
                </div>
            </div>
        )
    }

    if (list.length > 0) {
        let graph_list: any[] = [];
        let start_index: number = index;
        let end_index: number = (index + 10) > list.length ? list.length : index + 10;
        for (let t = start_index; t < end_index; t++) {
            let condition: any = {};
            const main_data: any = original[list[t]];
            for (const f in filter) {
                condition[f] = main_data[f];
            }
            // const temp = MakeGraph({ condition, main_data, key: t });
            // graph_list.push(temp);
            graph_list.push(<MakeGraph condition={condition} main_data={main_data} key={t} />)
        }
        return (
            <div className="box_to_hold_center_side" style={{ height: window.innerHeight, overflowY: 'scroll' }} ref={temp_ref}>
                {graph_list}
            </div>
        )
    }
    else {
        return (
            <div className="box_to_hold_center_side" style={{ height: window.innerHeight, overflowY: 'scroll' }}>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: '20px',
                        color: 'rgba(100,100,100,1)',
                        height: window.innerHeight,
                        cursor: "default"
                    }}>
                    No Match Found.
                </div>
            </div>
        )
    }
}

export default GraphsViewCenter;