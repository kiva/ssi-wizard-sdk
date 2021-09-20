import {useState} from 'react';
import {IConstants} from './interfaces/IConstants';
import listen from './helpers/listen';
import FlowRouter from './FlowRouter';

function App(props: AppProps) {
    const [authToken, setAuthToken] = useState<string | undefined>(props.config.auth_token);

    props.config.auth_token = authToken;

    listen(window, "message", e => {
        if (props.config.permittedOpenerOrigins && props.config.permittedOpenerOrigins.indexOf(e.origin) > -1) {
            if (e.data === "are you set?") {
                e.source.postMessage({
                    allSet: true
                }, e.origin);
            } else if (e.data.token) {
                setAuthToken(e.data.token);
            }
        }
    });

    return <FlowRouter {...props.config} />;
}

export default App;

interface AppProps {
    config: IConstants;
}
