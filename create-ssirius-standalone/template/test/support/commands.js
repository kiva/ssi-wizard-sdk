// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

// TODO: Do we need this?
Cypress.Commands.add("postActionMessage", (stateObject, waitPeriod) => {
    cy.window().then(win => {
        win.postMessage(stateObject, Cypress.env('MESSAGE_TARGET_ORIGIN'));
        // TODO: Tie the waiting period to the response from the FP scanner
        if (waitPeriod) {
            cy.wait(waitPeriod);
        }
    });
});

Cypress.Commands.add("selectAuthMenuItem", (index) => {
    cy.get('#auth_options .auth_option').eq(index);
});

Cypress.Commands.add("otpInput", (inputCode) => {
    let i = 0;
    for (i; i < 6; i++) {
        let selector = `[name="otp-digit-${i}"]`;

        cy.get(selector).clear().type(inputCode[i]);
    }
});

Cypress.Commands.add("checkAuthOptions", (authConfig, callback) => {
    for (let i = 0; i < authConfig.length; i++) {
        callback(i);
    }
})

Cypress.Commands.add("beginIssuing", () => {
    cy.visit('/');
    cy.get('.accept').click();
    cy.selectAuthMenuItem(2).click();
    cy.get('#select-auth-method').click();
    cy.wait(500);
    cy.get('#inner-circle').click();
    cy.get('[data-cy="image-select-continue"]').click();
    cy.get('[data-cy="populate-form"]').click();
    cy.get('.next').click();
});

Cypress.Commands.add('fpScanIntercept', function (delay) {
    cy.fixture('fingerprint.png', 'base64').then(function (fingerprint) {
        this.fingerprint = fingerprint;
        cy.intercept('GET', 'http://localhost:9907/EKYC/**', {
            body: {
                FingerprintSensorSerialNumber: "Kiva-Device-Simulator",
                TellerComputerUsername: "MAC",
                ImageBase64: this.fingerprint,
                success: true
            },
            delay
        }).as('scannerData');
    });
})
