import AgencyQR from "./preBuilt/AgencyQR";
import RegistrationForm from "./preBuilt/RegistrationForm";
import SearchMenu from "./preBuilt/SearchMenu";
import ScanFingerprintScreen from "./preBuilt/ScanFingerprintScreen";
import CredentialIssuance from "./preBuilt/CredentialIssuance";
import EmailScreen from "./preBuilt/EmailScreen";
import SMSOTPScreen from "./preBuilt/SMSOTPScreen";
import WebcamCaptureTool from "./preBuilt/WebcamCaptureTool";
import FingerprintRegistration from "./preBuilt/FingerprintRegistration";
import KivaVerifier from "./examples/agents/KivaVerifier";
import KivaIssuer from "./examples/agents/KivaIssuer";
import { GuardianSDK } from "@kiva/ssirius-react";
import config_constants from "./constants";
import { FPErrorHandler } from "./examples/errorHandlers/FPErrorHandler";
import { SMSErrorHandler } from "./examples/errorHandlers/SMSErrorHandler";
import axios from "axios";
import { FingerprintMap, FpIndex } from "./preBuilt/FingerprintRegistration/interfaces/FingerprintRegistrationInterfaces";
import FPScanner from "./helpers/FPScanner";
import getPostBody from "./helpers/getPostBody";

const phoneIntls = {
    only: false,
    countries: ['us']
};

const component_map = {
    agency_qr: {
        component: AgencyQR,
        props: {
            agent: new KivaVerifier(config_constants.auth_token)
        }
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
            guardianSDK: GuardianSDK.init({
                url: 'https://sandbox-gateway.protocol-prod.kiva.org/v2/kyc/sms',
                token: config_constants.auth_token,
                errorHandler: SMSErrorHandler
            })
        }
    },
    searchMenu: {
        component: SearchMenu,
        props: {
            dropdownConfig: {
                companyEmail: {
                    name: 'Email',
                    errorMsg: 'Please enter a valid email',
                    validation: (input: string) => {
                        return input.length > 0 && document.querySelector(':invalid') === null;
                    },
                    type: 'email'
                },
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
            agent: new KivaIssuer('identity.proof.request.json', config_constants.auth_token),
            dependencies: {
                registrationForm: ['registrationFormData'],
                webcam: ['photo~attach']
            }
        }
    },
    fpScan: {
        component: ScanFingerprintScreen,
        props: {
            guardianSDK: GuardianSDK.init({
                url: 'http://localhost:8080/v2/kyc',
                token: config_constants.auth_token,
                errorHandler: FPErrorHandler
            }),
            scanner: FPScanner,
            getPostBody
        }
    },
    fpRegistration: {
        component: FingerprintRegistration,
        props: {
            getFingerprint: async function() {
                const {data} = await axios.get('http://localhost:9907/EKYC/Fingerprint');
                return data.ImageBase64;
            },
            register: async function(fingerprints: FingerprintMap, dependencyData: any) {
                const params = [];
                const headers: any = {};
                if (config_constants.auth_token) {
                    headers.Authorization = `Bearer ${config_constants.auth_token}`;
                }
                for (const i in fingerprints) {
                    const idx: FpIndex = i as unknown as FpIndex; // this is terrible
                    if (!!fingerprints[idx].image) {
                        params.push({
                            image: fingerprints[idx].image,
                            capture_date: fingerprints[idx].captured,
                            position: idx.toString(),
                            missing_code: null,
                            type_id: '1'
                        });
                    }
                }

                return axios.post('http://localhost:8080/v2/kiva/api/guardian/enroll', {
                    guardianData: [{
                        pluginType: 'FINGERPRINT',
                        filters: {
                            externalIds: {
                                companyEmail: dependencyData.email
                            }
                        },
                        params
                    }]
                }, {headers});
            },
            dependencies: {
                email_input: ['email']
            }
        }
    }
};

export default component_map;
