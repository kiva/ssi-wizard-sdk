# Components in SSIrius

[As mentioned](https://github.com/kiva/ssi-wizard-sdk/tree/main/standalone), components in SSIrius are configured via a key called `component_map`, and you should definitely read all about the ins and outs of this configuration before you go any further.

Welcome back! Enough of the theory - how do you actually configure a component? Because of how flexible the `props` object is, it really depends on the component. So, to help out, here are some guidelines for the components get the most benefit from configured `props`.

## By Component...

### `CredentialIssuance`

**Props**
* `dependencies`

Given that an issued credential needs to wrap up some amount of data, we've implemented a way for you to configure which pieces of data you would like to use via the `dependencies` prop.

`dependencies` is an object whose key values are always arrays of strings, which correspond to pieces of data which are saved to a particular component's Store. For example:

```
dependencies: {
    registrationForm: ['registrationFormData'],
    webcam: ['photo~attach']
}
```

Each key corresponds to a component, as defined in the `component_map`. So, assume in this example that `registrationForm` and `webcam` are keys in `component_map`.

The value of each key - the array - lists the data keys that are `set` via [the Component Store](https://github.com/kiva/ssi-wizard-sdk/tree/main/standalone#set), so you can further assume in this example that the component used in `registrationForm` used the Store to create a piece of data called `registrationFormData`.

The data defined in these keys will be merged together and form the object which is used to create the credential that is eventually issued.

### `FingerprintScanScreen`

**Props**
* `backendURL`

This component uses a `prop` called `backendURL`, which is a string containing the URL used to send fingerprint data to a backend which can cross-reference it with a database.

### `SMSOTPScreen`

**Props**
* `backendURL`
* `phoneIntls`

Similarly `FingerprintScanScreen`, the `backendURL` prop is a string containing the URL of a backend you'll be using. In this case, the backend will initiate the SMS transaction with a user, and very the one-time password that is sent to them.

The `phoneIntls` object is the configuration object that is passed in to the phone number input component on this screen. We use the [react-phone-input-2](https://www.npmjs.com/package/react-phone-input-2) component for this, so the value of `phoneIntls` should be a valid configuration object for it.

### `RegistrationForm`

**Props**
* `phoneIntls`

This object is of the same type as the `phoneIntls` prop for the `SMSOTPScreen`.

### `SearchMenu`

**Props**
* `dropdownConfig`

The `dropdownConfig` prop is an object which defines what kind of ID you'd like to use for a verification, along with a message to be shown the user in case of an error, and a validation function to make sure that whatever value is input corresponds to a specific definition.

```
dropdownConfig: {
    nationalId: { // a data key
        name: 'NIN', // the string shown in a dropdown menu in the UI
        errorMsg:
            'National ID must be eight characters long (capital letters and numbers only)', // a message to be shown in case of an input error, as defined by...
        validation: (input: string) => { // this function
            const parsed = input.match(/[A-Z0-9]/g);

            return (
                !!parsed &&
                parsed.length === 8 &&
                input.length === 8
            );
        }
    }
```

We do not currently support unit tests for this function, but it's on our to-do list.

