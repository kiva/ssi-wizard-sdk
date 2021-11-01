import { ComponentStoreMethods, FlowAction } from './FlowRouterInterfaces';
import { IConstants } from './IConstants';
import { TFunction } from 'i18next';

export default interface CommonProps {
    CONSTANTS: IConstants;
    store: ComponentStoreMethods;
    prevScreen: string;
    authIndex: number;
    dataHelper?: any;
    dispatch: (action: FlowAction) => void;
    t: TFunction;
}
