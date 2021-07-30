import FlowDispatchTypes from '../enums/FlowDispatchTypes';
import {IConstants} from '../interfaces/IConstants';
import {AuthOption} from '../interfaces/AuthOptionInterfaces';
import {Flow} from '../interfaces/FlowSelectorInterfaces';

export default getFlow;

function getFlow(index: number, CONSTANTS: IConstants): Flow {
    const options: AuthOption[] = CONSTANTS.verification_options;
    const useMenu: boolean = options.length > 1;

    return createFlow(index, options, useMenu);
}

function createFlow(
    index: number,
    options: AuthOption[],
    useMenu: boolean
): Flow {
    const initial: any = createInitialSteps(index, options, useMenu);
    injectAuthMethod(index, initial, options, useMenu);

    return initial;
}

function injectAuthMethod(
    index: number,
    flow: any,
    options: AuthOption[],
    useMenu: boolean
) {
    const beginAt: string = useMenu ? 'menu' : 'confirmation';
    const sequence: string[] = options[index].sequence;

    if (!sequence.length) throw new Error('You done goofed');

    const currentPoint: string = sequence[0];

    flow[beginAt][FlowDispatchTypes.NEXT] = currentPoint;
    flow[currentPoint] = {
        [FlowDispatchTypes.BACK]: beginAt
    };

    foldSequence(currentPoint, options[index], flow);
}

function foldSequence(currentPoint: string, option: AuthOption, flow: any) {
    const sequence = option.sequence;
    for (let i = 1; i < sequence.length; i++) {
        const temp: string = currentPoint;
        currentPoint = sequence[i];

        flow[temp][FlowDispatchTypes.NEXT] = currentPoint;
        flow[currentPoint] = {
            [FlowDispatchTypes.BACK]: temp
        };
    }

    if ('verify' === option.type) {
        flow[currentPoint][FlowDispatchTypes.NEXT] = 'details';
        flow['details'] = {
            [FlowDispatchTypes.BACK]: currentPoint
        };
    }
}

function createInitialSteps(
    index: number,
    options: AuthOption[],
    useMenu: boolean
) {
    const firstScreen = options[index].sequence[0];
    const ret: any = {
        confirmation: {
            [FlowDispatchTypes.NEXT]: firstScreen
        }
    };

    if (useMenu) {
        ret.confirmation[FlowDispatchTypes.NEXT] = 'menu';
        ret['menu'] = {
            [FlowDispatchTypes.BACK]: 'confirmation',
            [FlowDispatchTypes.NEXT]: firstScreen
        };
    }

    return ret;
}
