let conf;
let common;

describe('QR Code Scan screen should...', function () {

    before(function () {
        cy.fixture("kiva_agent.json").then(config => {
            conf = config;
            common = config.common;
        });
    });

    it('should show an error message when the connection attempt fails', function () {
        let testConf = conf.establishConnection,
            response = {
                statusCode: 418,
                ...common
            };

        cy.intercept(testConf.method, testConf.endpoint, response);
        cy.beginIssuing();
        cy.get('.dialog-icon.error').should('be.visible');
    });

    it('should load a QR code when the request is successful', function () {
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
        cy.beginIssuing();
        cy.get('#qr-code').should('be.visible');
    });

    it('should show an error message when there\'s an error in the status check', function () {
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

        cy.beginIssuing();
        cy.get('.dialog-icon.error').should('be.visible');
    });

    it('should signal that the connection has been established', function () {
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

        cy.beginIssuing();
        cy.get('.dialog-icon.verified').should('be.visible');
    });

    it('should automatically begin the Credential Issuance process when the connection has been established', function () {
        let establishConf = conf.establishConnection,
            getConf = conf.getConnection,
            establishResponseBody = establishConf.success,
            connectResponseBody = getConf.active,
            offerConf = conf.offerCredential,
            offeredStatus = offerConf.offered,
            issuedConf = conf.issueCredential,
            issuedStatus = issuedConf.notIssued;

        cy.intercept(establishConf.method, establishConf.endpoint, {
            ...common,
            body: establishResponseBody
        });
        cy.intercept(getConf.method, getConf.endpoint, {
            ...common,
            body: connectResponseBody
        });
        cy.intercept(offerConf.method, offerConf.endpoint, {
            ...common,
            body: offeredStatus
        });
        cy.intercept(issuedConf.method, issuedConf.endpoint, {
            ...common,
            body: issuedStatus
        });

        cy.beginIssuing();
        cy.get('.qr-loading-title').should('contain', 'Citizen should see the National ID card in their mobile Wallet.');
        cy.get('#credential-offer-icon').should('be.visible');
    });

    it('surfaces a notice that the credential has been successfully issued', () => {
        let establishConf = conf.establishConnection,
            getConf = conf.getConnection,
            establishResponseBody = establishConf.success,
            connectResponseBody = getConf.active,
            offerConf = conf.offerCredential,
            offeredStatus = offerConf.offered,
            issuedConf = conf.issueCredential,
            issuedStatus = issuedConf.issued;

        cy.intercept(establishConf.method, establishConf.endpoint, {
            ...common,
            body: establishResponseBody
        });
        cy.intercept(getConf.method, getConf.endpoint, {
            ...common,
            body: connectResponseBody
        });
        cy.intercept(offerConf.method, offerConf.endpoint, {
            ...common,
            body: offeredStatus
        });
        cy.intercept(issuedConf.method, issuedConf.endpoint, {
            ...common,
            body: issuedStatus
        });

        cy.get('#credential-box').should('be.visible');
        cy.get('.credential-icon.verified').should('be.visible');
        cy.get('.qr-loading-title').should('contain', 'Citizen’s National ID has been issued.');
    });
});