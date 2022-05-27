const permittedOpenerOrigins: any[] = [];

const config_constants = {
    standaloneConf: {
        isStandalone: true
    },
    defaultLang: 'en',
    auth_token: '',
    proof_profile_url: '',
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
        },
        {
            id: 'FP_Registration',
            title: 'Fingerprint Registration',
            type: 'issue',
            description:
                'Customer will scan their fingerprint in order to issue themselves a credential.',
            sequence: ['webcam', 'registrationForm', 'fpRegistration']
        }
    ],
    permittedOpenerOrigins
};

export default config_constants;
