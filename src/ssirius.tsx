import {IConstants} from './interfaces/IConstants';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

export function ssirius(CONSTANTS: IConstants, rootElement: string): void {
    ReactDOM.render(
        <React.StrictMode>
            <App config={CONSTANTS} />
        </React.StrictMode>,
        document.getElementById(rootElement)
    );
}
