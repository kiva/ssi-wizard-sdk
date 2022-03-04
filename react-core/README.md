### `@kiva/ssirius-react`

The `@kiva/ssirius-react` package provides a React component designed to help you quickly add SSI UI to existing React projects, but in addition there are many helpful tools and types that you can import to help you build your own SSI UI.

#### Quick Start

To install and use the package, you can run:

```
npm i @kiva/ssirius-react
```

Once installed, it can be imported like any other React component, though keep in mind that the below example will not compile in TypeScript because the `SSIriusRouter` component has required props that aren't being used here. Check the next section for a description of `IConstants`.

```
import React from 'react';
import SSIriusRouter from '@kiva/ssirius-react;

export default function MySSIApp(props: any) {
    return <div>
        <h1>Hello!</h1>
        <SSIriusRouter />
    </div>;
}
```

#### Ok, but what is it?

Excellent question.

SSI transactions, like any other kind of transaction, require you to follow a certain sequence of events. Following the steps in the wrong order will work about as well as putting on your socks after your shoes. That said, every entity doing an SSI transaction, whether Issuing or Verifying a Credential, will have their own sequence that they want to follow - issuing a passport has a much different set of requirements than issuing a gift certificate, even if the underlying technology enabling the issuing is basically the same.

To allow for flexibility in setting and following a desired sequence of events, we've created a React component that allows you to configure what kind of transaction will be taking place (Issuing or Verifying), to define what kind of credential is going to be used or checked, to make it easy to slot a new React component into any step of the process, and to allow multiple different types of transactions to be supported within the same application.

For example, let's say you have a form that you want someone to fill out to issue them a ticket to the cricket. This cricket ticket just so happens to be asking for the same information required to issue someone a stock for a lock company. Rather than have to create a new application, or even a new React component, you can support issuing the cricket ticket and the lock stock using the same code, and still have it look like two separate UI flows. (Because heaven forbid you accidentally give someone a lock stock when they really wanted a cricket ticket!)

Going one step further, we have endeavored to make it so that that same code used in the registration form is flexible enough that, even if you have a credential that uses completely different data than what you'd use for a cricket ticket or a lock stock, you can still use it across all three credential types.

The `SSIriusRouter` is designed to support these use cases, but the `@kiva/ssirius-react` package also has lots of goodies to make it easy to develop your own code to slot into the component - rather than wait for the open source community to develop the feature you need, you can code it right away and not have to change your application's architecture.

#### How to Use `SSIriusRouter`

