import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {defaultComponentMap} from './globals/defaultComponentMap';
import {IConstants} from './interfaces/IConstants';

const config_constants: IConstants = {
    component_map: defaultComponentMap,
    auth_token:
        'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlJrTXpRVEEyUkRrMVJqSTBOVEUyTlVZNU1rTkJRekF6TWtGRU4wSTROalk1T0RreVFqVkJNZyJ9.eyJodHRwczovL2VreWMuc2wua2l2YS5vcmcvZmlyc3ROYW1lIjoiTmF0ZSIsImh0dHBzOi8vZWt5Yy5zbC5raXZhLm9yZy9sYXN0TmFtZSI6IlN1bGF0IiwiaHR0cHM6Ly9la3ljLnNsLmtpdmEub3JnL2JyYW5jaExvY2F0aW9uIjoiS0lWQS1IUSIsImh0dHBzOi8vZWt5Yy5zbC5raXZhLm9yZy9pbnN0aXR1dGlvbiI6IlR1cnRsZSBCYW5rIiwiaHR0cHM6Ly9la3ljLnNsLmtpdmEub3JnL2ZzcElkIjoiS2l2YSBNRkkiLCJodHRwczovL2VreWMuc2wua2l2YS5vcmcvZWt5Y0NoYWluIjoiVW5tMmdpOWRRdWZ3NlVKOGhGQnphWiIsImh0dHBzOi8vZWt5Yy5zbC5raXZhLm9yZy9yb2xlcyI6Im9wZXJhdG9yLW1hbmFnZW1lbnQsIHNhbmRib3gtbWFuYWdlbWVudCIsImh0dHBzOi8vZWt5Yy5zbC5raXZhLm9yZy9yZWNvcmRTZXNzaW9uIjpmYWxzZSwibmlja25hbWUiOiJuYXRlcytkZXYiLCJuYW1lIjoibmF0ZXNAa2l2YS5vcmciLCJwaWN0dXJlIjoiaHR0cHM6Ly9zLmdyYXZhdGFyLmNvbS9hdmF0YXIvYTg2NWJjYWUwZDI1YzEwMWJiYTg2N2Q2NzZmMmYyN2Q_cz00ODAmcj1wZyZkPWh0dHBzJTNBJTJGJTJGY2RuLmF1dGgwLmNvbSUyRmF2YXRhcnMlMkZuYS5wbmciLCJ1cGRhdGVkX2F0IjoiMjAyMS0wNy0xNVQyMDozODowMy4wNDhaIiwiZW1haWwiOiJuYXRlc0BraXZhLm9yZyIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczovL2tpdmEtcHJvdG9jb2wuYXV0aDAuY29tLyIsInN1YiI6ImF1dGgwfGF1dGgwfDVlMTY1NmQzYmQwM2ZiMGRiMzBkMmUzZiIsImF1ZCI6ImRuMkdOaG5wT1ZpREcxUDFwck5BdDVVQm9ONllFRUh1IiwiaWF0IjoxNjI2MzgxNDgzLCJleHAiOjE2MjY0MTAyODN9.INPEu6600soMpxqpYfgJYJGJWuVlYBklP_a39gTNQB8DDoQcuM63Mo4KchI72P4AStVbkFy40eE5DBfqDPmmWfkpIN1lnm7V8iFHue7Vq6i5NGHEYigCpCdUU2sUbeT2Z0YUqTDCTgsSwJqUZL_CYFrLtkkIOiEoACOkUNhTFIhdsoTl8Ih2IfDdpdbA6EQKRM_5iX0d4CkDTKcfHmnofwH3blElzPxU4XFxHoLmt2-zQTGMUgeStNHnM1_hca7V2CHjeuEWU6hjioPeDHKJ9oSQ0E5Nnk1S42ZPDy5C76RJmgIVTm7nA__vzQB78vINbKbwTioT2iLymb80DJcZMQ',
    proof_profile_url:
        'https://sandbox-gateway.protocol-prod.kiva.org/v2/kiva/api/profiles/proofs',
    verification_options: [
        {
            id: 'Kiva_QR',
            title: 'Mobile Wallet',
            description:
                'Customer will use their wallet to establish a connection and provide credentials for proofs.',
            sequence: ['agency_qr']
        },
        {
            id: 'SMS_OTP',
            title: 'SMS',
            description:
                'Customer will verify their identity using a one-time password delivered via text message.',
            sequence: ['email_input', 'smsotp']
        }
    ],
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
            dataType: 'photo~attach'
        },
        phoneNumber: {
            name: 'Phone',
            rendered: true,
            dataType: 'text'
        }
    },
    direction: 'ltr'
};

ReactDOM.render(
    <React.StrictMode>
        <App config={config_constants} />
    </React.StrictMode>,
    document.getElementById('root')
);
