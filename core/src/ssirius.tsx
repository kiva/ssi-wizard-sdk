import {IConstants} from './interfaces/IConstants';
import React from 'react';
import ReactDOM from 'react-dom';
import {defaultComponentMap} from './globals/defaultComponentMap';
import App from './App';
import merge from 'webpack-merge';

export default function ssirius(
    CONSTANTS: IConstants,
    rootElement: string
): void {
    const config_default: IConstants = {
        component_map: defaultComponentMap,
        verification_options: [],
        direction: 'ltr'
    };

    const combined = merge(config_default, CONSTANTS);

    console.log(combined);

    ReactDOM.render(
        <React.StrictMode>
            <App config={combined} />
        </React.StrictMode>,
        document.getElementById(rootElement)
    );
}
