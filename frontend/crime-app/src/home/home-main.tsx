import React, { useEffect, useRef, useState } from "react";
import { fetched_results } from "./home";
import loading_gif from '../Assets/gifs/loading.gif';

const EachItem = (props: any) => {
    const { from_chunk_collection: { cleaned },
        from_operational_collection } = props.item as fetched_results;

    const { switch_screen } = props;

    const [title_h, set_title_h] = useState<boolean>(false);

    const make_title = `${cleaned[0].toUpperCase()}${cleaned.slice(1).toLocaleLowerCase()}`;
    const make_context = () => {
        let key_count: number = 10;
        let str: string = '';
        str += 'Information about ';

        for (const key in from_operational_collection[0]) {
            if (key_count >= 0) {
                if (key === '_id' || key === 'words_array_id') { }
                else {
                    key_count--;
                    str += `${key.toLocaleLowerCase()}, `;
                }
            }
            else {
                str += '...';
                break;
            }
        }
        return str;
    }

    const handle_click = () => {
        switch_screen('graphs-view', { ...props?.item });
    }

    return (
        < div className="box_to_hold_item" >
            <div className="box_to_hold_item_title"
                onMouseEnter={() => set_title_h(true)}
                onMouseLeave={() => { set_title_h(false) }}
                onClick={handle_click}
                style={{ textDecoration: title_h ? 'underline' : 'none' }}>{make_title}</div>
            <div className="box_to_hold_item_context">{make_context()}</div>
        </div >
    );
}

const InfoList = (props: any) => {
    const info: fetched_results[] = props?.info;
    const page_count: number = props?.page_count;

    let result = [];

    let start = (page_count - 1) * 20;
    let end = (page_count * 20) - 1;
    if (end > info.length) { end = info.length; }

    for (let i = start; i < end; i++) {
        result.push(<EachItem item={info[i] || {}} {...props} key={i} />);
    }

    return <>{result}</>
}

const PageIndexNumber = (props: any) => {
    const { my_number, set_page_count, page_count } = props;
    const [h, set_h] = useState(false)
    return (
        <div className="box_to_hold_page_index_number"
            style={{
                color: my_number === page_count ? 'blue' : 'grey',
                textDecoration: h ? 'underline' : 'none',
            }}
            onClick={() => set_page_count(my_number)}
            onMouseEnter={() => set_h(true)}
            onMouseLeave={() => set_h(false)}
        >
            {my_number}
        </div>
    );
}

const PageIndexButton = (props: any) => {
    const { name, disable, operation, set_page_count, page_count } = props;
    const [h, set_h] = useState<boolean>(false);

    const handle_click = () => {
        if (!disable) {
            if (operation === '++') set_page_count(page_count + 1);
            else if (operation === '--') set_page_count(page_count - 1);
        }
    }

    return (
        <div className="box_to_hold_page_index_button"
            style={{
                color: disable ? 'grey' : h ? 'blue' : 'black',
                textDecoration: disable ? 'none' : h ? 'underline' : 'none',
                cursor: 'auto'
            }}
            onClick={handle_click}
            onMouseEnter={() => set_h(true)}
            onMouseLeave={() => set_h(false)}
        >{name}</div>
    );
}

//per page limit is set here is 20 
const PageIndex = (props: any) => {
    const { total, page_count, set_page_count } = props;
    let list_length: number = Math.floor(total / 20);
    if (total % 20 !== 0) { list_length++; }

    let number_list = [];
    for (let i = 1; i <= list_length; i++) {
        number_list.push(<PageIndexNumber
            my_number={i}
            page_count={page_count}
            set_page_count={set_page_count}
            key={i}
        />);
    }

    return (
        <div className="box_to_hold_page_index">
            <PageIndexButton name={'prev'}
                disable={page_count === 1}
                operation={'--'}
                page_count={page_count}
                set_page_count={set_page_count} />
            {number_list}
            <PageIndexButton name={'next'}
                disable={page_count === list_length}
                operation={'++'}
                page_count={page_count}
                set_page_count={set_page_count} />
        </div>
    );
}

const HandleLoading = (props: any) => {
    const { is_fetching, info } = props;
    const count = useRef(0);

    useEffect(() => {
        let c: number = count.current;
        if (c < 100) {
            count.current = count.current + 1;
        }
        else {
            count.current = 90;
        }
    }, [is_fetching]);

    if (count.current === 0) {
        return <></>;
    }
    else {
        if (is_fetching) {
            return (<img
                src={loading_gif}
                alt='loading...'
                style={{
                    width: '50px',
                    height: '50px'
                }}
            />);
        }
        else {
            if (info) {
                if (info.length) {
                    return <></>
                }
                else {

                    return <>No records found.Try searching something else.</>
                }
            }
            else {
                return <></>;
            }
        }
    }

}

const HomeMain = (props: any) => {
    const [page_count, set_page_count] = useState<number>(1);
    const { info, is_fetching } = props;
    return (
        <div className="box_to_hold_home_main">
            {!!info && !!info.length && !is_fetching ? <>
                <div className="box_to_hold_main_size_box">

                    <InfoList info={props.info || []} page_count={page_count} {...props} />
                    <PageIndex total={props?.info?.length || 0} page_count={page_count} set_page_count={set_page_count} />
                </div>
            </>
                : <div style={{
                    display: 'flex',
                    height: window.innerHeight,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontWeight: '100',
                }}
                >
                    <HandleLoading is_fetching={is_fetching} info={info} />
                </div>}
        </div>
    )
}

export default HomeMain;