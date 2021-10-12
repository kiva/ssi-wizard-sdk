describe("The Verification", () => {

    before(() => {
        cy.fixture("kiva_agent.json").then(info => {
            let common = info.common,
                fetchProofs = info.fetchProofOptions;
            cy.intercept(fetchProofs.method, fetchProofs.endpoint, {
                ...common,
                body: fetchProofs.success
            });
        });
        cy.visit('/');
        cy.contains('Accept').click();
        cy.wait(200);
    });

    // TODO: Decouple these tests from CSS selectors
    it('opens immediately when the application loads', () => {
        cy.get('.VerificationRequirement.screen').should('exist');
    });

    it('advances to the Authentication Options Menu when user Accepts', () => {
        cy.contains('Continue').click();
        cy.get('#auth_options').should('be.visible');
    });
});
