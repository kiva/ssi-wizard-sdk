# Agent Classes

SSI credential transactions mostly follow the same steps.

1. Invite another party to establish a connection.
2. Wait for the connection invitation to be accepted.
3. Next step depends on whether you're issuing a credential or verifying it:
    * Issuing: Offer the credential
    * Verifying: Send a verification request
4. Accept/prove the validity of the credential. Or decide that you don't want to.

Because there's a predictable flow to these transactions, we felt comfortable writing React components like [AgencyQR](https://github.com/kiva/ssi-wizard-sdk/tree/main/create-ssirius-standalone/template/src/preBuilt/AgencyQR) and [CredentialIssuance](https://github.com/kiva/ssi-wizard-sdk/tree/main/create-ssirius-standalone/template/src/preBuilt/CredentialIssuance) that simply use Agent classes that invoke methods like `connect` and `verify` rather than do all the logic for connecting and verifying.

In order to help YOU build your own Agent, we have created a few utilities.

## The Utilities

### `IBaseAgent`

Because the process of establishing a connection is the same whether you're Issuing or Verifying, we have abstracted that logic into an `IBaseAgent` interface.

This interface is NOT exported, but it's still useful to know the methods on offer, [because they are extended to `IIssuer` and `IVerifier`, as well](https://github.com/kiva/ssi-wizard-sdk/blob/main/react-core/src/interfaces/IAgent.ts).

```
interface IBaseAgent {
    isConnected(connectionData: any): boolean; // says whether a connection has been established
    connect(connectionId: string): Promise<any>; // initiates a connection
    getConnection(connectionId: string): Promise<any>; // gets status of a connection request
}
```

### `IIssuer`

