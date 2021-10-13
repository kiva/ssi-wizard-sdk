import AgencyQR from "./preBuilt/AgencyQR";
import RegistrationForm from "./preBuilt/RegistrationForm";
import SearchMenu from "./preBuilt/SearchMenu";
import ScanFingerprintScreen from "./preBuilt/ScanFingerprintScreen";
import CredentialIssuance from "./preBuilt/CredentialIssuance";
import EmailScreen from "./preBuilt/EmailScreen";
import SMSOTPScreen from "./preBuilt/SMSOTPScreen";
import WebcamCaptureTool from "./preBuilt/WebcamCaptureTool";

const phoneIntls = {
    only: false,
    countries: ['us']
};

const component_map = {
    agency_qr: {
        component: AgencyQR,
        props: {},
        dataHelper: '../agents/KivaAgent'
    },
    email_input: {
        component: EmailScreen,
        props: {}
    },
    smsotp: {
        component: SMSOTPScreen,
        props: {
            phoneIntls,
            email_step: 'email_input',
            backendURL: 'https://sandbox-gateway.protocol-prod.kiva.org/v2/kyc/sms'
        },
        dataHelper: '../dataHelpers/GuardianSDK'
    },
    searchMenu: {
        component: SearchMenu,
        props: {
            dropdownConfig: {
                nationalId: {
                    name: 'NIN',
                    errorMsg:
                        'National ID must be eight characters long (capital letters and numbers only)',
                    validation: (input: string) => {
                        const parsed = input.match(/[A-Z0-9]/g);

                        return (
                            !!parsed &&
                            parsed.length === 8 &&
                            input.length === 8
                        );
                    }
                },
                voterId: {
                    name: 'Voter ID',
                    errorMsg: 'Voter ID must be seven digits',
                    validation: (input: string) => {
                        const voterIdDigits: string[] = input.split('');

                        return (
                            voterIdDigits.length === 7 &&
                            voterIdDigits.every(
                                (n: string) => !isNaN(Number(n))
                            )
                        );
                    }
                }
            }
        }
    },
    registrationForm: {
        component: RegistrationForm,
        props: { phoneIntls }
    },
    webcam: {
        component: WebcamCaptureTool,
        props: {}
    },
    issue: {
        component: CredentialIssuance,
        props: {
            dependencies: {
                registrationForm: ['registrationFormData'],
                webcam: ['photo~attach']
            }
        }
    },
    fpScan: {
        component: ScanFingerprintScreen,
        props: {
            backendURL: 'https://sandbox-gateway.protocol-prod.kiva.org/v2/kyc'
        }
    }
};

export default component_map;