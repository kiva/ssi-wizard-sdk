import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {defaultComponentMap} from './globals/defaultComponentMap';
import receivedConfig from './config';
import {mergeAdvanced} from 'object-merge-advanced';
import 'bootstrap/dist/css/bootstrap.min.css';

const config_constants = {
    component_map: defaultComponentMap,
    direction: 'ltr'
};

ReactDOM.render(
    <React.StrictMode>
        <App config={mergeAdvanced(config_constants, receivedConfig, {})} />
    </React.StrictMode>,
    document.getElementById('root')
);
