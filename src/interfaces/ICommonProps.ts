import {ComponentStoreMethods} from './FlowRouterInterfaces';
import {IConstants} from './IConstants';

export default interface ICommonProps {
    CONSTANTS: IConstants;
    store: ComponentStoreMethods;
    prevScreen: string;
    authIndex: number;
}
