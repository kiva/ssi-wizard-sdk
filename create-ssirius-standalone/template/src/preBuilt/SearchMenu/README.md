### Description

This component provides a single text field and a dropdown menu

### Props
* `dropdownConfig`

The `dropdownConfig` prop is an object which defines what kind of ID you'd like to use for a verification, along with a message to be shown the user in case of an error, and a validation function to make sure that whatever value is input corresponds to a specific definition.

```
dropdownConfig: {
    nationalId: { // a data key
        name: 'NIN', // the string shown in a dropdown menu in the UI
        errorMsg: 'National ID must be eight characters long (capital letters and numbers only)', // a message to be shown in case of an input error, as defined by...
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