import React from "react";
import "./home-style.css";
import app_logo from '../Assets/Image/app-logo.png';

import HeaderSearch from "./header-search";


const HomeHeader = (props: any) => {
    return (
        <div className="box_to_hold_header">
            <div className="box_to_hold_logo">
                <img src={app_logo} alt='app logo' className="logo_image_properties" />
            </div>
            <HeaderSearch {...props}
            />
            <div style={{ color: 'transparent', }}>{' '}</div>
        </div>
    )
};

export default HomeHeader;
