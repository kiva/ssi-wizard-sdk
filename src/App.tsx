import React from 'react';
import {IConstants} from './interfaces/IConstants';
import {defaultComponentMap} from './globals/defaultComponentMap';
import FlowRouter from './FlowRouter';

const config_constants: IConstants = {
  component_map: defaultComponentMap,
  auth_token: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlJrTXpRVEEyUkRrMVJqSTBOVEUyTlVZNU1rTkJRekF6TWtGRU4wSTROalk1T0RreVFqVkJNZyJ9.eyJodHRwczovL2VreWMuc2wua2l2YS5vcmcvZmlyc3ROYW1lIjoiTmF0ZSIsImh0dHBzOi8vZWt5Yy5zbC5raXZhLm9yZy9sYXN0TmFtZSI6IlN1bGF0IiwiaHR0cHM6Ly9la3ljLnNsLmtpdmEub3JnL2JyYW5jaExvY2F0aW9uIjoiS0lWQS1IUSIsImh0dHBzOi8vZWt5Yy5zbC5raXZhLm9yZy9pbnN0aXR1dGlvbiI6IlR1cnRsZSBCYW5rIiwiaHR0cHM6Ly9la3ljLnNsLmtpdmEub3JnL2ZzcElkIjoiS2l2YSBNRkkiLCJodHRwczovL2VreWMuc2wua2l2YS5vcmcvZWt5Y0NoYWluIjoiVW5tMmdpOWRRdWZ3NlVKOGhGQnphWiIsImh0dHBzOi8vZWt5Yy5zbC5raXZhLm9yZy9yb2xlcyI6Im9wZXJhdG9yLW1hbmFnZW1lbnQsIHNhbmRib3gtbWFuYWdlbWVudCIsImh0dHBzOi8vZWt5Yy5zbC5raXZhLm9yZy9yZWNvcmRTZXNzaW9uIjpmYWxzZSwibmlja25hbWUiOiJ0aWFyYWMiLCJuYW1lIjoidGlhcmFjQGludGVybnMua2l2YS5vcmciLCJwaWN0dXJlIjoiaHR0cHM6Ly9zLmdyYXZhdGFyLmNvbS9hdmF0YXIvYjFlOTg3MzliOGI0NzQyYmRlYmI5OThkYmQzMzUzNWI_cz00ODAmcj1wZyZkPWh0dHBzJTNBJTJGJTJGY2RuLmF1dGgwLmNvbSUyRmF2YXRhcnMlMkZ0aS5wbmciLCJ1cGRhdGVkX2F0IjoiMjAyMS0wNy0xNVQyMTozNTo1OS43NDdaIiwiZW1haWwiOiJ0aWFyYWNAaW50ZXJucy5raXZhLm9yZyIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiaXNzIjoiaHR0cHM6Ly9raXZhLXByb3RvY29sLmF1dGgwLmNvbS8iLCJzdWIiOiJhdXRoMHw2MGRlMjJmNTFiN2NiMTAwNjk1MDAxM2YiLCJhdWQiOiJkbjJHTmhucE9WaURHMVAxcHJOQXQ1VUJvTjZZRUVIdSIsImlhdCI6MTYyNjM4NDk1OSwiZXhwIjoxNjI2NDEzNzU5fQ.P1XrXxM84olvNNQ0IYPoLYktWWp6IBZ3HXjwDCtGhDguErKBs-KGU_otURVQ9H8yPMwilEa4n6jj9hQfRWdif_29thh_q3pW0XvrzP2tyj-GWUJYBASx7hw_qml49v0x382l_wLtTOb52Hx8tVKLMRb9T64H88uay74jJjAqSe_7ri517jFBetxhD86nAHKBpndwyNaiUFSu3tGJWMqpJCOznG1WQ4KNnn6w6MW465D2CVJA4in3sn-_j2QvCTd-l_89DvX3GYOU9aN84C6WNp5VCf6xkoQPLWkKIU3zrxMUWkLTE7hs46Y8vT4iKDHXuxQ_9dg22a0jqPqTqV2U5Q",
  proof_profile_url: "https://sandbox-gateway.protocol-prod.kiva.org/v2/kiva/api/profiles/proofs",
  verification_options: [
    {
      id: "Kiva_QR",
      title: "Mobile Wallet",
      description: "Customer will use their wallet to establish a connection and provide credentials for proofs.",
      sequence: ["agency_qr"]
    },
    {
      id: "SMS_OTP",
      title: "SMS",
      description: "Customer will verify their identity using a one-time password delivered via text message.",
      sequence: ["email_input", "smsotp"]
    }
  ],
  credentialKeyMap: {
    "firstName": {
        "name": "First Name",
        "rendered": true,
        "dataType": "text"
    },
    "lastName": {
        "name": "Last Name",
        "rendered": true,
        "dataType": "text"
    },
    "companyEmail": {
        "name": "Company Email",
        "rendered": true,
        "dataType": "text"
    },
    "hireDate": {
        "name": "Hire Date",
        "rendered": true,
        "dataType": "date"
    },
    "currentTitle": {
        "name": "Current Title",
        "rendered": true,
        "dataType": "text"
    },
    "team": {
        "name": "Team",
        "rendered": true,
        "dataType": "text"
    },
    "officeLocation": {
        "name": "Office Location",
        "rendered": true,
        "dataType": "text"
    },
    "type": {
        "name": "Employment Type",
        "rendered": true,
        "dataType": "text"
    },
    "endDate": {
        "name": "End Date",
        "rendered": true,
        "dataType": "date"
    },
    "photo~attach": {
        "name": "Photo",
        "dataType": "photo~attach"
    },
    "phoneNumber": {
        "name": "Phone",
        "rendered": true,
        "dataType": "text"
    }
  },
  direction: "ltr"
};

function App() {
  return <FlowRouter {...config_constants} />;
}

export default App;
