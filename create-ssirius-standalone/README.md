# SSIriusStandalone

The `create-ssirius-standalone` package can help you quickly bootstrap an SSI application in React. It also allows install-time customization so that, once you figure out what you want your app to do, you can easily inject your desired behavior without maintaining the entire SSIrius template.

## QuickStart

To set up a SSIrius standalone React application, you can run:

```
npx create-ssirius-standalone <your project name> <path to installation directory>
```

This will give you our default implementation - all of our pre-built UI components, Kiva branding, and an assumption that you have [started running the Kiva Aries backend gateway locally on your machine after following the steps in our `protocol-demo` repo](https://github.com/kiva/protocol-integration-tests#setup) and will be using that as your backend Gateway.

So, assuming you wanted to create a project called `marauders-map` in the directory you are currently working in, you would run.

```
npx create-ssirius-standalone marauders-map .
```

Once there, you can run the application locally by running the following commands. By default, the port the application runs on is 7567. (Shoutout to Commander Rex.)

```
cd marauders-map
npm i
npm run start
```

For deployments to production, you can run `npm run build` to create an optimized application bundle.

## Configuration

The SSIrius app relies on a configuration file in order to run correctly. The good news is that we've supplied one of these in the `template` for this project, and it's very accommodating of your needs.

The bad news is that you'll understand it much more quickly if you [read our documentation about the `<SSIriusRouter>` component](https://github.com/kiva/ssi-wizard-sdk/tree/main/react-core).

That said, this is the list of configuration keys that you'll need to use.

* `verification_options`: This is an array of transactions that you want to support with your app. Each element of the array is an [AuthOption](https://github.com/kiva/ssi-wizard-sdk/blob/main/react-core/src/interfaces/AuthOptionInterfaces.ts) object, which we'll get into later.
* `credentialKeyMap`: This object defines the data that is going to be asked for when issuing, or provided when verifying.
* `direction`: By default, our UI is rendered with left-to-right text. If you want to use a language that is read right-to-left, switch this value to be `rtl`.
* `component_map`: This object creates a definition of what components are used in each part of a transaction's sequence. More on this later.
* `defaultLang`: You can use this to pass in the code of the language you'll be using: `en-US` for American English, `es-MX` for Mexican Spanish, etc. We hope it will be useful for your `i18n` implementation!
* `auth_token` (optional): If you want to have an authentication token available to all of your components, you can add it here
* `proof_profile_url` (optional): If you want to use an API to provide a list of credentials or proofs that you want to be able to support, put your URL into this field
* `permittedOrigins` (optional): If you have set up event listening and want to limit which URLs are able to deliver window messages to your app, you can provide a comma-separated list of them here

## Components in SSIrius

[As mentioned](https://github.com/kiva/ssi-wizard-sdk/tree/main/react-core), components in SSIrius are configured via a key called `component_map`. Rather than make you build your own components, we have pre-built several that you can use in your own applications.

You can [read about specific components in the `template` README](https://github.com/kiva/ssi-wizard-sdk/tree/main/create-ssirius-standalone/template/src/preBuilt), but by default each component has access to a few common properties (defined by the `ICommonProps` interface, [which you can read about in detail the `@kiva/ssirius-react` package documentation](https://github.com/kiva/ssi-wizard-sdk/tree/main/react-core)):

* `CONSTANTS`: The `IConstants` configuration object
* `store`: This is a collection of methods to make it easy to persist values across the app. More on that later.
* `prevScreen`: This is a string that tracks the name of the screen that was rendered before the one currently being shown to the user.
* `authIndex`: If you support multiple transaction types in your application, this numeric value corresponds to the current transaction that the user is working through.
* `dispatch`: This is a void function to control navigation between different steps of the application flow.

As discussed in the `component_map` documentation, you can also pass anything else you desire to an individual component using the `props` key in the component definition. For example, you could add an auth token to a specific component like this:

```
import ImportedComponent from './ImportedComponent';

...

{
    component_map: {
        myComponent: {
            component: ImportedComponent,
            props: {
                auth_token: <your auth token>
            }
        }
    }
}
```

### Special Props

There are two other interfaces we've created that extend `ICommonProps` to make it easy to implement your own logic for doing Verifiable Credential Transactions.

#### `AgentUIProps`

This interface is designed to support our pre-built QR code verification component. It has one additional prop, which can either be an `IIssuer` or `IVerifier` type of object. [We have created examples of these in the template directory](https://github.com/kiva/ssi-wizard-sdk/tree/main/create-ssirius-standalone/template/src/examples/agents), and have written a detailed breakdown of what they are, what they do, and why.

#### `GuardianUIProps`

This interface is designed to support requests to Guardianship agents (if you're unfamiliar with the idea of Guardianship, [the Sovrin Foundation has a good breakdown of the concept](https://sovrin.org/guardianship/)), which is required for authentication options such as fingerprint scanning or SMS one-time passwords.

It extends `ICommonProps` and adds a prop called `guardianSDK`, which accepts an `IGuardianSDK` type of object in order to handle the requests to whatever Gateway URL you are using for your Guardianship agency.

## i18n

The `create-ssirius-standalone` package supports internationalization via the `i18next-react` package. The template project instantiates a translation function from an imported `translation.json` file, which then gets passed to any child component of the `SSIriusRouter` via a React Provider.

Phew. Lots of technical terms. Let's talk about how it works.

#### Step 1: Decide what languages you want to support

You'll need to create a translation JSON file for each language you plan on being able to use in your app, and each one's name should be a valid locale code.

Want to have your app rendered in American English? Create a `en-US.json` file. Canadian French? Create a `fr-CA.json` file. There's no limit on the number of translation files you can create.

#### Step 2: Populate your `i18n` directory

By default, the `i18n` directory can be found in the `src/tools` directory of your project. Move each of the files you created in Step 1 into this folder.

#### Step 3: Configure your language

Currently, the SSIrius standalone app can only support one language at a time i.e. we haven't incorporated functionality for you to change which language you're using while the app is running. (It's something we want to do.)

However, it's easy to set and change which language you're using when you start the application. All you need to do is change the `defaultLang` key in your configuration.

```
// in constants.ts

const config_constants = {
    defaultLang: 'en',
    ...
}

// a wild product manager appears: "Can we actually have the app use Canadian English?"

const config_constants = {
    defaultLang: 'en-CA',
    ...
}
```

Please note: If you want to use `en-CA` as your language for the application, you'll need to include a `en-CA.json` file in your `i18n` directory.
