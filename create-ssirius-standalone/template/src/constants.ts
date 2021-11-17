const permittedOpenerOrigins: any[] = [];

const config_constants = {
    standaloneConf: {
        isStandalone: true
    },
    defaultLang: 'en',
    auth_token: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlJrTXpRVEEyUkRrMVJqSTBOVEUyTlVZNU1rTkJRekF6TWtGRU4wSTROalk1T0RreVFqVkJNZyJ9.eyJodHRwczovL2VreWMuc2wua2l2YS5vcmcvZmlyc3ROYW1lIjoiTmF0ZSIsImh0dHBzOi8vZWt5Yy5zbC5raXZhLm9yZy9sYXN0TmFtZSI6IlN1bGF0IiwiaHR0cHM6Ly9la3ljLnNsLmtpdmEub3JnL2JyYW5jaExvY2F0aW9uIjoiS0lWQS1IUSIsImh0dHBzOi8vZWt5Yy5zbC5raXZhLm9yZy9pbnN0aXR1dGlvbiI6IlR1cnRsZSBCYW5rIiwiaHR0cHM6Ly9la3ljLnNsLmtpdmEub3JnL2ZzcElkIjoiS2l2YSBNRkkiLCJodHRwczovL2VreWMuc2wua2l2YS5vcmcvZWt5Y0NoYWluIjoiVW5tMmdpOWRRdWZ3NlVKOGhGQnphWiIsImh0dHBzOi8vZWt5Yy5zbC5raXZhLm9yZy9yb2xlcyI6Im9wZXJhdG9yLW1hbmFnZW1lbnQsc2FuZGJveC1oZWxwZXJzLHNhbmRib3gtbWFuYWdlbWVudCxjcmVkaXQtcmVwb3J0aW5nIiwiaHR0cHM6Ly9la3ljLnNsLmtpdmEub3JnL3JlY29yZFNlc3Npb24iOmZhbHNlLCJodHRwczovL3Byb3RvY29sLmtpdmEub3JnL2FnZW50Ijoicm5wLWFnZW50Iiwibmlja25hbWUiOiJuYXRlcytkZXYiLCJuYW1lIjoibmF0ZXNAa2l2YS5vcmciLCJwaWN0dXJlIjoiaHR0cHM6Ly9zLmdyYXZhdGFyLmNvbS9hdmF0YXIvYTg2NWJjYWUwZDI1YzEwMWJiYTg2N2Q2NzZmMmYyN2Q_cz00ODAmcj1wZyZkPWh0dHBzJTNBJTJGJTJGY2RuLmF1dGgwLmNvbSUyRmF2YXRhcnMlMkZuYS5wbmciLCJ1cGRhdGVkX2F0IjoiMjAyMS0xMS0xN1QxNzo0MjoyNS43MTRaIiwiZW1haWwiOiJuYXRlc0BraXZhLm9yZyIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczovL2tpdmEtcHJvdG9jb2wuYXV0aDAuY29tLyIsInN1YiI6ImF1dGgwfGF1dGgwfDVlMTY1NmQzYmQwM2ZiMGRiMzBkMmUzZiIsImF1ZCI6ImRuMkdOaG5wT1ZpREcxUDFwck5BdDVVQm9ONllFRUh1IiwiaWF0IjoxNjM3MTcwOTQ1LCJleHAiOjE2MzcxOTk3NDV9.Rg2JYWW7d339CwUkEFOV2TVGFP3GUdYaw7wQXDj-zawP2RQE4vshlGOT9PkdwrjkDT9Ey_IDAA3uzUiLmiQo3JPfdtU-gjtpJ4Mfn21AOilKq5roVlMKldJ4g4KGvq_umshDqUM9quddKPWQKsFRWzqFGWAfl9dOj_PTJt5pOL4tOT4BS_peM6zw49ndYuiVpu8nVhiggcY-ZBy6vSAU_yGZxq6SrXahwgeW561kc_OKbavbB-4lNJx5eqYSvWUtC1YXr_2Vf1eDu1xz44b_hZ3OqY5x-tkOC1vA5VqpjZ_4HSufTew1d8G5TfAucS6Qk3s_jnk3UuzE10Lx8cXpOA',
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
        }
    ],
    permittedOpenerOrigins
};

export default config_constants;
