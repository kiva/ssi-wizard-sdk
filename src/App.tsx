import React from 'react';
import {IConstants} from './interfaces/IConstants';
import {defaultComponentMap} from './globals/defaultComponentMap';
import FlowRouter from './FlowRouter';

const config_constants: IConstants = {
  component_map: defaultComponentMap,
  auth_token: "",
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
