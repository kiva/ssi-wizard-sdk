import React, { useState, useRef, Suspense, useEffect } from 'react';
import FlowDispatchTypes from '../enums/FlowDispatchTypes';
import { Flow } from '../interfaces/FlowSelectorInterfaces';
import SSIriusProps from '../interfaces/SSIriusProps';

import {
    ComponentStoreMethods,
    FlowAction
} from '../interfaces/FlowRouterInterfaces';
import useComponentStore from '../hooks/useComponentStore';
import getFlow from '../helpers/getFlow';

export default function SSIriusRouter(props: SSIriusProps) {
    const {CONSTANTS} = props;
    const [step, setStep] = useState('confirmation');
    const authIndex = useRef<number>(0);

    useEffect(() => {
        if (!!props.resetFunction) {
            props.resetFunction.current = restartFlow;
        }
    }, []);

    let theFlow: Flow = getFlow(authIndex.current, CONSTANTS);

    const prevStep = theFlow[step]![FlowDispatchTypes.BACK] ?? '';
    const componentStoreMethods: ComponentStoreMethods =
        useComponentStore(step);

    function dispatch(action: FlowAction) {
        const { type, payload } = action;

        if (!theFlow.hasOwnProperty(step))
            throw new Error(
                `Referenced step '${step}' does not exist in the flow`
            );

        switch (type) {
            case FlowDispatchTypes.NEXT:
                if (
                    theFlow.hasOwnProperty(step) &&
                    theFlow[step]!.hasOwnProperty(FlowDispatchTypes.NEXT)
                ) {
                    setStep(theFlow[step]![FlowDispatchTypes.NEXT]);
                }
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
                restartFlow();
                break;
            case FlowDispatchTypes.SET_AUTH_METHOD:
                if ('menu' === step) {
                    authIndex.current = payload;
                    theFlow = getFlow(payload, CONSTANTS);
                } else {
                    console.warn("Please don't try to set the authentication method from outside the Authentication Menu screen");
                }
                break;
            default:
                throw new Error('Unknown action type');
        }
    }

    const TheComponent = renderScreen(step);

    function renderScreen(step: string) {
        let component = CONSTANTS.component_map[step].component;

        return component;
    }

    function restartFlow() {
        setStep('confirmation');
        authIndex.current = 0;
        componentStoreMethods.reset();
    }

    function getAdditionalProps(step: string) {
        const props: any = CONSTANTS.component_map[step].props;
        if (CONSTANTS.component_map[step].hasOwnProperty('dataHelper')) {
            props.dataHelper = CONSTANTS.component_map[step].dataHelper;
        }
        return props;
    }

    return (
        <Suspense fallback="" >
            <div className="SSIrius" data-cy={step}>
                <TheComponent
                    {...getAdditionalProps(step)}
                    CONSTANTS={CONSTANTS}
                    store={componentStoreMethods}
                    prevScreen={prevStep}
                    authIndex={authIndex.current}
                    dispatch={dispatch}
                />
            </div>
        </Suspense>
    );
};
