import {ComponentMap} from '../interfaces/FlowRouterInterfaces';
// import ConfirmationScreen from '../screens/ConfirmationScreen';
// import AuthenticationOptionMenu from '../screens/AuthenticationOptionMenu';
// import ResultDetails from '../screens/ResultDetails';

export const defaultComponentMap: ComponentMap = {
    confirmation: {
        component: 'ConfirmationScreen',
        props: {}
    },
    menu: {
        component: 'AuthenticationOptionMenu',
        props: {}
    },
    details: {
        component: 'ResultDetails',
        props: {}
    }
};
