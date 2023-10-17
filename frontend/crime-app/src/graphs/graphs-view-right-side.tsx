import React, { useState } from "react";
import './graphs-right.css'
import { is_no_filter_value_selected } from "./graphs-view";
import { clean_string } from "../helpers";

const PageIndexEach = (props: any) => {
    const { label, show_graphs, set_show_graphs } = props;
    const [h, set_h] = useState<boolean>(false);

    const is_active = h || label === (show_graphs.index + 1);

    const handle_click = () => {
        set_show_graphs({ ...show_graphs, index: label - 1 });
    }

    return (<div
        onMouseEnter={() => set_h(true)}
        onMouseLeave={() => set_h(false)}
        onClick={handle_click}
        style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            width: '25px',
            height: '25px',
            border: '1px solid rgba(20,143,119,0.5)',
            cursor: 'pointer',
            margin: '4px'
        }}
    >
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                width: '20px',
                height: '20px',
                backgroundColor: is_active ? 'rgba(20,143,119,1)' : 'white',
                color: is_active ? 'white' : 'rgba(20,143,119,1)',
                fontSize: '12px'
            }}
        >
            {label}
        </div>
    </div>)
}

const PageIndex = (props: any) => {
    const { show_graphs, set_show_graphs, filter } = props;

    const list = () => {
        let result: any[] = [];
        let num: number = show_graphs.list.length / 10;
        if (show_graphs.list.length % 10 !== 0) { num++; }

        for (let i = 1; i <= num; i++) {
            result.push(<PageIndexEach label={i} key={i} {...props} />)
        }
        return result;
    }

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            borderBottom: '1px solid rgba(20,143,119,0.5)',
        }}>
            <div style={{
                fontSize: '12px',
                fontStyle: 'italic',
                borderTop: '1px solid rgba(20,143,119,0.5)',
                borderBottom: '1px solid rgba(20,143,119,0.5)',
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                paddingBottom: '5px',
                color: 'rgba(20,143,119,0.5)'
            }}>Pages</div>
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                maxHeight: '250px',
                overflowY: 'scroll'
            }}>
                {is_no_filter_value_selected(filter) ? null : list()}
            </div>
        </div>

    )
}

const RefEach = (props: any) => {
    const { info: { element, label } } = props;
    const [h, set_h] = useState<boolean>(false);

    const handle_click = () => {
        element?.scrollIntoView({ behavior: 'smooth' });
    }

    return (<div style={{ padding: '2px' }}>
        <div
            onMouseEnter={() => set_h(true)}
            onMouseLeave={() => set_h(false)}
            style={{
                fontSize: '12px',
                fontStyle: 'italic',
                letterSpacing: '1px',
                wordBreak: 'break-all',
                backgroundColor: h ? 'rgba(20,143,119,0.5)' : 'white',
                color: h ? 'white' : 'rgba(20,143,119,1)',
                padding: '2px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
            }}
            onClick={handle_click}>{label}</div>
    </div>);
}

const RefList = (props: any) => {
    const { element_list, show_graphs: { list } } = props;

    const make_list = () => {
        return Array.from(element_list || [], (obj: any, i: number) => <RefEach info={obj} key={i} />)
    }

    return (<div className="box_to_hold_ref_list"
        style={{
            borderLeft: '0px',
            borderRight: '0px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '5px',
        }}>
        <div style={{
            fontSize: '12px',
            fontStyle: 'italic',
            borderTop: '1px solid rgba(20,143,119,0.5)',
            borderBottom: '1px solid rgba(20,143,119,0.5)',
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            paddingBottom: '5px',
            color: 'rgba(20,143,119,0.5)'
        }}
        >Contents</div>
        {!!list.length ? <div style={{
            display: 'flex',
            flexDirection: 'column',
            borderBottom: '1px solid rgba(20,143,119,0.5)',
            height: '300px',
            overflowY: 'scroll',
            width: '100%',
        }}>
            {make_list()}
        </div> : null}
    </div>)
}

const GraphsViewRightSide = (props: any) => {
    return <div className="box_to_hold_right_side" style={{ position: 'sticky', top: '0px', right: '0px' }}>
        <RefList {...props} />
        <PageIndex {...props} />
    </div>
}

export default GraphsViewRightSide;