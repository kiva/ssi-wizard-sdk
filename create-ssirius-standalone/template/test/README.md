# How to Cypress

## Installation

Cypress is bundled as a dev dependency, so if you have not already, please go to the repo root and run

```
npm install
```

## Writing Tests

Cypress has its own syntax for running tests, but broadly follows the same structure as [MochaJS](https://mochajs.org/#getting-started) and can leverage the same assertion types as [ChaiJS](https://www.chaijs.com/api/bdd/).

The basis of most Cypress tests is the `cy.get()` command, which will retrieve an HTML element for further processing.

A few other important commands are:

* `cy.contains()`: This command accepts a string parameter as an argument, and will return the HTML element that contains that string
* `cy...should()`: This command is the basis for most Cypress assertions. It will usually accept one or two string parameters as arguments; the first is a Chai-style BDD assertion, and the second is an expected value of the assertion.
* `cy...then(el => {...})`: Many Cypress commands can use `then` in order to process the element captured by `cy.get()` or other commands designed to return an HTML element. The `el` value of the function is treated like a jQuery object.
* `cy.server()/cy.route()`: These commands help mock the data returned by an API call. Calling `cy.server()` will start up a mock-server, and `cy.route()` can be used to specify an API path for which to mock data. The first parameter of `cy.route()` is a API URI pattern, while the second is the expected data. Servers should be disabled using `cy.server({enable: false})` once they've fulfilled their purpose, but any running server will be automatically torn down at the beginning of a new test. 

NB: The `cy` object does not return elements synchronously! Instead, it enqueues commands to be dispatched by the Cypress runner. The following code:

```
const myElement = cy.get('#myElement');
myElement.should(...)
```

will not work the way you think it will. You should rely on chaining commands off of the standard Cypress getters.

You can visit the Cypress website for [more information about Cypress generally](https://docs.cypress.io/guides/core-concepts/introduction-to-cypress.html) or the [Cypress API specifically](https://docs.cypress.io/api/api/table-of-contents.html).

## Testing While Developing

You can use Cypress to run test files (in Cypress lingo, they're called `spec` files) while you're doing dev work. In order to do so, please launch the app and then run

```
npm run cy:open
```

This will launch the Cypress application which will list out all the spec files found in the default test directory (in this case, `test/integration`).

You can run a single spec by clicking on it. Cypress will launch an automated browser and immediately begin running the tests in that file. Every time you make changes to the spec file, the tests will re-run.

You can also run all the spec files within the test folder by clicking "Run all specs" in the upper right-hand corner.

## Testing Headlessly

If you'd prefer to run tests without launching an automated browser, you can run

```
npm run cy:run
```

This will run all Cypress tests in headless mode and will print out the test report within your terminal. In order to run a single test file on its own, please update the `cy:run` package script with `--spec <FILE_NAME>`.

Headless testing [allows for taking screenshots](https://docs.cypress.io/api/commands/screenshot.html#Syntax) using `cy.screenshot()`, which can be helpful for debugging.

## Screenshot Testing

You also have the option to run screenshot tests. In order to do so, you'll need to install [BackstopJS](https://github.com/garris/BackstopJS) (we recommend you do this globally by running `npm i -g backstopjs`) and then running up to three, but at least two, commands.

Once you have the app running locally, run the first command to capture the reference screenshots that will be used as the Source of Truth for how the application should look.

```
backstop reference
```

Once you've finished writing your code, run the second one, which will verify the new version of the app against the screenshots taken in the previous command.

```
backstop test
```

This command should automatically open a visual diff report in your browser. If you have unexpected failures, fix your code and then run `backstop test` again until you have the app looking the way you want it to.

If all the tests pass, or if the differences you see in the report are expected, go ahead and run the third command.

```
backstop approve
```

This will replace the original reference screenshots with the most recent version of the app, but more importantly, you're done! Well done, you cleverclocks, you.