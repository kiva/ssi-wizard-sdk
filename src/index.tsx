import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {defaultComponentMap} from './globals/defaultComponentMap';
import {IConstants} from './interfaces/IConstants';

const config_constants: IConstants = {
    component_map: defaultComponentMap,
    auth_token:
        'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlJrTXpRVEEyUkRrMVJqSTBOVEUyTlVZNU1rTkJRekF6TWtGRU4wSTROalk1T0RreVFqVkJNZyJ9.eyJodHRwczovL2VreWMuc2wua2l2YS5vcmcvZmlyc3ROYW1lIjoiTmF0ZSIsImh0dHBzOi8vZWt5Yy5zbC5raXZhLm9yZy9sYXN0TmFtZSI6IlN1bGF0IiwiaHR0cHM6Ly9la3ljLnNsLmtpdmEub3JnL2JyYW5jaExvY2F0aW9uIjoiS0lWQS1IUSIsImh0dHBzOi8vZWt5Yy5zbC5raXZhLm9yZy9pbnN0aXR1dGlvbiI6IlR1cnRsZSBCYW5rIiwiaHR0cHM6Ly9la3ljLnNsLmtpdmEub3JnL2ZzcElkIjoiS2l2YSBNRkkiLCJodHRwczovL2VreWMuc2wua2l2YS5vcmcvZWt5Y0NoYWluIjoiVW5tMmdpOWRRdWZ3NlVKOGhGQnphWiIsImh0dHBzOi8vZWt5Yy5zbC5raXZhLm9yZy9yb2xlcyI6Im9wZXJhdG9yLW1hbmFnZW1lbnQsIHNhbmRib3gtbWFuYWdlbWVudCIsImh0dHBzOi8vZWt5Yy5zbC5raXZhLm9yZy9yZWNvcmRTZXNzaW9uIjpmYWxzZSwibmlja25hbWUiOiJuYXRlcytkZXYiLCJuYW1lIjoibmF0ZXNAa2l2YS5vcmciLCJwaWN0dXJlIjoiaHR0cHM6Ly9zLmdyYXZhdGFyLmNvbS9hdmF0YXIvYTg2NWJjYWUwZDI1YzEwMWJiYTg2N2Q2NzZmMmYyN2Q_cz00ODAmcj1wZyZkPWh0dHBzJTNBJTJGJTJGY2RuLmF1dGgwLmNvbSUyRmF2YXRhcnMlMkZuYS5wbmciLCJ1cGRhdGVkX2F0IjoiMjAyMS0wNy0wOFQyMzoxOTowMi4yMjhaIiwiZW1haWwiOiJuYXRlc0BraXZhLm9yZyIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczovL2tpdmEtcHJvdG9jb2wuYXV0aDAuY29tLyIsInN1YiI6ImF1dGgwfGF1dGgwfDVlMTY1NmQzYmQwM2ZiMGRiMzBkMmUzZiIsImF1ZCI6ImRuMkdOaG5wT1ZpREcxUDFwck5BdDVVQm9ONllFRUh1IiwiaWF0IjoxNjI1Nzg2MzQyLCJleHAiOjE2MjU4MTUxNDJ9.GeVIIPm4a8wwoTUpu-yNiRMg-xudkU-Wi76TXlDOGPkMAagVUvLZBIUMfyUrk2jQ7MQGU0jW-YgW8w2FBU8o4CvII4oOXy6iF5pKkP2G0XrJwkzfvqbK_k1dF4T9gs9St5wqDa_5QIFpwAOXxeoyYmBmNCpsERHO5R27v2w1vWX1k3LexawwTB9TPXu0S7j1H6MO8XZ7jdYug4Lwrs3K4yDJlrBBS6vphy0wabYXhZgfMjWIW_nvvhZj4FUpNZfiaZ9HbbOdQhJzIc5piia16Zb7ykhVCUeiSMDjPG-iv3YY3YnNsfy2GcA-CT_966fD09s6r97n56vjue3Ukqs_Hw',
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
