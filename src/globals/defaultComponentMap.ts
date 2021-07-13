import {ComponentMap} from '../interfaces/FlowRouterInterfaces';

export const defaultComponentMap: ComponentMap = {
    confirmation: {
        path: '/commonComponents/ConfirmationScreen',
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
        path: '/commonComponents/AuthenticationOptionMenu',
        props: {
            instructions: 'Select a verification method',
            selectButtonText: 'Select'
        }
    },
    details: {
        path: '/commonComponents/ResultDetails',
        props: {}
    },
    verificationRequirement: {
        path: '/commonComponents/VerificationRequirementScreen',
        props: {
            header: 'Verification Required',
            instructions:
                'Please select the requirement for verifying credentials',
            backButtonText: 'Back',
            nextButtonText: 'Continue'
        }
    }
};
