import React, { useState } from 'react';
import listen from './helpers/listen';
import { Toaster } from 'react-hot-toast';
import AppHeader from './components/AppHeader';
import SSIriusRouter, { IConstants } from '@kiva/ssirius-react';
import useTranslator from './hooks/useTranslator';
import TranslationContext from './contexts/TranslationContext';
import actions from './actions';
import IActions from './interfaces/IActions';

export let auth_token: string | undefined = '';

function App(props: AppProps) {
    const [conf, setConf] = useState<IConstants>(props.config);
    const Header = useHeaderIfAsked(conf);
    const Footer = useFooterIfAsked(conf);
    const t = useTranslator(conf.defaultLang);
    const actionHandlers: IActions = actions;

    listen(window, "message", e => {
        if (conf.permittedOpenerOrigins && conf.permittedOpenerOrigins.indexOf(e.origin) > -1) {
            let allSet = false;
            if (e.data === "are you set?") {
                allSet = true;
                e.source.postMessage({allSet}, e.origin);
            } else if (allSet && !!e.data.action) {
                const updatedConf = actionHandlers[e.data.action.name](conf, ...e.data.action.args);
                setConf(updatedConf);
            }
        }
    });

    return (
        <div className="KernelContainer">
            <div className="KernelContent">
                <TranslationContext.Provider value={t}>
                    <Toaster />
                    {Header}
                    <SSIriusRouter {...conf} />;
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
