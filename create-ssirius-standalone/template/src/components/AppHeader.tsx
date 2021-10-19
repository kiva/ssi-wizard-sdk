import React from 'react';
import { IConstants } from '../interfaces/IConstants'
import img from '../images/header.png';

export default function AppHeader(props: IConstants) {
    return <div className="AppHeader">
        <img src={img} alt={props.standaloneConf?.alt || ''} />
        <h1>Kiva</h1>
    </div>;
}