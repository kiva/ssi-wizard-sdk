

import { IIssuer, IVerifier } from './IAgent';
import { ComponentStoreMethods, FlowAction } from './FlowRouterInterfaces';
import { IConstants } from './IConstants';
import { IGuardianSDK } from '../interfaces/GuardianInterfaces';

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
    guardianSDK: IGuardianSDK;
}