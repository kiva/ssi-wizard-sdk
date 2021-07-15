import React, {useState, Suspense} from 'react';
import FlowDispatchTypes from './enums/FlowDispatchTypes';
import {Flow} from './interfaces/FlowSelectorInterfaces';
import {IConstants} from './interfaces/IConstants';
import {defaultComponentMap} from './globals/defaultComponentMap';

import {
    ComponentStoreMethods,
    FlowAction,
    ComponentMap
} from './interfaces/FlowRouterInterfaces';
import useComponentStore from './hooks/useComponentStore';
import getFlow from './helpers/getFlow';

const FlowController: React.FC<IConstants> = (CONSTANTS: IConstants) => {
    const componentMap: ComponentMap = defaultComponentMap;
    const [step, setStep] = useState('confirmation');

    let authIndex = 0,
        theFlow: Flow = getFlow(authIndex, CONSTANTS);

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
                authIndex = 0;
                break;
            case FlowDispatchTypes.SET_AUTH_METHOD:
                if ('menu' === step) {
                    authIndex = payload;
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

    const prevStep: string = theFlow[step]![FlowDispatchTypes.BACK]! ?? '';
    const TheComponent = renderScreen(step);
    const componentStoreMethods: ComponentStoreMethods =
        useComponentStore(step);

    function renderScreen(step: string) {
        Object.assign(componentMap, CONSTANTS.component_map);

        const component: any = React.lazy(
            () => import(__dirname + componentMap[step]!.path)
        );

        return component;
    }

    return (
        <Suspense fallback="">
            <div className="KernelContainer">
                <div className="KernelContent" data-cy={step}>
                    <TheComponent
                        {...componentMap[step].props}
                        CONSTANTS={CONSTANTS}
                        store={componentStoreMethods}
                        prevScreen={prevStep}
                        authIndex={authIndex}
                        dispatch={dispatch}
                    />
                </div>
            </div>
        </Suspense>
    );
};

export default FlowController;
