let authConfig;

describe('The Authentication Options Menu screen', () => {

    before(() => {
        // This doesn't do anything unless you've set the proof_profile_url config flag
        cy.fixture("kiva_agent.json").then(function (info) {
            let common = info.common,
                fetchProofs = info.fetchProofOptions;
            cy.intercept(fetchProofs.method, fetchProofs.endpoint, {
                ...common,
                body: fetchProofs.success
            });
        });
        cy.fixture('auth_options.json').then(function (config) {
            authConfig = config;
        });
        cy.visit('/');
        cy.contains('Accept').click();
    });

    it('has the correct number of menu items based on configuration', function () {
        cy.selectAuthMenuItem().should(menuItems => {
            expect(menuItems.length).to.eql(authConfig.length);
        });
    });

    it('has the first option selected by default', function () {
        cy.selectAuthMenuItem().eq(0).should('have.class', 'selected');
    });

    it('correctly displays which options are for verifying and which are for issuing', function () {
        cy.checkAuthOptions(authConfig, function (i) {
            cy.selectAuthMenuItem().eq(i).should('have.class', authConfig[i].type);
        });
    })

    it('displays menu items as selected after clicking them', () => {
        cy.checkAuthOptions(authConfig, function (i) {
            cy.selectAuthMenuItem().eq(i).click();
            cy.selectAuthMenuItem().eq(i).should('have.class', 'selected');
        });
    });

    it('displays the text from the configuration correctly', function () {
        cy.checkAuthOptions(authConfig, function (i) {
            cy.selectAuthMenuItem().eq(0).get('h2').should('contain', authConfig[i].title);
            cy.selectAuthMenuItem().eq(0).get('p').should('contain', authConfig[i].description);
        });
    });

    it('navigates correctly to and from the menu options', function () {
        cy.checkAuthOptions(authConfig, function (i) {
            let expectation = authConfig[i].expectation;
            cy.selectAuthMenuItem().eq(i).click();
            cy.get('#select-auth-method').click();
            cy.get(expectation.selector).should(expectation.expect);

            // Done? Let's go back to menu screen
            cy.get(expectation.backSelector).click();
        })
    });

    // it('successfully navigates to the SMS/OTP screen after clicking "Continue" when "SMS" is selected', () => {
    //     cy.selectAuthMenuItem().eq(1).click();
    //     cy.get('#select-auth-method').click();
    //     cy.get('form[name="ekycIdForm"]').should('exist');

    //     // Done? Let's go back to menu screen
    //     cy.get('#back').click();
    // });
});