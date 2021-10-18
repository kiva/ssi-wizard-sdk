import getFlow from '../src/helpers/getFlow';
import createConstants from './helpers/createConstants';

describe('The Flow creation logic', () => {

    describe('handles the Menu configuration correctly', () => {

        it('does not include the menu step when there\'s only one verification option', () => {
            const constants = createConstants([{type: 'issue', sequence: ['noImporta']}]);
            const flow = getFlow(0, constants);
            expect(flow).toEqual({
                confirmation: {
                    NEXT: 'noImporta'
                },
                noImporta: {
                    BACK: 'confirmation'
                }
            });
        });

        it('includes the menu step when there\'s more than one verification option', () => {
            const constants = createConstants([{type: 'issue', sequence: ['noImporta']}, {type: 'issue', sequence: ['serieux']}]);
            const flow = getFlow(0, constants);

            expect(flow).toEqual({
                confirmation: {
                    NEXT: 'menu'
                },
                menu: {
                    BACK: 'confirmation',
                    NEXT: 'noImporta'
                },
                noImporta: {
                    BACK: 'menu'
                }
            });
        });
    });

    describe('renders distinct flows when the index changes', () => {
        const opts = createConstants([{
            type: 'issue',
            sequence: ['noImporta']
        }, {
            type: 'issue',
            sequence: ['serieux']
        }, {
            type: 'issue',
            sequence: ['butActually']
        }]);
        const flow_1 = getFlow(0, opts);
        const flow_2 = getFlow(1, opts);
        const flow_3 = getFlow(2, opts);

        it('correctly renders three different flows based on three different inputs', () => {
            expect(flow_1).not.toEqual(flow_2);
            expect(flow_1).not.toEqual(flow_3);
            expect(flow_2).not.toEqual(flow_3);
        });

        it('renders the correct flow for Option 1 - Type: Issue, Sequence: ["noImporta"]', () => {
            expect(flow_1).toEqual({
                confirmation: {
                    NEXT: 'menu'
                },
                menu: {
                    BACK: 'confirmation',
                    NEXT: 'noImporta'
                },
                noImporta: {
                    BACK: 'menu'
                }
            });
        });

        it('renders the correct flow for Option 2 - Type: Issue, Sequence: ["serieux"]', () => {
            expect(flow_2).toEqual({
                confirmation: {
                    NEXT: 'menu'
                },
                menu: {
                    BACK: 'confirmation',
                    NEXT: 'serieux'
                },
                serieux: {
                    BACK: 'menu'
                }
            });
        });

        it('renders the correct flow for Option 3 - Type: Issue, Sequence: ["butActually"]', () => {
            expect(flow_3).toEqual({
                confirmation: {
                    NEXT: 'menu'
                },
                menu: {
                    BACK: 'confirmation',
                    NEXT: 'butActually'
                },
                butActually: {
                    BACK: 'menu'
                }
            });
        });
    });

    describe('handles "Issue" and "Verify" types differently', () => {
        const verifyConf = {type: 'verify', sequence: ['valyria']};

        it('adds the "details" step to the end of the flow when the type is "verify"', () => {
            expect(getFlow(0, createConstants([verifyConf]))).toEqual({
                confirmation: {
                    NEXT: 'valyria'
                },
                valyria: {
                    BACK: 'confirmation',
                    NEXT: 'details'
                },
                details: {
                    BACK: 'valyria'
                }
            });
        });

        it('does not add the "details" step if the type is "issue"', () => {
            verifyConf.type = 'issue';
            expect(getFlow(0, createConstants([verifyConf]))).toEqual({
                confirmation: {
                    NEXT: 'valyria'
                },
                valyria: {
                    BACK: 'confirmation'
                }
            });
        });
    });

    describe('correctly sets the flow steps based on the Sequence array', () => {
        it('throws an error if the sequence array has no elements', () => {
            const errorConfig = createConstants([{type: 'verify', sequence:[]}]);
            function flowError() {
                getFlow(0, errorConfig);
            }

            expect(flowError).toThrow(new Error('The sequence array for Mock Option must contain at least one element, and it contains zero elements right now.'))
        });

        it('handles a sequence of length 1 for both issue and verify', () => {
            const conf = createConstants([
                {
                    type: 'verify',
                    sequence: ['trantor']
                },
                {
                    type: 'issue',
                    sequence: ['terminus']
                }
            ]);

            expect(getFlow(0, conf)).toEqual({
                confirmation: {
                    NEXT: 'menu'
                },
                menu: {
                    BACK: 'confirmation',
                    NEXT: 'trantor'
                },
                trantor: {
                    BACK: 'menu',
                    NEXT: 'details'
                },
                details: {
                    BACK: 'trantor'
                }
            });

            expect(getFlow(1, conf)).toEqual({
                confirmation: {
                    NEXT: 'menu'
                },
                menu: {
                    BACK: 'confirmation',
                    NEXT: 'terminus'
                },
                terminus: {
                    BACK: 'menu'
                }
            });
        });

        it('handles a sequence of length 2 for both issue and verify', () => {
            const conf = createConstants([
                {
                    type: 'verify',
                    sequence: ['star', 'trek']
                },
                {
                    type: 'issue',
                    sequence: ['star', 'wars']
                }
            ]);

            expect(getFlow(0, conf)).toEqual({
                confirmation: {
                    NEXT: 'menu'
                },
                menu: {
                    BACK: 'confirmation',
                    NEXT: 'star'
                },
                star: {
                    BACK: 'menu',
                    NEXT: 'trek'
                },
                trek: {
                    BACK: 'star',
                    NEXT: 'details'
                },
                details: {
                    BACK: 'trek'
                }
            });

            expect(getFlow(1, conf)).toEqual({
                confirmation: {
                    NEXT: 'menu'
                },
                menu: {
                    BACK: 'confirmation',
                    NEXT: 'star'
                },
                star: {
                    BACK: 'menu',
                    NEXT: 'wars'
                },
                wars: {
                    BACK: 'star'
                }
            });
        });

        it('handles a sequence of length 3 for both issue and verify', () => {
            const conf = createConstants([
                {
                    type: 'verify',
                    sequence: ['deep', 'space', 'nine']
                },
                {
                    type: 'issue',
                    sequence: ['the', 'bad', 'batch']
                }
            ]);

            expect(getFlow(0, conf)).toEqual({
                confirmation: {
                    NEXT: 'menu'
                },
                menu: {
                    BACK: 'confirmation',
                    NEXT: 'deep'
                },
                deep: {
                    BACK: 'menu',
                    NEXT: 'space'
                },
                space: {
                    BACK: 'deep',
                    NEXT: 'nine'
                },
                nine: {
                    BACK: 'space',
                    NEXT: 'details'
                },
                details: {
                    BACK: 'nine'
                }
            });

            expect(getFlow(1, conf)).toEqual({
                confirmation: {
                    NEXT: 'menu'
                },
                menu: {
                    BACK: 'confirmation',
                    NEXT: 'the'
                },
                the: {
                    BACK: 'menu',
                    NEXT: 'bad'
                },
                bad: {
                    BACK: 'the',
                    NEXT: 'batch'
                },
                batch: {
                    BACK: 'bad'
                }
            });
        });

        // The theory is that, if a length=4 case passes, you've handled the edge cases. Please raise an issue if you... take issue... with that.
        it('handles a sequence of length 4 for both issue and verify', () => {
            const conf = createConstants([
                {
                    type: 'verify',
                    sequence: ['the', 'caves', 'of', 'steel']
                },
                {
                    type: 'issue',
                    sequence: ['the', 'robots', 'of', 'dawn']
                }
            ]);

            expect(getFlow(0, conf)).toEqual({
                confirmation: {
                    NEXT: 'menu'
                },
                menu: {
                    BACK: 'confirmation',
                    NEXT: 'the'
                },
                the: {
                    BACK: 'menu',
                    NEXT: 'caves'
                },
                caves: {
                    BACK: 'the',
                    NEXT: 'of'
                },
                of: {
                    BACK: 'caves',
                    NEXT: 'steel'
                },
                steel: {
                    BACK: 'of',
                    NEXT: 'details'
                },
                details: {
                    BACK: 'steel'
                }
            });

            expect(getFlow(1, conf)).toEqual({
                confirmation: {
                    NEXT: 'menu'
                },
                menu: {
                    BACK: 'confirmation',
                    NEXT: 'the'
                },
                the: {
                    BACK: 'menu',
                    NEXT: 'robots'
                },
                robots: {
                    BACK: 'the',
                    NEXT: 'of'
                },
                of: {
                    BACK: 'robots',
                    NEXT: 'dawn'
                },
                dawn: {
                    BACK: 'of'
                }
            });
        });
    });
});