const phoneIntls = {
    only: false,
    countries: ['us']
};

const config_constants = {
    component_map: {
        agency_qr: {
            component: 'AgencyQR',
            props: {
                no_connection_error:
                    'There was an error establishing a connection. Please try again and contact your IT department if the error persists.',
                no_invite:
                    'There was an error creating the QR code. Please try again and contact your IT department if the error persists.',
                click_verify: 'Click Verify to continue',
                retrieving_notice:
                    'Retrieving your QR code. Please be patient...',
                scan_qr: 'Scan QR Code',
                connection_established:
                    "Connection established successfully. A proof request will be sent to the user's wallet.",
                instructions:
                    'Please scan the QR code with the mobile wallet app',
                back_text: 'Back',
                next_text: 'Next',
                reset: 'Reset',
                rejected:
                    'Verification Failed: This credential may have been revoked or it may not have been able to fulfill the proof request:',
                verifying: 'Verifying'
            },
            dataHelper: '../agents/KivaAgent'
        },
        email_input: {
            component: 'EmailScreen',
            props: {
                no_input: 'Please enter your email in the field below',
                instructions: 'Please enter your email',
                back_text: 'Back',
                continue: 'Continue'
            }
        },
        smsotp: {
            component: 'SMSOTPScreen',
            props: {
                invalid_number: 'Please enter a valid phone number',
                invalid_otp: 'Please provide the full six-digit passcode',
                phoneIntls
            },
            dataHelper: '../dataHelpers/GuardianSDK'
        },
        searchMenu: {
            component: 'SearchMenu',
            props: {
                missingNamesError: 'You must provide your first and last names',
                dateInputError: 'Please enter a valid date',
                missingFuzzyDataError:
                    "Customer must provide their birthdate, their mother's first name or their father's first name",
                inputLengthError: 'Input must be between 1 and 50 characters',
                primaryInstructions:
                    'Enter the first name and last name of the customer to look up the ID information. The customer’s date of birth, mother’s first name or father’s first name will also be needed. All fields may also be filled out for a stronger search.',
                firstRowInstructions: 'Enter customer first name and last name',
                labelOne: 'First Name',
                labelTwo: 'Last Name',
                labelThree: 'Date of Birth',
                labelFour: "Mother's First Name",
                labelFive: "Father's First Name",
                nextText: 'Continue',
                backText: 'Back',
                firstRowHeader: 'Enter customer date of birth',
                secondRowHeader: "Enter Mother's or Father's First Name",
                secondRowSubheader: 'Required if DOB is not entered',
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
                },
                instructions: "Enter the customer's ID",
                placeholder: 'Enter a valid ID',
                alternateSearchInstructions: "Customer Doesn't Know ID"
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
                },
                no_invite:
                    'There was an error creating the QR code. Please try again and contact your IT department if the error persists.',
                noConnectionWarning:
                    'Please scan the QR code and establish a connection before you verify',
                connectionEstablishedNotice:
                    "Connection established successfully. A proof request will be sent to the user's wallet.",
                scanCodeInstructions: 'Scan QR Code',
                retrievingQRNotice:
                    'Retrieving your QR code. Please be patient...',
                backText: 'Back'
            }
        },
        table: {
            component: 'RegistrationUserTable',
            props: {}
        },
        fpScan: {
            component: 'ScanFingerprintScreen',
            props: {}
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
