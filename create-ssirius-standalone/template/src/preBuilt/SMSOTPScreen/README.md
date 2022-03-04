### Description

This component is designed to facilitate a verification of a credential using a one-time password delivered via SMS.

### Props
* `backendURL`

Similarly to the [`ScanFingerprintScreen` component](https://github.com/kiva/ssi-wizard-sdk/tree/main/create-ssirius-standalone/template/src/preBuilt/ScanFingerprintScreen), the `backendURL` prop is a string containing the URL of a backend you'll be using. In this case, the backend will initiate the SMS transaction with a user, and` the one-time password that is sent to them.

* `phoneIntls`

The `phoneIntls` object is the configuration object that is passed in to the phone number input component on this screen. We use the [react-phone-input-2](https://www.npmjs.com/package/react-phone-input-2) component for this, so the value of `phoneIntls` should be a valid configuration object for it.