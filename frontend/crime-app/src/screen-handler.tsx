import { useCallback, useEffect, useState } from "react"
import Home from "./home/home"
import GraphsView from "./graphs/graphs-view";


const fetch_screen = (name: string, properties: any) => {

    const get_screen: any = {
        home: Home,
        'graphs-view': GraphsView
    };

    if (!!get_screen[name]) {
        const Temp = get_screen[name];
        return <Temp {...properties} />
    }

    return <>Screen Not Found</>;
}

const ScreenHandler = (props: any) => {
    const [screen_data, set_screen_data] = useState<any>({ name: 'home' })

    const switch_screen = (screen_name: string, parse_data?: any) => {
        let to_pass = { switch_screen };
        if (!!parse_data) { to_pass = { ...to_pass, ...parse_data } }
        const res = fetch_screen(screen_name, to_pass);
        set_screen_data({ name: screen_name, component: res });
    }

    return <>{screen_data?.component ? screen_data.component : switch_screen('home')}</>
};

export default ScreenHandler;