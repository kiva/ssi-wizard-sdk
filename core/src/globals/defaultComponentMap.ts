import {ComponentMap} from '../interfaces/FlowRouterInterfaces';

export const defaultComponentMap: ComponentMap = {
    confirmation: {
        component: 'ConfirmationScreen',
        props: {
            reviewText:
                'Please have the customer review the following information',
            agreement:
                'I agree that the following personal information will be shared with this organization as part of the "Know Your Customer" verification.',
            info_includes: 'Information shared includes your:',
            buttonText: 'Accept'
        }
    },
    menu: {
        component: 'AuthenticationOptionMenu',
        props: {
            instructions: 'Select a verification method',
            selectButtonText: 'Select'
        }
    }
};
