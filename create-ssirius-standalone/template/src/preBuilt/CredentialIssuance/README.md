### Description

This is a utility component that can be used as part of a flow to Issue someone a credential to their Mobile Wallet.

### Props
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

* `agent`

The `agent` prop needs to be an object that implements the `IIssuer` interface. You can figure out more about [how this works in our `examples` directory](https://github.com/kiva/ssi-wizard-sdk/tree/main/create-ssirius-standalone/template/src/examples/agents).