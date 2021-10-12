describe('The Authentication Options Menu screen', () => {

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
        cy.contains('Continue').click();
    });

    it('has two menu options for authenticating', () => {
        cy.selectAuthMenuItem().should(menuItems => {
            expect(menuItems.length).to.eql(2);
        });
    });

    it('shows the first option as "Recommended"', () => {
        cy.selectAuthMenuItem().eq(0).should('have.class', 'recommended');
    });

    it('has the first option selected by default', () => {
        cy.selectAuthMenuItem().eq(0).should('have.class', 'selected');
    });

    it('changes the selection when the second menu item is clicked', () => {
        cy.selectAuthMenuItem().eq(1).click();
        cy.selectAuthMenuItem().eq(1).should('have.class', 'selected');
    });

    it('displays the text from the configuration file correctly', () => {
        // First item
        cy.selectAuthMenuItem().eq(0).get('h2').should('contain', 'Mobile Wallet');
        cy.selectAuthMenuItem().eq(0).get('p').should('contain', 'Customer will use their wallet to establish a connection and provide credentials for proofs.');

        // Second item
        cy.selectAuthMenuItem().eq(1).get('h2').should('contain', 'SMS');
        cy.selectAuthMenuItem().eq(1).get('p').should('contain', 'Customer will verify their identity using a one-time password delivered via text message.');
    });

    it('successfully navigates to the QR scan page after clicking "Continue" when "Mobile Wallet" is selected', () => {
        cy.selectAuthMenuItem().eq(0).click();
        cy.get('#select-auth-method').click();
        cy.get('#Kiva_QR').should('be.visible');

        // Done? Let's go back to menu screen
        cy.get('[data-cy="qr-back"]').click();
    });

    it('successfully navigates to the SMS/OTP screen after clicking "Continue" when "SMS" is selected', () => {
        cy.selectAuthMenuItem().eq(1).click();
        cy.get('#select-auth-method').click();
        cy.get('form[name="ekycIdForm"]').should('exist');

        // Done? Let's go back to menu screen
        cy.get('#back').click();
    });
});