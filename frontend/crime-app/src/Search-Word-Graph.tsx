import React, { useState, useEffect } from "react";
import { extract_fetched_data } from "./helpers";
import { fetched_data, filter_data } from "./interfaces";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement
} from 'chart.js';
import { Bar, Line } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement
);

const MakeGraph = (props: any) => {
    const { info } = props;
    console.log('in make graph showing info: ', info);
    if (!!!info?.length) return <>waiting for data...</>

    const labels_arr: string[] = Array.from(info, (obj: any) => { return obj?.search })
    const bar_colors = Array.from(labels_arr, () => `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`);
    const bar_data = {
        labels: labels_arr,//Array.from(labels, (v, index) => index + 1),
        datasets: [{
            label: 'Unique words search time',
            data: Array.from(info, (obj: any) => { return obj?.diff }),
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

    return <div style={{ width: '100%', height: '400px' }}><Line data={bar_data} options={bar_options} /></div>
}

const SearchWordGraph = (props: any) => {

    const [unique, set_unique] = useState<string[]>([]);
    const [info, set_info] = useState<any[]>([]);


    const fetch_unique = async () => {
        const { data } = await fetch('http://localhost:5612/get_unique_words', {
            method: "GET",
            headers: { "Content-Type": "application/json", }
        }).then(extract_fetched_data)
            .catch(e => { return { error: `${e}` } }) as fetched_data;
        set_unique(data);
    }


    const fetch_suggestions = async (for_back: filter_data): Promise<fetched_data> => {
        return await fetch("http://localhost:5612/filter_data_using_words", {
            method: "POST",
            body: JSON.stringify(for_back),
            headers: { "Content-Type": "application/json", }
        })
            .then(extract_fetched_data)
            .catch(e => { return { error: `${e}` } }) as fetched_data;
    }

    const make_obj = async (search: string) => {
        const before = new Date();
        const { data } = await fetch_suggestions({
            words: [search],
            limit: 1000,
            skip: 0,
            operational: 'ONE'
        });
        if (!!!data) return {};
        const after = new Date();
        const diff: number = after.getTime() - before.getTime();
        return { search, 'data-length': data?.length, diff };
    }

    const make_result = async () => {
        let result: any[] = [];
        const letter = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r'
            , 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

        const temp = unique?.concat(letter) || letter;
        for await (const word of temp) {

            result.push(await make_obj(word));
        }
        set_info(result);
    }


    useEffect(() => { fetch_unique() }, []);
    useEffect(() => { make_result() }, [unique]);

    return (
        <>search word graph screen
            <MakeGraph info={info || []} />
        </>)
}

export default SearchWordGraph;