The `IIssuer` interface extends `IBaseAgent` and an instance of it is required for the [CredentialIssuance](https://github.com/kiva/ssi-wizard-sdk/tree/main/create-ssirius-standalone/template/src/preBuilt/CredentialIssuance) component.

```
export interface IIssuer extends IBaseAgent {
    isOffered(response: any): boolean; // says whether the credential has been offered
    isIssued(response: any): boolean; // says whether the credential has been accepted
    createCredential(data: any): Promise<any>; // takes a bundle of data and kicks of the process of creating that credential
    checkCredentialStatus(credentialId: string): Promise<any>; // checks the status of a created credential - offered, issued, rejected, etc.
}
```

### `IVerifier`

The `IVerifier` interface extends `IBaseAgent` and an instance of it is required for the [AgencyQR](https://github.com/kiva/ssi-wizard-sdk/tree/main/create-ssirius-standalone/template/src/preBuilt/AgencyQR) component.

Verifications have two parts: a proof profile defining what criteria need to be satisfied in order for a proof to succeed, and a proof presentation, which is a credential-holder's attempt to satisfy the criteria. As such, the `IVerifier` interface has a little more stuff than `IIssuer`.

```
export interface IVerifier extends IBaseAgent {
    isVerified(response: any): boolean; // says if the proof has been verified
    fetchProofOptions?: () => Promise<any>; // an optional method if you have set up a service for getting proof profile definitions
    setProofProfile?: (proofProfile: string) => void; // an optional method for setting a proof profile based on a server response
    verify(connectionId: string, profile: any): Promise<any>; // initiates a verification of a proof presentation
    checkVerification(verificationId: string): Promise<any>; // checks the status of the verification
    getProof(data: any): any; // gets the data from a credential after a successful verification
    isRejected(response: any): boolean; // says if the proof presentation has been rejected
}
```

### `agentRequest`

The `agentRequest` function is a utility function to make a request to an external API in order to get SSI transaction data. It has three parameters.

* `request`: This is a Promise, usually via a request to an API. You should actually invoke your favorite call: `axios`, `fetch`, `$.ajax` if you're old-school...
    * Example: `agentRequest(axios.get('http://localhost:1337'))`
* `callback` (optional): If you need to massage the response from your request, you can do so via this `callback` function. This function should have a return value.
    * Example: `agentRequest(axios.get('https://<url>.com/getCreditReport?userId=wtv'), (report: CreditReport) => delete report.SecretData && return report)`
* `error` (optional): We have included default handling for errors, but if you'd like to include a custom error message, you can do so here as a string.

## How To Use These

An Agent class is a requirement for two of our pre-built components: [AgencyQR](https://github.com/kiva/ssi-wizard-sdk/tree/main/create-ssirius-standalone/template/src/preBuilt/AgencyQR) and [CredentialIssuance](https://github.com/kiva/ssi-wizard-sdk/tree/main/create-ssirius-standalone/template/src/preBuilt/CredentialIssuance). As may be obvious, `CredentialIssuance` is a component that enables issuing a credential. As is probably less obvious, `AgencyQR` is designed to verify a credential.

As such, `CredentialIssuance` requires an `IIssuer` type of Agent class, and the `AgencyQR` component requires an `IVerifier` type of Agent class.

The examples in this directory rely on the Kiva Protocol local backend, which you can run locally on your own machine [by going to our `protocol-integration-tests` repo and running through the setup process there](https://github.com/kiva/protocol-integration-tests), and the data we receive follows the RFCs from [AcaPy](https://github.com/hyperledger/aries-cloudagent-python).

Instead of breaking down the Agent classes themselves, we will show you how to add your own Agent to your front end application.

### Using `IIssuer` and `IVerifier` classes

#### Step 1: Create an Agent

The `CredentialIssuance` component requires you to provide an object that implements `IIssuer` as one of its props, while the `AgencyQR` component requires an `IVerifier`. Practically speaking, this means you need to create a class for yourself; it works very similarly, regardless of whether you're verifying or issuing.

For an issuing transaction:

```
import {IIssuer, agentRequest} from '@kiva/ssirius-react';

export default class MyIssuer implements IIssuer {}
```

For a verification transaction:

```
import {IVerifier, agentRequest} from '@kiva/ssirius-react';

export default class MyVerifier implements IVerifier {}
```

You'll need to implement the methods that we mentioned above, but you can also add any other internal methods you want to make sure that the class is working just the way you want it to. You can see some of the methods we wrote [by looking at our KivaIssuer class](https://github.com/kiva/ssi-wizard-sdk/blob/main/create-ssirius-standalone/template/src/examples/agents/KivaIssuer.ts) or our [KivaVerifier class](https://github.com/kiva/ssi-wizard-sdk/blob/main/create-ssirius-standalone/template/src/examples/agents/KivaVerifier.ts).

#### Step 2: Use your Agent in the `component_map`

We're going to assume that you've read all [about the `component_map` configuration used by SSIrius](https://github.com/kiva/ssi-wizard-sdk/tree/main/create-ssirius-standalone), so we'll skip directly to the pointy end.

```
import MyIssuer from './MyIssuer';
import MyVerifier from './MyVerifier';
import CredentialIssuance from './preBuilt/CredentialIssuance';
import AgencyQR from './preBuilt/AgencyQR';

const component_map = {
    ...
    issue: {
        component: CredentialIssuance,
        props: {
            agent: new MyIssuer()
        }
    },
    verify: {
        component: AgencyQR,
        props: {
            agent: new MyVerifier()
        }
    }
}
```

#### Step 3: Add your issuing flow to the configuration, like normal

```
// In constants.ts

verification_options: [
    {
        id: 'issuing',
        title: 'I, Issuer',
        type: 'issue',
        description:
            'I have a credential that you want. Come and get it.',
        sequence: ['issue']
    },
    {
        id: 'verifying',
        title: 'I, Verifier',
        type: 'verify',
        description:
            'Yes, you do need your stinking badges.',
        sequence: ['verify']
    }
]
```

#### Step 4: Read more about the `AgencyQR` and `CredentialIssuance` components individually

While it's easy enough to create a new agent for handling QR code transactions, the `CredentialIssuance` and `AgencyQR` components (specifically the former) have some other features that you'll need to read about in order to make them work properly.

We have written documentation about both components within their respective directories, so check them out before you go too crazy!

* [CredentialIssuance](https://github.com/kiva/ssi-wizard-sdk/tree/main/create-ssirius-standalone/template/src/preBuilt/CredentialIssuance)
* [AgencyQR](https://github.com/kiva/ssi-wizard-sdk/tree/main/create-ssirius-standalone/template/src/preBuilt/AgencyQR)