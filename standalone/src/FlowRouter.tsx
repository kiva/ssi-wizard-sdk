import React, {useState, useRef, Suspense} from 'react';
import FlowDispatchTypes from './enums/FlowDispatchTypes';
import {Flow} from './interfaces/FlowSelectorInterfaces';
import {IConstants} from './interfaces/IConstants';
import {Toaster} from 'react-hot-toast';

import {
    ComponentStoreMethods,
    FlowAction
} from './interfaces/FlowRouterInterfaces';
import useComponentStore from './hooks/useComponentStore';
import useTranslator from './hooks/useTranslator';
import getFlow from './helpers/getFlow';
import AppHeader from './components/AppHeader';

const FlowController: React.FC<IConstants> = (CONSTANTS: IConstants) => {
    console.log(CONSTANTS.auth_token);
    const [step, setStep] = useState('confirmation');
    const authIndex = useRef<number>(0);
    const Header = useHeaderIfAsked(CONSTANTS);
    const Footer = useFooterIfAsked(CONSTANTS);

    let theFlow: Flow = getFlow(authIndex.current, CONSTANTS);

    const prevStep = theFlow[step]![FlowDispatchTypes.BACK] ?? '';
    const componentStoreMethods: ComponentStoreMethods =
        useComponentStore(step);
    const lang = CONSTANTS.defaultLang;
    const t = useTranslator(lang);

    function dispatch(action: FlowAction) {
        const {type, payload} = action;

        if (!theFlow.hasOwnProperty(step))
            throw new Error(
                `Referenced step '${step}' does not exist in the flow`
            );

        switch (type) {
            case FlowDispatchTypes.NEXT:
                setStep(theFlow[step]![FlowDispatchTypes.NEXT]);
                break;
            case FlowDispatchTypes.BACK:
                if (
                    theFlow.hasOwnProperty(step) &&
                    theFlow[step]!.hasOwnProperty(FlowDispatchTypes.BACK)
                ) {
                    setStep(theFlow[step]![FlowDispatchTypes.BACK]!);
                }
                break;
            case FlowDispatchTypes.RESTART:
                setStep('confirmation');
                authIndex.current = 0;
                componentStoreMethods.reset();
                break;
            case FlowDispatchTypes.SET_AUTH_METHOD:
                if ('menu' === step) {
                    authIndex.current = payload;
                    theFlow = getFlow(payload, CONSTANTS);
                } else {
                    throw new Error(
                        "Please don't try to set the authentication method from outside the Authentication Menu screen"
                    );
                }
                break;
            default:
                throw new Error('Unknown action type');
        }
    }

    const TheComponent = renderScreen(step);

    function renderScreen(step: string) {
        const definition = CONSTANTS.component_map[step].component;
        const component = React.lazy(
            () => import(__dirname + '/screens/' + definition)
        );

        return component;
    }

    function getAdditionalProps(step: string) {
        const props: any = CONSTANTS.component_map[step].props;
        if (CONSTANTS.component_map[step].hasOwnProperty('dataHelper')) {
            props.dataHelper = CONSTANTS.component_map[step].dataHelper;
        }
        return props;
    }

    return (
        <Suspense fallback="">
            <div className="KernelContainer">
                <Toaster />
                {Header}
                <div className="KernelContent" data-cy={step}>
                    <TheComponent
                        {...getAdditionalProps(step)}
                        CONSTANTS={CONSTANTS}
                        store={componentStoreMethods}
                        prevScreen={prevStep}
                        authIndex={authIndex.current}
                        dispatch={dispatch}
                        t={t}
                    />
                </div>
                {Footer}
            </div>
        </Suspense>
    );
};

export default FlowController;

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
    if (isEnabled(props)
        && props.standaloneConf!.headerImage
        && props.standaloneConf!.org) {
            return <AppHeader {...props} />;
    }
    return null;
}
