const infoFields = [
    'First Name',
    'Last Name',
    'Company Email',
    'Phone',
    'Current Title',
    'Team',
    'Office Location',
    'Employment Type',
    'Photo',
    'Hire Date',
    'End Date'
];

describe("The Confirmation Screen", () => {

    before(() => {
        cy.visit('/');
        cy.wait(1000);
    });

    // TODO: Decouple these tests from CSS selectors
    it('opens immediately when the application loads', () => {
        cy.get('.Confirmation.screen').should('exist');
    });

    it('displays all the required PII fields', () => {
        cy.get('.Confirmation.screen li', { timeout: 200 })
            .should((listItems) => {
                listItems.each(index => {
                    let field = listItems.eq(index).text();
                    expect(infoFields.indexOf(field), 'Verifying ' + field).to.not.be.eq(-1);
                });
            });
    });

    it('doesn\'t have unexpected PII fields', () => {
        cy.get('.Confirmation.screen li', { timeout: 200 }).should(list => {
            /* eslint no-unused-expressions: 0 */
            expect(list.length === infoFields.length, 'Verifying there are no unexpected fields').to.be.true;
        });
    });

    it('advances to the Verification Requirements Screen when user Accepts', () => {
        cy.contains('Accept').click();
        cy.get('#auth_option_menu').should('be.visible');
    });
});
