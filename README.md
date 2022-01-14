# Welcome to SSIrius

There's a lot of exciting work being done in the Self-Sovereign Identity (SSI) space at the moment, and it's clear that human imagination and bandwidth are the only limitations to its potential applications.

Given that this is such a vibrant field, we felt the need to make a front-end UI that was scalable enough to accommodate lots of different use cases. An SSI wizard, if you will.

Enter SSIrius. (Get it?) The goal of this project is to make it easy to create a web UI to process any kind of SSI transaction. We welcome your input, your contributions, and your support.

## Before You Start

The SSIrius project was designed to be flexible enough to accommodate either an Aries agent running locally on your machine, or a cloud agent. If you already have one of these set up, you can skip this section, but if you don't and would still like to try out the platform, keep reading.

(Don't know what Aries is? Do you think Smith when you hear the word "Agent"? Don't worry, everyone starts where you are now! Head on over to [Hyperledger's ACA-Py repo to get a sense of how SSI works](https://github.com/hyperledger/aries-cloudagent-python/blob/main/demo/README.md) within the Aries ecosystem.)

As a purely web-based project, SSIrius relies on a backend Gateway URL to handle all the heavy-duty SSI work. Rather than forcing you to deploy a Gateway on your own, though, you can [follow the steps in Kiva's `protocol-demo` repo to get started using your localhost as a backend](https://github.com/kiva/protocol-demo#working-with-protocol-using-aries). This is cool because it's easy and doesn't rely on an internet connection, but please note that some of our UIs do rely on external hardware, such as a smartphone or a fingerprint scanner.

## The Packages

At its core, the packages created in the SSIrius project are SDKs, designed to help you easily set up your first SSI transaction application. We have built a couple of packages to help you on your journey.

### `create-ssirius-standalone`

The easiest way to get set up with a fully-fledged SSI application is to use our `create-ssirius-standalone` package. This package will create a React project for you complete with all of the UI components that we have so far. (If you have ever used `create-react-app` or `docusaurus`, this will be a familiar concept to you).

You can, of course, also create your own components rather than use the ones we have built and use our configuration system to inject them into the application.

#### Quick Start

To set up a SSIrius standalone React application, you can run:

```
npx create-ssirius-standalone <your project name> <path to installation directory>
```

This will give you our default implementation - all of our pre-built UI components, Kiva branding, and an assumption that you have [started running the Kiva Aries backend gateway locally on your machine after following the steps in our `protocol-demo` repo](https://github.com/kiva/protocol-demo#working-with-protocol-using-aries) and will be using that as your backend Gateway.

So, assuming you wanted to create a project called `marauders-map` in the directory you are currently working in, you would run.

```
npx create-ssirius-standalone marauders-map .
```

#### Packs

While our default template is the quickest way for you to start playing around with your UI, it is unlikely to satisfy all your product needs because it uses Kiva colors, Kiva branding, English text, etc.

Once you've run our installation script, you can make any modifications you like to the project to customize it. You can also inject your custom code into the application at install time using the `--pack` option in the command line.

It would require at least another page of text to describe the concept and execution of "packs", so [we've gone ahead and created that page (those pages?) in the `create-ssirius-standalone` directory](https://github.com/kiva/ssi-wizard-sdk/tree/main/create-ssirius-standalone). Still, here's an example of how would work in practice for our `marauders-map` project:

```
npx create-ssirius-standalone marauders-map . --pack <path to directory of custom code>
```

### `@kiva/ssirius-react`

The `create-ssirius-standalone` template is powered in large part by utility functions, classes and interfaces that are installable in any React project using the `@kiva/ssirius-react` package.

The default export of `@kiva/ssirius-react` is the `<SSIriusRouter>` component - this React component accepts a configuration object as its props and can render a full SSI flow inline.

This configuration object has many moving parts, so we won't get into them all here. But here are some of the highlights.

* `IConstants`: An interface defining the mandatory and optional props you'll need to include in a `SSIriusRouter` to make it work
* `ComponentMap`: An object containing the React components you'll be using in the flow of your application
* `ComponentStore`: A series of functions making it easy to persist data while navigating between different steps
* `ICommonProps`: A definition of the props we recommend you use when creating new components

Be sure to check out a full description [of what's available in the `react-core` directory](https://github.com/kiva/ssi-wizard-sdk/tree/main/react-core).
