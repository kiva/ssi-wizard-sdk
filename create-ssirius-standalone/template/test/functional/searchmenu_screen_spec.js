describe('The SearchMenu screen', () => {
    before(() => {
        cy.visit('/');
        cy.contains('Accept').click();
        cy.selectAuthMenuItem(3).click();
        cy.get('#select-auth-method').click();
    });

    it('has an input field', () => {
        cy.get('[data-cy="id-input"] input', { timeout: 200 }).should('exist');
    });

    it('has NIN selected by default', () => {
        cy.get('#select-searchId', { timeout: 200 }).should('contain', 'NIN');
    })

    it('has the correct default text', () => {
        cy.get('form[name="ekycIdForm"] label', { timeout: 200 }).should(labelList => {
            expect(labelList.length).to.eql(1);

        }).and(label => {
            expect(label.text()).to.eql('Enter a valid ID');
        });
    });

    it('alerts when an invalid NIN is input', () => {
        const invalids = [
            123456,
            987654321,
            'a1234567',
            'NINSULAt',
            'B3AT1T'
        ];
        for (let i = 0; i < invalids.length; i++) {
            cy.get('[data-cy="id-input"] input').type(invalids[i] + '{enter}');
            cy.get('p').contains('National ID must be eight characters long (capital letters and numbers only)').should('be.visible');
            cy.get('[data-cy="id-input"] input').clear();
        }
    });

    it('switches to fuzzy-matching search UI when the Alternative Search link is clicked', () => {
        cy.get('[data-cy="id-input"] input').type('TestData');
        cy.get('#alternate-search').click();
        cy.get('[data-cy="alternate-search"').should('be.visible');

        // It worked? Go back...
        // TODO: Maybe don't tie this to a UI element on a page we're not testing within this spec
        cy.get('.back').click();
    });

    it('should have persisted the original input data', () => {
        cy.get('[data-cy="id-input"] input').should(inp => {
            expect(inp.val()).to.eql('TestData');
        });
    })

    it('opens the select menu on click', () => {
        cy.get('#select-searchId').click();
        cy.get('#menu-searchId').should('be.visible');
    });

    it('selects Voter ID when clicked', () => {
        cy.get('li[data-value="voterId"]').click();
        cy.get('#menu-searchId').should('not.exist');
        cy.get('#select-searchId').should('contain', 'Voter ID');
    });

    it('alerts when an invalid Voter ID is input', () => {
        cy.get('[data-cy="id-input"] input').clear();
        const invalids = [
            12345678,
            654321,
            'a123456'
        ];
        for (let i = 0; i < invalids.length; i++) {
            cy.get('[data-cy="id-input"] input').type(invalids[i] + '{enter}');
            cy.get('p').contains('Voter ID must be seven digits').should('be.visible');
            cy.get('[data-cy="id-input"] input').clear();
        }
    });

    it('submits on click', () => {
        cy.get('[data-cy="id-input"] input').type('1234567', { timeout: 500 });
        cy.get('#scan-fingerprint').click();
        cy.get('[data-cy="fp-image"]', { timeout: 500 }).should('be.visible');

        // It worked? Cool, let's go back and do more stuff
        cy.get('[data-cy="fpscan-back"]').click();
    });

    it('submits on enter', () => {
        cy.get('[data-cy="id-input"] input').type('{enter}', { timeout: 500 });
        cy.get('[data-cy="fp-image"]', { timeout: 500 }).should('be.visible');
    });
});