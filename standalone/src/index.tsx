// import React from 'react';
// import ReactDOM from 'react-dom';
// import App from './App';
import {defaultComponentMap} from './globals/defaultComponentMap';
import receivedConfig from './config';
import {mergeAdvanced} from 'object-merge-advanced';
import ssirius from '@kiva/ssirius-core';

const config_constants = {
    component_map: defaultComponentMap,
    auth_token: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlJrTXpRVEEyUkRrMVJqSTBOVEUyTlVZNU1rTkJRekF6TWtGRU4wSTROalk1T0RreVFqVkJNZyJ9.eyJodHRwczovL2VreWMuc2wua2l2YS5vcmcvZmlyc3ROYW1lIjoiTmF0ZSIsImh0dHBzOi8vZWt5Yy5zbC5raXZhLm9yZy9sYXN0TmFtZSI6IlN1bGF0IiwiaHR0cHM6Ly9la3ljLnNsLmtpdmEub3JnL2JyYW5jaExvY2F0aW9uIjoiS0lWQS1IUSIsImh0dHBzOi8vZWt5Yy5zbC5raXZhLm9yZy9pbnN0aXR1dGlvbiI6IlR1cnRsZSBCYW5rIiwiaHR0cHM6Ly9la3ljLnNsLmtpdmEub3JnL2ZzcElkIjoiS2l2YSBNRkkiLCJodHRwczovL2VreWMuc2wua2l2YS5vcmcvZWt5Y0NoYWluIjoiVW5tMmdpOWRRdWZ3NlVKOGhGQnphWiIsImh0dHBzOi8vZWt5Yy5zbC5raXZhLm9yZy9yb2xlcyI6Im9wZXJhdG9yLW1hbmFnZW1lbnQsIHNhbmRib3gtbWFuYWdlbWVudCIsImh0dHBzOi8vZWt5Yy5zbC5raXZhLm9yZy9yZWNvcmRTZXNzaW9uIjpmYWxzZSwibmlja25hbWUiOiJuYXRlcytkZXYiLCJuYW1lIjoibmF0ZXNAa2l2YS5vcmciLCJwaWN0dXJlIjoiaHR0cHM6Ly9zLmdyYXZhdGFyLmNvbS9hdmF0YXIvYTg2NWJjYWUwZDI1YzEwMWJiYTg2N2Q2NzZmMmYyN2Q_cz00ODAmcj1wZyZkPWh0dHBzJTNBJTJGJTJGY2RuLmF1dGgwLmNvbSUyRmF2YXRhcnMlMkZuYS5wbmciLCJ1cGRhdGVkX2F0IjoiMjAyMS0wOC0xMFQxODoyODozMy4xMjdaIiwiZW1haWwiOiJuYXRlc0BraXZhLm9yZyIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczovL2tpdmEtcHJvdG9jb2wuYXV0aDAuY29tLyIsInN1YiI6ImF1dGgwfGF1dGgwfDVlMTY1NmQzYmQwM2ZiMGRiMzBkMmUzZiIsImF1ZCI6ImRuMkdOaG5wT1ZpREcxUDFwck5BdDVVQm9ONllFRUh1IiwiaWF0IjoxNjI4NjIwMTEzLCJleHAiOjE2Mjg2NDg5MTN9.zV8xbQSCps5YDLzC6cLmWDckBLWZS4vf0-8rRdEb803BprYVJ6nUDFdVqXWFkpMR595M4fPc7KYZe7UkwhSeuSA30OlBaCCRY_qOMTyCOigZWRvSfrLudxUstCem2s7EzJT4EDHyRpRQFe3SlpT0Iu-cW4LCHLH6So-2oslvAqsTZqh4C21j9WkbHDhEXToEe-VgX-04gjLyB4XYgfg0BrBJc-K6mbbh21tWlgnTG3zxEl3UaluJf9nRhV38eyT6u9RNcPN9dSAiQUjDgCOQysLbdgNmhE0cIEmRJGlucT5Joc3qgDCKTs406Bu9X2D0EefQ9nKdhC0LgdJrj8fLtw',
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
    direction: 'ltr'
};
console.log(ssirius);
ssirius(mergeAdvanced(config_constants, receivedConfig, {}), 'root');
console.log('do the thing');
// ReactDOM.render(
//     <React.StrictMode>
//         <App config={mergeAdvanced(config_constants, receivedConfig, {})} />
//     </React.StrictMode>,
//     document.getElementById('root')
// );
