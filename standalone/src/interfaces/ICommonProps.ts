import {ComponentStoreMethods, FlowAction} from './FlowRouterInterfaces';
import {IConstants} from './IConstants';

export default interface ICommonProps {
    CONSTANTS: IConstants;
    store: ComponentStoreMethods;
    prevScreen: string;
    authIndex: number;
    dataHelper?: any;
    dispatch: (action: FlowAction) => void;
}