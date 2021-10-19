import { ComponentMap } from '../interfaces/FlowRouterInterfaces';
import ConfirmationScreen from '../preBuilt/ConfirmationScreen';
import AuthenticationOptionMenu from '../preBuilt/AuthenticationOptionMenu';
import ResultDetails from '../preBuilt/ResultDetails';

export const defaultComponentMap: ComponentMap = {
    confirmation: {
        component: ConfirmationScreen,
        props: {}
    },
    menu: {
        component: AuthenticationOptionMenu,
        props: {}
    },
    details: {
        component: ResultDetails,
        props: {}
    }
};
