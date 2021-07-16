import {ComponentStoreMethods} from './FlowRouterInterfaces';
import {IConstants} from './IConstants';
import {FlowAction} from './FlowRouterInterfaces';

export default interface ICommonProps {
    CONSTANTS: IConstants;
    store: ComponentStoreMethods;
    prevScreen: string;
    authIndex: number;
    dispatch: (action: FlowAction) => void;
}
