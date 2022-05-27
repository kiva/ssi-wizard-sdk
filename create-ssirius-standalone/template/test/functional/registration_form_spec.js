const properties = {
    "firstName": true,
    "lastName": true,
    "companyEmail": true,
    "currentTitle": true,
    "team": true,
    "hireDate": true,
    "officeLocation": true,
    "phoneNumber": true,
    "type": true,
    "endDate": true
};

describe('The Registration Form screen', () => {
    before(() => {
        cy.visit('/');
        cy.get('.accept').click();
        cy.selectAuthMenuItem(2).click();
        cy.get('#select-auth-method').click();
        cy.wait(500);
        cy.get('#inner-circle').click();
        cy.get('[data-cy="image-select-continue"]').click();
    });

    it('has a form field for all credential properties', () => {
        for (let prop in properties) {
            if (properties[prop]) {
                cy.get('#' + prop).should('be.visible');
            }
        }
    });

    it('has a label for all the form fields', () => {
        for (let prop in properties) {
            if (properties[prop]) {
                cy.get(`label[for="${prop}"]`).should('be.visible');
            }
        }
    });

    it.skip('shows error messages on empty fields when "Continue" is clicked', () => {
        cy.get('.next').click();
        for (let prop in properties) {
            if ("phoneNumber" !== prop && "type" !== prop && properties[prop]) {
                cy.get(`#${prop}-helper-text`).should('be.visible')
                    .and('contain', 'this field is required')
                    .and('have.css', 'color', 'rgb(244, 67, 54)');
            }
        }
    });

    it('populates the form fields when "Populate Form" is clicked', () => {
        cy.get('[data-cy="populate-form"]').click();
        for (let prop in properties) {
            if (properties[prop]) {
                cy.get('#' + prop).should(input => {
                    expect(input.attr('value')).to.not.be.empty;
                });
            }
        }
    });

    it('navigates to the QR scan screen when the fields are populated and "Continue" is clicked', () => {
        cy.get('.next').click();
        cy.get('#QR_scan').should('be.visible');
    });

    it('persists the data entered when you clicked "Back" from the QR screen', () => {
        // TODO: Need to figure out what to do with the Back button
        cy.get('[data-cy="qr-back"]').click();
        for (let prop in properties) {
            if (properties[prop]) {
                cy.get('#' + prop).should(input => {
                    expect(input.attr('value')).to.not.be.empty;
                });
            }
        }
    });
});