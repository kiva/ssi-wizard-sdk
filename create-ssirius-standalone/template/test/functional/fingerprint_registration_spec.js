describe('The FingerprintRegistration screen', function() {
    const fingers = [
        'Right Thumb',
        'Right Index finger',
        'Right Middle finger',
        'Right Ring finger',
        'Right Little finger',
        'Left Thumb',
        'Left Index finger',
        'Left Middle finger',
        'Left Ring finger',
        'Left Little finger'
    ];
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

    before(function() {
        cy.fpScanIntercept();

        cy.visit('/');
        cy.wait(500);
        cy.contains('Accept').click();
        cy.selectAuthMenuItem(4).click();
        cy.get('#select-auth-method').click();
        cy.get('#email-input').type('cutest.kitty@kiva.org');
        cy.get('#continue').click();
    });

    beforeEach(function () {
        cy.fpScanIntercept();
    });

    it('has exactly 10 boxes for fingerprint images', function() {
        cy.get('#fp-images-container > div').should(div => {
            expect(div.length).to.eql(10);
        });
    });

    it('has all of the required text labels showing which box is for which finger', function() {
        for (let i = 0; i < fingers.length; i++) {
            cy.get('#fp-images-container > div p').eq(i).should('contain', fingers[i]);
        }
    });

    it('has a disabled "Next" button by default', function() {
        cy.get('button[type="submit"]').should('have.attr', 'disabled');
    });

    it('navigates back to the email input screen when clicking "Back"', function() {
        cy.get('button.secondary').click();
        cy.get('[data-cy="email-input"]').should('be.visible');
    });

    it('persists the email address entered on the email input screen', function() {
        cy.get('input[name="inputId"]').should('have.attr', 'value', 'cutest.kitty@kiva.org');

        // it worked? Cool. Let's test the thing we came to test.
        cy.get('#continue').click();
    });

    it('adds a fingerprint image to each box on click', function() {
        cy.fixture('fingerprint.png', 'base64').then(function (b64) {
            this.b64 = b64;
        });
        cy.get('.fingerprint-container').each(($el, index) => {
            cy.wrap($el).click().should('have.attr', 'class', 'fingerprint-container success').and($container => {
                expect($container.children('img').attr('alt')).to.eql(fingerNames[index]);
                expect($container.children('img').attr('src')).to.eql(`data:image;base64,${this.b64}`)
            });
        });
    });

    it('enables the "Next" button when there are FP images captured', function() {
        cy.get('button[type="submit"]').should('not.have.attr', 'disabled');
    })

    it('removes the fingerprint image when clicking the red "X"', function() {
        cy.get('.fingerprint-container').each(($el) => {
            cy.wrap($el).children('.clear-fp').click();
            cy.wrap($el).should('have.attr', 'class', 'fingerprint-container');
            cy.wrap($el).children().should('have.length', 0);
        });
    });

    it('surfaces a toast notification for when registration fails', function() {
        cy.intercept('POST', '/v2/kiva/api/guardian/enroll', {
            statusCode: 418
        });
        cy.get('#finger-id-1').click();
        cy.get('button[type="submit"]').click();
        cy.contains('There was an error while trying to register your fingerprints: Request failed with status code 418').should('be.visible');
    });

    it('dismisses the toast notification after 7 seconds', function() {
        cy.wait(7000);
        cy.contains('There was an error while trying to register your fingerprints: Request failed with status code 418').should('not.be.visible');
    });

    it.skip('succeeds?', function() {
        cy.intercept('POST', '/v2/kiva/api/guardian/enroll', {
            statusCode: 200
        });
        cy.get('button[type="submit"]').click();
    });
});
