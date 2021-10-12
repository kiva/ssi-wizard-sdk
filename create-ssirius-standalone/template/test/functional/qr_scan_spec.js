let conf;
let common;

describe('QR Code Scan screen should...', function() {

    before(function() {
        cy.fixture("kiva_agent.json").then(config => {
            conf = config;
            common = config.common;
            cy.intercept(conf.fetchProofOptions.method, conf.fetchProofOptions.endpoint, {
                ...common,
                body: conf.fetchProofOptions.success
            });
        });
    });

    it('should show an error message when the connection attempt fails', function() {
        let testConf = conf.establishConnection,
            response = {
                statusCode: 418,
                ...common
            };
        cy.intercept(testConf.method, testConf.endpoint, response);
        cy.visit('/');
        cy.get('.accept').click();
        cy.wait(200);
        cy.contains('Continue').click();
        cy.get('#select-auth-method').click();
        cy.get('.dialog-icon.error').should('be.visible');
    });

    it('should clear the error message when clicking "Reset"', function() {
        let delayMs = 400,
            testConf = conf.establishConnection,
            response = {
                statusCode: 418,
                delayMs,
                ...common
            };
        cy.intercept(testConf.method, testConf.endpoint, response);
        cy.get('[data-cy="reset-flow"]').click();
        cy.get('#qr-loader').should('be.visible');
        cy.wait(delayMs + 100);
    });

    it('should go back to the Confirmation screen when "Back" is clicked', function() {
        cy.get('[data-cy="qr-back"]').click();
        cy.get('#Kiva_QR').should('not.exist');
    });

    it('should load a QR code when the request is successful', function() {
        let establishConf = conf.establishConnection,
            getConf = conf.getConnection,
            establishResponseBody = establishConf.success,
            connectResponseBody = getConf.inactive;

        cy.intercept(establishConf.method, establishConf.endpoint, {
            ...common,
            body: establishResponseBody
        });
        cy.intercept(getConf.method, getConf.endpoint, {
            ...common,
            body: connectResponseBody
        });
        cy.get('#select-auth-method').click();
        cy.get('#qr-code').should('be.visible');
    });

    it('should show an error message when there\'s an error in the status check', function() {
        let establishConf = conf.establishConnection,
            getConf = conf.getConnection,
            establishResponseBody = establishConf.success,
            connectResponseBody = getConf.inactive;

        cy.intercept(establishConf.method, establishConf.endpoint, {
            ...common,
            body: establishResponseBody
        });
        cy.intercept(getConf.method, getConf.endpoint, {
            ...common,
            statusCode: 418,
            body: connectResponseBody
        });

        cy.get('[data-cy="reset-flow"]').click();
        cy.get('.dialog-icon.error').should('be.visible');
    });

    it('should signal that the connection has been established', function() {
        let establishConf = conf.establishConnection,
            getConf = conf.getConnection,
            establishResponseBody = establishConf.success,
            connectResponseBody = getConf.active;

        cy.intercept(establishConf.method, establishConf.endpoint, {
            ...common,
            body: establishResponseBody
        });
        cy.intercept(getConf.method, getConf.endpoint, {
            ...common,
            body: connectResponseBody
        });

        cy.get('[data-cy="reset-flow"]').click();
        cy.get('.dialog-icon.verified').should('be.visible');
        cy.wait(500);
    });

    it('should begin verification when you click "Verify"', function() {
        let verifyConf = conf.sendVerification,
            checkConf = conf.checkVerification;

        cy.intercept(verifyConf.method, verifyConf.endpoint, {
            ...common,
            body: verifyConf.success
        });
        cy.intercept(checkConf.method, checkConf.endpoint, {
            ...common,
            statusCode: 418,
            delayMs: 200
        });
        cy.get('.next').click();
        cy.get('#qr-loader').should('be.visible');
        cy.wait(201);
    });

    it('should should show an error if there\'s an error sending the proof request', function() {
        cy.get('.dialog-icon.error').should('be.visible');
    });

    it('should show an error if the proof status check fails', function() {
        let verifyConf = conf.sendVerification,
            checkConf = conf.checkVerification;

        cy.intercept(verifyConf.method, verifyConf.endpoint, {
            ...common,
            body: verifyConf.success
        });
        cy.intercept(checkConf.method, checkConf.endpoint, {
            ...common,
            statusCode: 418
        });

        cy.get('[data-cy="qr-scan-next"]').click();
        cy.get('.dialog-icon.error').should('be.visible');
    });

    it('should show an error if the proof request is rejected', function() {
        let establishConf = conf.establishConnection,
            getConf = conf.getConnection,
            establishResponseBody = establishConf.success,
            connectResponseBody = getConf.active,
            verifyConf = conf.sendVerification,
            checkConf = conf.checkVerification;

        cy.intercept(establishConf.method, establishConf.endpoint, {
            ...common,
            body: establishResponseBody
        });
        cy.intercept(getConf.method, getConf.endpoint, {
            ...common,
            body: connectResponseBody
        });
        cy.intercept(verifyConf.method, verifyConf.endpoint, {
            ...common,
            body: verifyConf.success
        });
        cy.intercept(checkConf.method, checkConf.endpoint, {
            ...common,
            body: checkConf.rejected
        });

        cy.get('[data-cy="reset-flow"]').click();
        cy.wait(300);
        cy.get('[data-cy="qr-scan-next"]').click();
        cy.get('.dialog-icon.error').should('be.visible');
        cy.get('#instructions').should('contain', 'Verification Failed: This credential may have been revoked or it may not have been able to fulfill the proof request:');
    });

    it('should render user details if the proof is sucessful', function() {
        let establishConf = conf.establishConnection,
            getConf = conf.getConnection,
            establishResponseBody = establishConf.success,
            connectResponseBody = getConf.active,
            verifyConf = conf.sendVerification,
            checkConf = conf.checkVerification;

        cy.intercept(establishConf.method, establishConf.endpoint, {
            ...common,
            body: establishResponseBody
        });
        cy.intercept(getConf.method, getConf.endpoint, {
            ...common,
            body: connectResponseBody
        });
        cy.intercept(verifyConf.method, verifyConf.endpoint, {
            ...common,
            body: verifyConf.success
        });
        cy.intercept(checkConf.method, checkConf.endpoint, {
            ...common,
            body: checkConf.verified
        });

        cy.get('[data-cy="reset-flow"]').click();
        cy.wait(300);
        cy.get('[data-cy="qr-scan-next"]').click();
        cy.get('.ProfileCard').should('be.visible');
    });
});