As mentioned in the above example, the `SSIriusRouter` requires certain props in order to function properly. There are actually quite a lot of these, so in order to make it easy to keep track, [we created the `IConstants` interface to define a configuration object](https://github.com/kiva/ssi-wizard-sdk/blob/main/react-core/src/interfaces/IConstants.ts) for the `SSIriusRouter`.

Here are the most important properties of an `IConstants` configuration:
* `verification_options`: This is an array of transactions that you want to support with your app. Each element of the array is an [AuthOption](https://github.com/kiva/ssi-wizard-sdk/blob/main/react-core/src/interfaces/AuthOptionInterfaces.ts) object, which we'll get into later.
* `credentialKeyMap`: This object defines the data that is going to be asked for when issuing, or provided when verifying.
* `direction`: By default, our UI is rendered with left-to-right text. If you want to use a language that is read right-to-left, switch this value to be `rtl`.
* `component_map`: This object creates a definition of what components are used in each part of a transaction's sequence. More on this later.
* `defaultLang`: You can use this to pass in the code of the language you'll be using: `en-US` for American English, `es-MX` for Mexican Spanish, etc. We hope it will be useful for your `i18n` implementation!
* `auth_token` (optional): If you want to have an authentication token available to all of your components, you can add it here
* `proof_profile_url` (optional): If you want to use an API to provide a list of credentials or proofs that you want to be able to support, put your URL into this field
* `permittedOrigins` (optional): If you have set up event listening and want to limit which URLs are able to deliver window messages to your app, you can provide a comma-separated list of them here

Once you have created your configuration object, you can use spread syntax to inject the values into your `SSIriusRouter` component.

```
import React from 'react';
import SSIriusRouter from '@kiva/ssirius-react;
import config from './config'; // where config contains an IConstants object

export default function MySSIApp(props: any) {
    return <div>
        <h1>Hello!</h1>
        <SSIriusRouter {...config} />
    </div>;
}
```

You may also want to use React state if you have any logic that could modify the configuration during run-time.

```
import React from 'react';
import SSIriusRouter, {IConstants} from '@kiva/ssirius-react;
import config from './config'; // where config contains an IConstants object

export default function MySSIApp(props: any) {
    const [conf, setConf] = useState<IConstants>(config);

    // some logic that might change some values in conf

    return <div>
        <h1>Hello!</h1>
        <SSIriusRouter {...config} />
    </div>;
}
```

#### Other Exports

As mentioned, `@kiva/ssirius-react` has many non-default exports that can help you build components and other utilities to help you build your SSI application.

##### `ComponentMap`

The `ComponentMap` interface is one of the most important parts of the `SSIriusRouter` configuration. Put simply, it is the tool that actually defines what React components are rendered.

A component map, in SSIrius, is an object with string keys and values that are `ComponentDefinition` objects, which have two required keys: `component` and `props`.

```
import Fish from './Fish';

const componentMap = {
    one: {
        component: Fish,
        props: {
            color: null,
            amount: 1
        }
    },
    two: {
        component: SecondStep,
        props: {
            color: null,
            amount: 2
        }
    },
    red: {
        component: SecondStep,
        props: {
            color: 'red',
            amount: 1
        }
    },
    blue: {
        component: SecondStep,
        props: {
            color: 'blue',
            amount: 1
        }
    }
};

export default componentMap;
```

The `component` key accepts both class components and functional components, and there is no limitation on what you add as a prop.

##### `ICommonProps`

While you can add any prop you want to the `props` object in your `ComponentMap`, there are built-in props that are added to every component rendered by the `SSIriusRouter`. These are (you guessed it!) referred to as Common Props and are defined by the `ICommonProps` interface.

* `CONSTANTS`: The `IConstants` configuration object
* `store`: This is a collection of methods to make it easy to persist values across the app. More on that later.
* `prevScreen`: This is a string that tracks the name of the screen that was rendered before the one currently being shown to the user.
* `authIndex`: If you support multiple transaction types in your application, this numeric value corresponds to the current transaction that the user is working through.
* `dispatch`: This is a void function to control navigation between different steps of the application flow.

##### `AuthOption`

Another crucial feature of the `SSIriusRouter` config is the `verification_options` array. The array defines transaction processes that you want to support in your application - adding an issuing UI for cricket tickets and a verification UI for validating parking passes would be two different objects.

If the length of the `verification_options` array is greater than 1, the `SSIriusRouter` will automatically render a menu to allow users to select which process they want to do, and the UI of this menu is defined by the values of the `AuthOption` objects in the `verification_options` array.

These are the keys for an `AuthOption`:

* `id`: An ID code associated with a transaction process. This value is never shown in the UI.
* `title`: A descriptive title for the transaction process (e.g. "Buy Tickets") which will be shown in a menu item.
* `description`: A longer description of what the transaction entails.
* `sequence`: An array of strings. Each element should be a key in the `ComponentMap`.
* `type`: Two options: `issue` or `verify`. The option you pick will change the CSS selector for a given menu item.

##### The Component Store

Rather than force anyone to import a global storage library like Redux, we have built a very lightweight namespace to handle data persistence across your transaction flow. There are [three methods that you can access via a Hook called `useComponentStore`](https://github.com/kiva/ssi-wizard-sdk/blob/main/react-core/src/hooks/useComponentStore.ts). This Hook is automatically called in the `SSIriusRouter` component and passed down via Common Props as the `store` value, so you shouldn't need to actually use the Hook yourself.

You will almost certainly be interested in taking advantage of the store methods, though. Each component rendered by the `SSIriusRouter` will be given its own store, and though a component can write to its own store and read from any other component's store, it cannot set values in another component's store.

The `get` method accepts up to three parameters and returns a value. The first parameter is required, because it is the key for the data that you are trying to retrieve. You can provide a default value to be used, if the key lookup fails, and you can also specify which component in the `ComponentMap` you want to search for that key.

```
// returns the value of 'myKey'
store.get('myKey')

// returns the value of 'myKey', if it exists, or the string 'dfault' if nothing is found
store.get('myKey', 'dfault')

// look up the value of 'myKey' in the store for 'someOtherComponent'
store.get('myKey', 'dfault', 'someOtherComponent')
```

The `set` method takes two required parameters: a key and a value.

```
// set a value
store.set('myKey', 'opens doors')

// this will anger the compiler, and is a downright lie, to boot
store.set('myKey', 'opens doors', 'inSomeOtherComponent')
```

The `reset` method is a void function with no parameters which clears the store completely. With great power comes great responsibility.

```
// take your ball and go home
store.reset()
```

##### Navigation

The `dispatch` Common Prop is a function designed to control navigation within the `SSIriusRouter`. Similar to an Action in Redux, it accepts a parameter called a `FlowAction` which includes a `type` key and optional `payload` key.

The values used in `type` can be retrieved from an exported enum called `FlowDispatchTypes`

* `FlowDispatchTypes.NEXT`: Navigates to the next screen
* `FlowDispatchTypes.BACK`: Navigates to the previous screen
* `FlowDispatchTypes.RESTART`: Returns you to the first step of the application flow.

```
import {FlowAction, FlowDispatchTypes, ICommonProps} from '@kiva/ssirius-react';

export default function MyAwesomeButtons(props: ICommonProps) {
    return <div>
        <button onClick={props.dispatch({
            type: FlowDispatchTypes.NEXT
        })}>
            NEXT
        </button>

        <button onClick={props.dispatch({
            type: FlowDispatchTypes.BACK
        })}>
            BACK
        </button>

        <button onClick={props.dispatch({
            type: FlowDispatchTypes.RESTART
        })}>
            START OVER
        </button>
    </div>;
}
```

##### QR Code Scanning

The Aries process for Issuing does not change drastically, no matter what data goes into a credential. Ditto for Verifying.

But your backend URL may change based on your credential type. Or you may have to transform data when you receive it. Or you may decide that you actually don't like the current mobile wallet you're using and want to change it!

This means the specifics of implementation will change, but the actual process can mostly stay the same. With this in mind, [we've built React components](https://github.com/kiva/ssi-wizard-sdk/blob/main/create-ssirius-standalone/template/src/preBuilt/AgencyQR/index.tsx) in our `create-ssirius-standalone` package that accept `IIssuer` and `IVerifier` props, which *you* will be the lucky person to code.

Don't worry, [there aren't too many methods that you need to define](https://github.com/kiva/ssi-wizard-sdk/blob/main/react-core/src/interfaces/IAgent.ts), but you can take a look at our [pre-built examples to get some inspiration](https://github.com/kiva/ssi-wizard-sdk/tree/main/create-ssirius-standalone/template/src/examples/agents).


##### Guardian Agencies

The concept of Self-Sovereign Identity means that you, and only you, will have the power to disclose your personal data. But for various reasons and through no fault of our own, we can sometimes find ourselves in situations where we don't have the capacity to exercise that power.

Enter the concept of Guardianship, [which you can read much more about at the Sovrin Foundation](https://sovrin.org/guardianship/), and which is something that we will support with the SSIrius project.

We have already built some React components to support Guardian agencies, and to support these components we have developed the `IGuardianSDK` and `IErrorHandler` interfaces.

The `IGuardianSDK` interface provides a template for creating a `GuardianSDK` class [like the one we built as a utility in `@kiva/ssirius-react`](https://github.com/kiva/ssi-wizard-sdk/blob/main/react-core/src/utils/GuardianSDK.ts), and as long as you implement this interface you will be able to insert your code as a prop in your `ComponentMap`.

The `IErrorHandler` interface enables support for customizing the handling of network errors in a `GuardianSDK` class. You can see [examples of this in the `create-ssirius-standalone` directory](https://github.com/kiva/ssi-wizard-sdk/tree/main/create-ssirius-standalone/template/src/examples/errorHandlers), and you can [see them in action, as well](https://github.com/kiva/ssi-wizard-sdk/blob/main/create-ssirius-standalone/template/src/componentMap.ts).
