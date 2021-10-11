import { ComponentMap } from '../interfaces/FlowRouterInterfaces';

export const defaultComponentMap: ComponentMap = {
    confirmation: {
        component: '/preBuilt/ConfirmationScreen',
        props: {}
    },
    menu: {
        component: '/preBuilt/AuthenticationOptionMenu',
        props: {}
    },
    details: {
        component: '/preBuilt/ResultDetails',
        props: {}
    }
};
