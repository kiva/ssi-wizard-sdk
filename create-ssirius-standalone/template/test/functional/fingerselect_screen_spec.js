const fingerNames = [
    "right_thumb",
    "right_index",
    "right_middle",
    "right_ring",
    "right_little",
    "left_thumb",
    "left_index",
    "left_middle",
    "left_ring",
    "left_little",
];

describe('The FingerSelection screen', function () {
    before(function () {
        cy.fpScanIntercept();

        cy.visit('/');
        cy.wait(500);
        cy.contains('Accept').click();
        cy.selectAuthMenuItem(3).click();
        cy.get('#select-auth-method').click();
        cy.get('[data-cy="id-input"] input').type('T3STUS3R');
        cy.get('#scan-fingerprint').click();
        cy.get('[data-cy="select-new-finger"]', { timeout: 500 }).click();
    });

    beforeEach(function () {
        cy.fpScanIntercept();
    })

    it('should have a descriptive page title', function () {
        cy.get('h2').contains('Select a different digit').should('be.visible');
    });

    it('should render the selection menu', function () {
        cy.get('.FingerContainer', { timeout: 200 }).should('be.visible');
    });

    it('should successfully navigate back to the scan page with no changes', function () {
        cy.get('[data-cy="back"]').click();
        cy.get('[data-cy="fpScan"').should('be.visible');

        // It worked? Back to the select fingerprint screen
        cy.postActionMessage({
            action: "visitScanScreen"
        });
        cy.get('[data-cy="select-new-finger"]', { timeout: 500 }).click();

    });

    it('should show radio buttons for all 10 fingers', function () {
        cy.get('.FingerContainer label input[name="finger"]', { timeout: 200 }).should(fingers => {
            console.log(fingers);
            expect(fingers.length).to.eql(10);

            const missing = [];
            fingers.filter((index, finger) => {
                return fingerNames.indexOf(finger.getAttribute('value')) > -1 || missing.push(finger.getAttribute('alt'));
            });
            expect(missing.length).to.eql(0, 'Missing the radio buttons for the following fingers: ' + missing.join(','));
        });
    });

    it('should have the right thumb finger selected by default', function () {
        cy.get('label input[value="right_thumb"]', { timeout: 200 }).should('have.attr', 'checked');
    });

    it('should change finger selection when other radio buttons are clicked', function () {
        cy.document().then(doc => {
            for (let i = 0; i < fingerNames.length; i++) {
                let selector = 'input[value="' + fingerNames[i] + '"]';
                cy.get(selector).click().then(function () {
                    expect(doc.querySelector(selector).checked).to.be.true;
                });
            }
        });
    });

    it('should have the correct finger included in the button text', function () {
        cy.get('[data-cy="back"]').contains("Left Little finger").should('be.visible');
    });

    it('should change the selected finger on the Scan Fingerprint page', function () {
        cy.get('[data-cy="back"]').click();
        cy.get('h2 strong').contains('Left Little finger').should('be.visible');
    });
})