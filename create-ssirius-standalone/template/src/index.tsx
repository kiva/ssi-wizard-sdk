import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { defaultComponentMap } from './globals/defaultComponentMap';
import receivedConfig from './config';
import { merge } from 'webpack-merge';

const config_constants = {
    component_map: defaultComponentMap,
    direction: 'ltr'
};
const mergedConfig = merge<any>(config_constants, receivedConfig);

ReactDOM.render(
    <React.StrictMode>
        <App config={mergedConfig} />
    </React.StrictMode>,
    document.getElementById('root')
);
