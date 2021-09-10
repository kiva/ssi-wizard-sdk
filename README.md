# Welcome to SSIrius

There's a lot of exciting work being done in the Self-Sovereign Identity (SSI) space at the moment, and it's clear that human imagination and bandwidth are the only limitations to its potential applications.

Given that this is such a vibrant field, we felt the need to make a front-end UI that was scalable enough to accommodate lots of different use cases. An SSI wizard, if you will.

Enter SSIrius. (Get it?) The goal of this project is to make it easy to create a web UI to process any kind of SSI transaction. We welcome your input, your contributions, and your support.

## Before You Start

SSIrius is designed to be flexible enough to accommodate either an Aries agent running locally on your machine, or a cloud agent. If you already have one of these set up, you can skip this section, but if you don't and would still like to try out the platform, keep reading.

(Don't know what Aries is? Do you think Smith when you hear the word "Agent"? Don't worry, everyone starts where you are now! Head on over to [Hyperledger's ACA-Py repo to get a sense of how SSI works](https://github.com/hyperledger/aries-cloudagent-python/blob/main/demo/README.md) within the Aries ecosystem.)

An easy option for making the SDK work out of the box is to set up the Kiva Aries backend locally. You'll need to [install Docker](https://docs.docker.com/get-docker/), but otherwise you should [be able to follow the steps in our `protocol-demo` repo to get an agent running quickly](https://github.com/kiva/protocol-demo#working-with-protocol-using-aries).

## Trying It Out

To try out our SSIrius standalone package, check out [the Quickstart documentation in the `/standalone` directory](https://github.com/kiva/ssi-wizard-sdk/tree/main/standalone).

Happy coding!