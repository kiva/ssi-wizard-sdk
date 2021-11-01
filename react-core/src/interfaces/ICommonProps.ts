

import { IIssuer, IVerifier } from './IAgent';
import GuardianSDKClass from '../abstracts/GuardianSDKClass';
import { ComponentStoreMethods, FlowAction } from './FlowRouterInterfaces';
import { IConstants } from './IConstants';

export interface ICommonProps {
    CONSTANTS: IConstants;
    store: ComponentStoreMethods;
    prevScreen: string;
    authIndex: number;
    dispatch: (action: FlowAction) => void;
    t?: Function;
}

export interface AgentUIProps extends ICommonProps {
    agent: IIssuer | IVerifier;
}

export interface GuardianUIProps extends ICommonProps {
    guardianSDK: GuardianSDKClass;
}