const phoneIntls = {
    only: false,
    countries: ['us']
};

const config_constants = {
    standaloneConf: {
        isStandalone: true,
        headerImage: 'np_fingerprint_verified.png',
        org: 'Kiva',
        footerText: 'Powered by <strong>Kiva</strong>'
    },
    defaultLang: 'en',
    auth_token: '',
    proof_profile_url:
        'https://sandbox-gateway.protocol-prod.kiva.org/v2/kiva/api/profiles/proofs',
    credentialKeyMap: {
        firstName: {
            name: 'First Name',
            rendered: true,
            dataType: 'text'
        },
        lastName: {
            name: 'Last Name',
            rendered: true,
            dataType: 'text'
        },
        companyEmail: {
            name: 'Company Email',
            rendered: true,
            dataType: 'text'
        },
        hireDate: {
            name: 'Hire Date',
            rendered: true,
            dataType: 'date'
        },
        currentTitle: {
            name: 'Current Title',
            rendered: true,
            dataType: 'text'
        },
        team: {
            name: 'Team',
            rendered: true,
            dataType: 'text'
        },
        officeLocation: {
            name: 'Office Location',
            rendered: true,
            dataType: 'text'
        },
        type: {
            name: 'Employment Type',
            rendered: true,
            dataType: 'text'
        },
        endDate: {
            name: 'End Date',
            rendered: true,
            dataType: 'date'
        },
        'photo~attach': {
            name: 'Photo',
            dataType: 'image/jpeg;base64'
        },
        phoneNumber: {
            name: 'Phone',
            rendered: true,
            dataType: 'phoneNumber'
        }
    },
    component_map: {
        agency_qr: {
            component: 'AgencyQR',
            props: {},
            dataHelper: '../agents/KivaAgent'
        },
        email_input: {
            component: 'EmailScreen',
            props: {}
        },
        smsotp: {
            component: 'SMSOTPScreen',
            props: {
                phoneIntls,
                email_step: 'email_input',
                backendURL: 'https://sandbox-gateway.protocol-prod.kiva.org/v2/kyc/sms'
            },
            dataHelper: '../dataHelpers/GuardianSDK'
        },
        searchMenu: {
            component: 'SearchMenu',
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
            component: 'RegistrationForm',
            props: {phoneIntls}
        },
        webcam: {
            component: 'WebcamCaptureTool',
            props: {}
        },
        issue: {
            component: 'CredentialIssuance',
            props: {
                dependencies: {
                    registrationForm: ['registrationFormData'],
                    webcam: ['photo~attach']
                }
            }
        },
        table: {
            component: 'RegistrationUserTable',
            props: {}
        },
        fpScan: {
            component: 'ScanFingerprintScreen',
            props: {
                backendURL: 'https://sandbox-gateway.protocol-prod.kiva.org/v2/kyc'
            }
        }
    },
    verification_options: [
        {
            id: 'Kiva_QR',
            title: 'Mobile Wallet',
            type: 'verify',
            description:
                'Customer will use their wallet to establish a connection and provide credentials for proofs.',
            sequence: ['agency_qr']
        },
        {
            id: 'SMS_OTP',
            title: 'SMS',
            type: 'verify',
            description:
                'Customer will verify their identity using a one-time password delivered via text message.',
            sequence: ['email_input', 'smsotp']
        },
        {
            id: 'Issue',
            title: 'Kiva Credential',
            type: 'issue',
            description:
                "Issue Verifiable Credential to your customer's mobile wallet",
            sequence: ['webcam', 'registrationForm', 'issue']
        },
        {
            id: 'FP_Scan',
            title: 'Fingerprint Scan',
            type: 'verify',
            description:
                'Customer will scan their fingerprint in order to prove their identity.',
            sequence: ['searchMenu', 'fpScan']
        }
    ]
};

export default config_constants;
