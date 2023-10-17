import React, { useState } from 'react'
import GraphsViewCenter from "./graphs-view-center"
import GraphsViewRightSide from "./graphs-view-right-side"
import "./graphs.css"

const GraphsNavigation = (props: any) => {
    const { filter, show_graphs, original, set_show_graphs } = props;
    const [element_list, set_element_list] = useState<any>([]);

    return <div
        style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row'
        }}
    >
        <GraphsViewCenter
            filter={filter}
            show_graphs={show_graphs}
            original={original}
            set_element_list={set_element_list}
        />
        <GraphsViewRightSide
            show_graphs={show_graphs}
            set_show_graphs={set_show_graphs}
            filter={filter}
            original={original}
            element_list={element_list}
        />
    </div>
}

export default GraphsNavigation;