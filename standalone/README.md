## Quick Start

Want to play with SSIrius? Here's how.

First things first - install everything.

```
npm i
```

If this is your first time using SSIrius on your own, you'll need to set up your configuration and translation files. Don't worry - we've written a command to make it easy to do!

```
npm run initConfigs
```

To launch a local version of the SSIrius application and browse the available features, you can use our pre-configured `start` command. (We'll explain what's happening here later on.)

```
npm run start
```

To build a production version of the package, use:

```
npm run build
```

### Using SSIrius in Your Own NPM Project

If you want to use SSIrius to create your own SSI implementation, you can absolutely do that, too.

Assuming you have already created your NPM project (though if you haven't, [npmjs.org has excellent documentation](https://docs.npmjs.com/cli/v7/commands/npm-init) about how to do it), you can install the NPM package as a dependency (or dev dependency!).

```
npm i @kiva/ssirius-standalone
```

The SSIrius package contains a CLI command which will handle the `start` and `build` behavior explained in the previous section, and you, intrepid reader, will be in charge of implementing it!

In the `scripts` object of your `package.json` file, you can add commands that look something like this.

```
{
    "scripts": {
        "runDev": "ssirius start --config=<CONFIG FILE PATH> --translations=<TRANSLATIONS JSON PATH>",
        "buildApp": "ssirius build --config=<CONFIG FILE PATH> --translations=<TRANSLATIONS JSON PATH>"
    }
}
```

The first command will run your application locally so that you can play around with (and test) it before a production push. The second command will create an optimized application bundle.

You'll notice that there are two flags that you need to set in either case - one is a configuration file, and the other is a translation file.

This is the whole idea behind SSIrius - by creating a new configuration file, you can create a new Issuance or Verification flow without having to write any new code, and you can change the language to suit your requirements simply by updating a JSON file.

But how do you do it? Glad you asked...

## Configuring the App

As mentioned, the `ssirius` command comes from the `@kiva/ssirius-standalone` package. In order to run, you need to feed it three arguments: 1) the script you want to run (your options are `start` and `build` at the moment) 2) a configuration file and 3) a file of translations.

You're probably thinking at this point: "Huh. These files seem like they might be important." Reader, they are. Let's tackle the `config` file, first.

### config.ts

SSIrius uses configuration files in order to create a front-end application, and based on the options that you provide, you can customize which SSI transactions you'd like to support.

When you run the `ssirius` script, whichever file you designate as your `--config` option will be copied into the codebase and renamed `config.ts`. We support JSON config files, as well.

But what options do you have available in the config file? Let's list them out.

