import React from 'react';
import {IConstants} from './interfaces/IConstants';
import FlowRouter from './FlowRouter';

function App(props: AppProps) {
    return <FlowRouter {...props.config} />;
}

export default App;

interface AppProps {
    config: IConstants;
}
