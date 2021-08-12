import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {defaultComponentMap} from './globals/defaultComponentMap';
import {IConstants} from './interfaces/IConstants';
import {mergeAdvanced} from 'object-merge-advanced';

export default function ssirius(config: IConstants, elementId: string) {
    const computedConfig = mergeAdvanced(
        config,
        {
            component_map: defaultComponentMap
        },
        {}
    );
    ReactDOM.render(
        <React.StrictMode>
            <App config={computedConfig} />
        </React.StrictMode>,
        document.getElementById(elementId)
    );
}
