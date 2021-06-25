import React, {useEffect, useRef, useReducer, Suspense} from 'react';
import FlowDispatchTypes from './enums/FlowDispatchTypes';
import {AuthOption} from './interfaces/AuthOptionInterfaces';
import FlowDispatchContext from './contexts/FlowDispatchContext';
import {Flow} from './interfaces/FlowSelectorInterfaces';
import {IConstants} from './interfaces/IConstants';
import {defaultComponentMap} from './globals/defaultComponentMap';

import {ComponentStoreMethods, FlowAction, ComponentMap} from './interfaces/FlowRouterInterfaces';
import useComponentStore from './hooks/useComponentStore';

const FlowController: React.FC<IConstants> = (CONSTANTS: IConstants) => {
    const options: AuthOption[] = CONSTANTS.verification_options;
    const useMenu: boolean = options.length > 1;
    const componentMap: ComponentMap = defaultComponentMap;

    const flow = useRef<Flow>(createFlow(0));

    const [state, dispatch] = useReducer(flowReducer, {
        step: 'confirmation',
        authIndex: 0
    });

    const prevStep: string = flow.current[state.step]![FlowDispatchTypes.BACK] ?? '';

    let TheComponent = renderScreen(state.step);
    let componentStoreMethods: ComponentStoreMethods = useComponentStore(state.step);

    useEffect(() => {
        flow.current = createFlow(state.authIndex);
        // eslint-disable-next-line
    }, [state.authIndex]);

    function flowReducer(state: any, action: FlowAction): any {
        const {type, payload} = action;
        const {step} = state;
        const theFlow: Flow = flow.current;

        if (!theFlow.hasOwnProperty(step)) throw new Error(`Referenced step '${step}' does not exist in the flow`);

        switch (type) {
        case FlowDispatchTypes.NEXT:
            return {
                ...state,
                step: theFlow[step]![FlowDispatchTypes.NEXT]
            };
        case FlowDispatchTypes.BACK:
            return {
                ...state,
                step: theFlow[step]![FlowDispatchTypes.BACK]
            };
        case FlowDispatchTypes.RESTART:
            return {
                ...state,
                step: 'confirmation'
            };
        case FlowDispatchTypes.SET_AUTH_METHOD:
            if ('menu' === state.step) {
                return {
                    ...state,
                    authIndex: payload
                };
            } else {
                throw new Error('Please don\'t try to set the authentication method from outside the Authentication Menu screen');
            }
        default:
            throw new Error('Unknown action type');
        }
    }

    // TODO - wrap the next four functions in a Hook (useFlow, maybe?)
    function createFlow(index: number): Flow {
        const initial: any = createInitialSteps(index);
        injectAuthMethod(index, initial);

        return initial;
    }

    function injectAuthMethod(index: number, flow: any) {
        const beginAt: string = useMenu ? 'menu' : 'confirmation';
        const sequence: string[] = options[index].sequence;

        if (!sequence.length) throw new Error('You done goofed');

        let currentPoint: string = sequence[0];

        flow[beginAt][FlowDispatchTypes.NEXT] = currentPoint;
        flow[currentPoint] = {
            [FlowDispatchTypes.BACK]: beginAt
        };

        foldSequence(currentPoint, sequence, flow);
    }

    function foldSequence(currentPoint: string , sequence: string[], flow: any) {

        for (let i = 1; i < sequence.length; i++) {
            let temp: string = currentPoint;
            currentPoint = sequence[i];

            flow[temp][FlowDispatchTypes.NEXT] = currentPoint;
            flow[currentPoint] = {
                [FlowDispatchTypes.BACK]: temp
            };
        }

        flow[currentPoint][FlowDispatchTypes.NEXT] = 'details';
        flow['details'] = {
            [FlowDispatchTypes.BACK]: currentPoint
        };
    }

    function createInitialSteps(index: number) {
        const firstScreen = options[index].sequence[0];
        const ret: any = {
            confirmation: {
                [FlowDispatchTypes.NEXT]: 'verificationRequirement'
            },
            verificationRequirement: {
                [FlowDispatchTypes.BACK]: 'confirmation',
                [FlowDispatchTypes.NEXT]: firstScreen
            }
        };

        if (useMenu) {
            ret.verificationRequirement[FlowDispatchTypes.NEXT] = 'menu';
            ret['menu'] = {
                [FlowDispatchTypes.BACK]: 'verificationRequirement',
                [FlowDispatchTypes.NEXT]: firstScreen
            }
        }

        return ret;
    }

    function renderScreen(step: string) {
        Object.assign(componentMap, CONSTANTS.component_map);

        const component: any = React.lazy(() => import(__dirname + componentMap[step]!.path));

        return component;
    }

    return (
        <FlowDispatchContext.Provider value={() => dispatch}>
            <Suspense fallback="">
                <div className="KernelContainer">
                    <div className="KernelContent" data-cy={state.step}>
                        <TheComponent {...componentMap[state.step].props} CONSTANTS={CONSTANTS} store={componentStoreMethods} prevScreen={prevStep} authIndex={state.authIndex} />
                    </div>
                </div>
            </Suspense>
        </FlowDispatchContext.Provider> 
    );
}

export default FlowController;