`@kiva/ssirius-standalone` is still in development, so keep in mind that these configurations options may change in the future. If you see something here that doesn't look it's [in sync with the `IConstants` interface](https://github.com/kiva/ssi-wizard-sdk/blob/main/standalone/src/interfaces/IConstants.ts), feel free to raise a PR to fix it. Bonus points if it's your first issue!

#### verification_options

This (badly-named, we know) configuration specifies the menu of choices for transactions that you'll be providing for the parties involved.

What does that mean? This is the configuration that will allow you to set up an issuing service for a credential, or a verification of that credential, and give you a few different ways to do it.

The structure of this object can be [seen in the `AuthOptionInterfaces` file](https://github.com/kiva/ssi-wizard-sdk/blob/main/standalone/src/interfaces/AuthOptionInterfaces.ts#L3), but here's an example to get you started.

```
verification_options: [
    {
        id: 'Issue',
        title: 'Kiva Credential',
        type: 'issue',
        description: "Issue Verifiable Credential to your customer's mobile wallet",
        sequence: ['webcam', 'registrationForm', 'issue']
    }
]
```

Let's explain what's going on:

* `id`: This is unique identifier for a particular SSI flow. Not used for anything at the moment.
* `title`: If you're giving your user an option to pick which authentication method they'd like to use, this value will be used as the title text for a card in a menu.
* `type`: You can put either `issue` or `verify` in this slot - depending on what value you input, the design of the menu cards will be different.
* `description`: This is an optional description for the SSI flow, if you need to give your user some extra info.
* `sequence`: An array that will determine which screens the user will be shown as part of the SSI flow, and what order to put them in. Be aware that the values in this array need to correspond to a key in the `component_map`, otherwise the app will throw an error that we have chosen not to handle at the moment, because it's indicative of a more fundamental problem.

But this leads nicely into a discussion of...

#### component_map

The `component_map` configuration value actually defines which React components will slot into which steps in the `sequence` configuration above. For example, if we were going to create a `component_map` to support the `sequence` above:

```
component_map: {
    registrationForm: {
        component: 'RegistrationForm',
        props: {
            phoneIntls: {
                only: false,
                countries: ['us']
            }
        }
    },
    issue: {
        component: 'CredentialIssuance',
        props: {
            dependencies: {
                registrationForm: ['registrationFormData'],
                webcam: ['photo~attach']
            }
        }
    },
    webcam: {
        component: 'WebcamCaptureTool',
        props: {}
    }
}
```

As you can see, each key of the `component_map` object is part of the `sequence` array in the previous example. An excellent first step. What's all the other stuff? (Here's the [relevant code](https://github.com/kiva/ssi-wizard-sdk/blob/main/standalone/src/interfaces/FlowRouterInterfaces.ts).)

* `component`: This is a string value that corresponds to one of the pre-coded React components that is currently a part of this repo. It's a required field.
* `props`: These are additional React component props that can be passed into the code. Your imagination is your limit for this object, and as you can see in the `webcam` configuration, it's not necessary to put any props in.
    * **For more context on useful props for component definitions, [check out the Docs in the `/screens` directory](https://github.com/kiva/ssi-wizard-sdk/tree/main/standalone/src/screens)**

#### credentialKeyMap

One of the requirements for SSIrius is to collect the consent of your user to share information, and the `credentialKeyMap` is the configuration responsible for disclosing that information.

(This assumes that you will only be processing an SSI transaction for one type of credential - we support a more flexible system, but you'll have to wait until we get to `proof_profile_url` for that).

Each credential key has a configuration object with the following information. (Here's the [relevant code](https://github.com/kiva/ssi-wizard-sdk/blob/main/standalone/src/interfaces/ConfirmationInterfaces.ts).)

* `name`: A human-readable name for the data being requested
* `rendered`: An optional boolean that controls whether the credential data for that key will be displayed in the UI when the transaction is completed.
* `dataType`: A string that can be `text`, `date`, `phoneNumber` or `image/jpeg;base64`. This will control how data is rendered on screen.

#### defaultLang

This will be the `l10n` code to set which translation data you'd like to use in your app. Eventually we would like to support language switching within the application, but this is the first step in that process.

#### direction

By default, this value will be `ltr`. If your deployment will be using a language that's read from right-to-left, you can change this value to be `rtl`.

#### proof_profile_url

Kiva has created a backend endpoint that will provide data about all the proof profiles available for verifications. If you have an endpoint like this, you can add the URL into this field and a dropdown menu will automatically be rendered to support the selection of different proof profiles.

#### auth_token

If any backend requests require a Bearer Token, you can add it to this field and it will be automatically applied throughout the app.

#### standaloneConf

If you want to add a SSIrius app into your website within an `iframe`, you can go ahead and ignore this field.

However, if you want the app to serve as its own webpage, the `standaloneConf` key will allow you to add a header and footer to the UI. This config is still very much in development, so expect things to change significantly. Or you could change it significantly itself - your PRs are appreciated!

## Writing Your Own Component

Knowing you as we do, we expect that you may have an idea for a new UI component that absolutely rocks. And we welcome these contributions! There are a few peculiarities about components in SSIrius, though, that you should be aware of before you get coding.

### ICommonProps

Every React component rendered by SSIrius is given a few props by default. You can see [the definition of those props here](https://github.com/kiva/ssi-wizard-sdk/blob/main/standalone/src/interfaces/ICommonProps.ts), but the important thing is that any component you create should use `props` that extend the `ICommonProps` interface. We're sorry that we're giving you more things to remember, but trust us, you get lots of goodies by using this interface for your component `props`.

Among them...

### Navigation

Another conceit of SSIrius is that, in any SSI transaction, the order of operations matters. If you're creating a credential, you need to collect the information required for that credential before you can offer it to your user. You shouldn't even be collecting that information before the user has consented to share it. The list of hypotheticals goes on.

As such, SSIrius has implemented a navigation system that allows users to advance along their chosen path, or go back. But skipping steps of the process is not allowed.

Fortunately, this navigation is not hard to work with. Every component in SSIrius comes equipped with a method in the `props` called `dispatch`. Using this method, it's easy to go forward or backward. We have provided [an `enum` that has a definition for "forward" and "backwards"](https://github.com/kiva/ssi-wizard-sdk/blob/main/standalone/src/enums/FlowDispatchTypes.ts), and to use it within your own component you can simply import the enum, and then call `dispatch` like so:

```
props.dispatch({type: FlowDispatchTypes.NEXT})

OR

props.dispatch({type: FlowDispatchTypes.BACK})
```

### Component Store

The problem of persisting user inputs when they're navigating through your app has been always been an annoying part of front-end development, and it can be even more complicated with a top-down architecture like what React uses.

To make it simpler, we've created [a few methods that can store and retrieve information dynamically](https://github.com/kiva/ssi-wizard-sdk/blob/main/standalone/src/hooks/useComponentStore.ts), without having the create a top-level component every time. These are available in a `prop` called `store` in any component rendered by SSIrius. Here are the options.

#### set

The `props.store.set` method can store data globally for easy retrieval afterwards. The method accepts two parameters: a key in which to store your data, and the value.

```
props.store.set('foo', 'bar');
```

You can call this as many times as you'd like within your component, though it's worth noting that doing a `set` on the same data key twice will overwrite the value. That said, `set` can only store data that corresponds to the current component that is rendered on the page, so don't worry about collisions with other components.

#### get

Calling `props.store.get` allows you to retrieve data that was `set` previously, no matter which component was responsible for setting it.

The method takes up to three arguments, two of which are optional.

1. The data key you'd like to get the value from
2. A default value, if the key is not found or the data is nullish
3. Whatever step in the `sequence` the data was set in - so, for example, if you wanted to get data that was set during the `webcam ` step, you would simply add `'webcam'` as your third argument. This value defaults to the current step you're on, so if you're looking for data that's been `set` in the same component where you're calling `get`, you can omit this argument.

```
props.store.get('foo', 'default value', 'someOtherComponent');
```

#### reset

The `reset` method will clear all the data in the global store and return you to the first page of the app. This effectively ends whatever transaction is currently in progress, so use this power wisely.

## Translations

SSIrius uses the [i18next](https://www.i18next.com/) library in order to power its internationalization. In order to use a specific language, you should set the `defaultLang` value in your configuration to the desired country code e.g. `en-US` and then create a corresponding key in the translations JSON file you create.

You should follow this schema when creating your own translations.

```
{
    <A COUNTRY CODE>: {
        translations: {
            ...
        }
    },
    <ANOTHER COUNTRY CODE>: {
        translations: {
            ...
        }
    }
}
```

Kiva has created both Spanish and English translations because there is native fluency in both languages within Kiva Protocol. We welcome any additional help!

## Agents

If you want to use QR codes to issue or verify your credentials, we have handy UI components to handle that transaction for you. Unfortunately, SSIrius won't know in advance what network calls you'll need to make in order to process the transaction, and it definitely won't know what to make of the responses to those network calls.

Fortunately, we have written a classed called `BaseAgent` which is designed with these specific problems in mind. The actual steps that you need to follow to issue or verify a credential don't change that much, no matter what network you're using, and `BaseAgent` has abstracted those steps.

1. Invite another party to connect
2. Wait until that party accepts your invitation
3. Offer a credential, or send a verification request
4. Wait to see if the credential was accepted/issued, or whether the proof request was satisfied

For a more in-depth look at how we've abstracted this - and to see how you can create your OWN Agent - take a look [in the `agents` directory](https://github.com/kiva/ssi-wizard-sdk/tree/main/standalone/src/agents).

