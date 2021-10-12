let kycData, initial;

describe('The User Details screen...', function() {
    before(function() {
        cy.window().then(win => {
            win.parent.addEventListener('message', (event) => {
                kycData = event.data.detail;
                kycData.stamp = Date.now();
            });
        });
        cy.fixture('kiva_agent.json').then(info => {
            let common = info.common,
                establish = info.establishConnection,
                connection = info.getConnection,
                send = info.sendVerification,
                verification = info.checkVerification,
                fetchProofs = info.fetchProofOptions;
            cy.intercept(fetchProofs.method, fetchProofs.endpoint, {
                ...common,
                body: fetchProofs.success
            });
            cy.intercept(establish.method, establish.endpoint, {
                ...common,
                body: establish.success
            });
            cy.intercept(connection.method, connection.endpoint, {
                ...common,
                body: connection.active
            });
            cy.intercept(send.method, send.endpoint, {
                ...common,
                body: send.success
            });
            cy.intercept(verification.method, verification.endpoint, {
                ...common,
                body: verification.verified
            });
            cy.visit('/');
            cy.get('.accept').click();
            cy.wait(200);
            cy.contains('Continue').click();
            cy.wait(200);
            cy.get('#select-auth-method').click();
            cy.wait(200);
            cy.get('[data-cy="qr-scan-next"]').click();
            cy.wait(500);
        });
    });

    it('should render all the data from the credential', function() {
        let credentialData = [
            {
                title: "First Name",
                data: "Calliope"
            },
            {
                title: "Last Name",
                data: "Gata"
            },
            {
                title: "Company Email",
                data: "cutest.kitty@kiva.org"
            },
            {
                title: "Hire Date",
                data: "2019-06-17",
                dataType: "date"
            },
            {
                title: "Current Title",
                data: "Kiva's Cutest Kitty"
            },
            {
                title: "Team",
                data: "Kiva Protocol"
            },
            {
                title: "Office Location",
                data: "San Francisco"
            },
            {
                title: "Employment Type",
                data: "Full Time"
            },
            {
                title: "End Date",
                data: "NEVER!",
                dataType: "date"
            },
            {
                title: "Phone",
                data: "867-5309"
            }
        ];
        cy.get('.ProfileItemContainer').should(el => {
            el.children('.FieldCard').each((idx, child) => {
                let title = child.querySelector('.FieldCardTitle').innerText,
                    data = child.querySelector('.FieldCardValue').innerText;
                if (credentialData[idx].dataType !== 'date') {
                    expect(credentialData[idx].data).to.eql(data);
                }
                expect(credentialData[idx].title).to.eql(title);
                
            });
        });
    });

    it('should have a photo', function() {
        cy.get('.PictureProfile').should(el => {
            expect(el.attr('src').indexOf('undefined')).to.eql(-1);
        });

        // getting stuff prepped for the next test, if we decide to re-enable this functionality
        // initial = kycData;
        // cy.get('.export-profile').click();
    });

    it.skip('should export the user data correctly', function() {
        // Make sure the data IS different
        expect(initial.stamp === kycData.stamp).to.eql(false);

        // Delete the stamps
        delete initial.stamp;
        delete kycData.stamp;

        // Verify everything else is as expected
        for (let k in kycData) {
            expect(initial.hasOwnProperty(k)).to.eql(true);
            expect(initial[k] === kycData[k]).to.eql(true);
        }
    });
});
