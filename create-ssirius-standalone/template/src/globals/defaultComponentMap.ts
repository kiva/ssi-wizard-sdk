import { ComponentMap } from '@kiva/ssirius-react';
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
