describe('The Fuzzy Matching SearchMenu screen', () => {
    before(() => {
        cy.visit('/');
        cy.contains('Accept').click();
        cy.selectAuthMenuItem(3).click();
        cy.get('#select-auth-method').click();
        cy.get('#alternate-search').click();
    });

    it('should not display form fields for DOB or parents\' first names on initial load', () => {
        cy.get('[data-cy="mothersfirstname-input"]').should('not.be.visible');
        cy.get('[data-cy="fathersfirstname-input"]').should('not.be.visible');
        cy.get('[data-cy="birthdate-input"]').should('not.be.visible');
    });

    it('correctly expand rows when clicked', () => {
        cy.get('[data-cy="parents-names-row-header"]').click();
        cy.get('[data-cy="mothersfirstname-input"]').should('be.visible');
        cy.get('[data-cy="fathersfirstname-input"]').should('be.visible');
        cy.get('[data-cy="dob-row-header"]').click();
        cy.get('[data-cy="birthdate-input"]').should('be.visible');
    });

    it('closes the correct rows on click', () => {
        // Click on the Parents' Names header, verify the inputs disappear
        cy.get('[data-cy="parents-names-row-header"]').click();
        cy.get('[data-cy="mothersfirstname-input"]').should('not.be.visible');
        cy.get('[data-cy="fathersfirstname-input"]').should('not.be.visible');
        // Verify that DOB input is still visible
        cy.get('[data-cy="birthdate-input"]').should('be.visible');

        // Re-open the Parents' Names accordion, verify the elements are visible
        cy.get('[data-cy="parents-names-row-header"]').click();
        cy.get('[data-cy="mothersfirstname-input"]').should('be.visible');
        cy.get('[data-cy="fathersfirstname-input"]').should('be.visible');

        // Click on the DOB row header, verify the input disappears
        cy.get('[data-cy="dob-row-header"]').click();
        cy.get('[data-cy="birthdate-input"]').should('not.be.visible');
    });

    it('should not validate when invalid data is provided', () => {
        cy.get('[data-cy="firstname-input"]').type('FNTestName');
        cy.get('[data-cy="lastname-input"]').type('LNTestName');
        cy.get('#scan-fingerprint').click();
        cy.get('[data-cy="FingerprintScan"]').should('not.exist');
    });

    it('should validate data that includes father\'s name, but no mother\'s name and no birthday', () => {
        cy.fpScanIntercept();
        cy.get('[data-cy="fathersfirstname-input"]').type('FFNTestName');
        cy.get('#scan-fingerprint').click();
        cy.wait('@scannerData');
        cy.get('[data-cy="fpScan"]').should('be.visible');
    });

    it('should not have rows without data expanded when navigating back', () => {
        cy.get('[data-cy="fpscan-back"]').click();
        cy.get('[data-cy="birthdate-input"]').should('not.be.visible');
    });

    it('should validate data that includes mother\'s name, but no father\'s name and no birthday', () => {
        cy.fpScanIntercept();
        cy.get('[data-cy="fathersfirstname-input"] input').clear();
        cy.get('[data-cy="mothersfirstname-input"]').type('MFNTestName');
        cy.get('#scan-fingerprint').click();
        cy.wait('@scannerData');
        cy.get('[data-cy="fpScan"]').should('be.visible');
        cy.get('[data-cy="fpscan-back"]').click();
    });

    it('should accept inputs where first and last names are provided with birth date', () => {
        cy.fpScanIntercept();
        cy.get('[data-cy="dob-row-header"]').click();
        cy.get('[data-cy="birthdate-input"] input').type('2020-03-28');
        cy.get('[data-cy="mothersfirstname-input"] input').clear();
        cy.get('[data-cy="fathersfirstname-input"] input').clear();
        cy.get('#scan-fingerprint').click();
        cy.wait('@scannerData');
        cy.get('[data-cy="fpScan"]').should('be.visible');
    });

    it('should persist inputs when navigating back', () => {
        cy.get('[data-cy="fpscan-back"]').click();
        cy.document().then(doc => {
            expect(doc.querySelector('[name="inputBirthdate"]').value).to.eql('2020-03-28');
            expect(doc.querySelector('[name="inputLastname"]').value).to.eql('LNTestName');
            expect(doc.querySelector('[name="inputFirstname"]').value).to.eql('FNTestName');
        });
    });

    it('should navigate back to the main screen when "Back" is clicked', () => {
        cy.get('.back').click();
        cy.get('[data-cy="standard-search"]').should('be.visible');
    });
})