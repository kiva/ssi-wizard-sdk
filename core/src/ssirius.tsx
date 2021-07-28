import {IConstants} from './interfaces/IConstants';
import React from 'react';
import ReactDOM from 'react-dom';
import {defaultComponentMap} from './globals/defaultComponentMap';
import App from './App';
import merge from 'webpack-merge';

export default function ssirius(CONSTANTS: any, rootElement: string): void {
    const combined: IConstants = merge(
        {
            component_map: defaultComponentMap,
            verification_options: [],
            credentialKeyMap: {},
            direction: 'ltr'
        },
        CONSTANTS
    );

    ReactDOM.render(
        <React.StrictMode>
            <App config={combined} />
        </React.StrictMode>,
        document.getElementById(rootElement)
    );
}
