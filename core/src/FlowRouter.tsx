import React, {useState, useRef, Suspense} from 'react';
import FlowDispatchTypes from './enums/FlowDispatchTypes';
import {Flow} from './interfaces/FlowSelectorInterfaces';
import {IConstants} from './interfaces/IConstants';

import {
    ComponentStoreMethods,
    FlowAction,
    ComponentMap
} from './interfaces/FlowRouterInterfaces';
import useComponentStore from './hooks/useComponentStore';
import getFlow from './helpers/getFlow';

const FlowController: React.FC<IConstants> = (CONSTANTS: IConstants) => {
    console.log('Aloha')
    const [step, setStep] = useState('confirmation');
    const authIndex = useRef<number>(0);

    let theFlow: Flow = getFlow(authIndex.current, CONSTANTS);

    const prevStep = theFlow[step]![FlowDispatchTypes.BACK] ?? '';

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
    const componentStoreMethods: ComponentStoreMethods =
        useComponentStore(step);

    function renderScreen(step: string) {
        const definition = CONSTANTS.component_map[step].component;
        let component: React.FC;

        if ('string' === typeof definition) {
            component = React.lazy(
                () => import(__dirname + '/screens/' + definition)
            );
        } else {
            component = definition;
        }

        return component;
    }

    function getAdditionalProps(step: string) {
        const componentMap: ComponentMap = CONSTANTS.component_map;
        const props: any = componentMap[step].props;
        if (componentMap[step].hasOwnProperty('dataHelper')) {
            props.dataHelper = componentMap[step].dataHelper;
        }
        return props;
    }

    return (
        <Suspense fallback="">
            <div className="KernelContainer">
                <div className="KernelContent" data-cy={step}>
                    <TheComponent
                        {...getAdditionalProps(step)}
                        CONSTANTS={CONSTANTS}
                        store={componentStoreMethods}
                        prevScreen={prevStep}
                        authIndex={authIndex.current}
                        dispatch={dispatch}
                    />
                </div>
            </div>
        </Suspense>
    );
};

export default FlowController;
