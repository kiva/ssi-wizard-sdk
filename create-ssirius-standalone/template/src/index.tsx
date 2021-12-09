import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import config from './config';
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.render(
    <React.StrictMode>
        <App config={config} />
    </React.StrictMode>,
    document.getElementById('root')
);
