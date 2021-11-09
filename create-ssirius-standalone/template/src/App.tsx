import React, { useState } from 'react';
import listen from './helpers/listen';
import { Toaster } from 'react-hot-toast';
import AppHeader from './components/AppHeader';
import SSIriusRouter, { IConstants } from '@kiva/ssirius-react';
import useTranslator from './hooks/useTranslator';
import TranslationContext from './contexts/TranslationContext';

function App(props: AppProps) {
    const { config } = props;
    const [authToken, setAuthToken] = useState<string | undefined>(config.auth_token);
    const Header = useHeaderIfAsked(config);
    const Footer = useFooterIfAsked(config);
    const t = useTranslator(config.defaultLang);

    config.auth_token = authToken;

    listen(window, "message", e => {
        if (config.permittedOpenerOrigins && config.permittedOpenerOrigins.indexOf(e.origin) > -1) {
            if (e.data === "are you set?") {
                e.source.postMessage({
                    allSet: true
                }, e.origin);
            } else if (e.data.token) {
                setAuthToken(e.data.token);
            }
        }
    });

    return (
        <div className="KernelContainer">
            <div className="KernelContent">
                <TranslationContext.Provider value={t}>
                    <Toaster />
                    {Header}
                    <SSIriusRouter {...config} />;
                    {Footer}
                </TranslationContext.Provider>
            </div>
        </div >
    )
}

export default App;

function isEnabled(props: IConstants) {
    return !!props.standaloneConf && props.standaloneConf.isStandalone;
}

function useFooterIfAsked(props: IConstants) {
    if (isEnabled(props) && !!props.standaloneConf!.org) {
        return <div className="AppFooter">
            Powered by <strong>{props.standaloneConf!.org}</strong>
        </div>;
    }
    return null;
}

function useHeaderIfAsked(props: IConstants) {
    if (isEnabled(props)) {
        return <AppHeader {...props} />;
    }
    return null;
}

interface AppProps {
    config: IConstants;
}
