import {ComponentMap} from '../interfaces/FlowRouterInterfaces';
// import ConfirmationScreen from '../screens/ConfirmationScreen';
// import AuthenticationOptionMenu from '../screens/AuthenticationOptionMenu';
// import ResultDetails from '../screens/ResultDetails';

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
    },
    details: {
        component: 'ResultDetails',
        props: {
            no_data: 'We could not process the data returned',
            record_type: '',
            authority_body: ''
        }
    }
};
