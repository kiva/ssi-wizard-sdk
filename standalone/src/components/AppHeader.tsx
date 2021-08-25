import React from 'react';
import {IConstants} from '../interfaces/IConstants'
import img from '../images/kiva_small.jpeg';

export default function AppHeader(props: IConstants) {
    // const {headerImage, org} = props.standaloneConf!;
    // const img: string = `/images/${headerImage}`;

    return <div className="AppHeader">
        <img src={img} alt=""/>
        <h1>Kiva</h1>
    </div>;
}