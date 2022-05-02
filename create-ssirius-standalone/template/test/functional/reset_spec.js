describe('The Reset button', function() {

    before(function () {
        cy.visit('/');
    });

    it('has the correct text', function() {
        cy.get('[data-cy="restart-ekyc"]').should('contain', 'Start New EKYC');
    });

    it('resets the flow and clears data when clicked', function() {
        cy.contains('Accept').click();
        cy.contains('Fingerprint Scan').click();
        cy.get('#select-auth-method').click();

        cy.get('#id-input').type('TESTUSER');

        cy.get('[data-cy="restart-ekyc"]').click();
        cy.contains('Accept').click();
        cy.contains('Fingerprint Scan').click();
        cy.get('#select-auth-method').click();

        cy.get('#id-input').should('not.have.value');
    });
});