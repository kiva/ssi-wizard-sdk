/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react";
import SSIriusRouter from '../src/components/SSIriusRouter';
import { IConstants } from '../src/interfaces/IConstants';
import IPropKeys from './interfaces/IPropKeys';
import createConstants from './helpers/createConstants';

const config: IConstants = createConstants([{
    type: 'verify',
    sequence: ['business', 'with', 'isengard']
}, {
    type: 'verify',
    sequence: ['remember', 'the', 'cant']
}, {
    type: 'issue',
    sequence: ['paint', 'costs', 'money']
}]);

function renderRouter() {
    return render(<SSIriusRouter {...config} />);
}

describe('<SSIriusRouter />', () => {
    let findByTestId: any;
    const checkValues = async (values: IPropKeys) => {
        if (values.dataHelper) {
            const dH = await findByTestId('dataHelper');
            expect(dH.textContent).toBe(`dataHelper: ${values.dataHelper}`);
        }

        const prevScreenText = await findByTestId('prevScreen');
        expect(prevScreenText.textContent).toBe(`prevScreen: ${values.prevScreen}`);

        const t = await findByTestId('tFunction');
        expect(t.textContent).toBe('Translated!');

        const authIndex = await findByTestId('authIndex');
        expect(authIndex.textContent).toBe(`authIndex: ${values.authIndex}`);

        const keyName = await findByTestId('keyName');
        expect(keyName.textContent).toBe(`keyName: ${values.keyName}`)

        const constants = await findByTestId('CONSTANTS');
        const cText: string = constants.textContent ?? '{}';
        const stringConfig = JSON.stringify(config);

        // This is definitely weird, but we're doing it because JSON.stringify removes functions from the objects
        // This still gives us value, and further tests will validate the functionality of the keys we lost in stringifying
        expect(JSON.parse(cText)).toEqual(JSON.parse(stringConfig));
    };
    const clickButton = async (buttonName: string) => {
        const button = await findByTestId(buttonName);
        fireEvent.click(button);
    };

    beforeEach(() => {
        findByTestId = renderRouter().findByTestId
    });

    it('renders the data correctly for the first step', async () => {
        await checkValues({
            prevScreen: '',
            authIndex: 0,
            keyName: 'confirmation'
        });
    });

    it('does not allow change to authIndex before you get to "menu"', async () => {
        jest.spyOn(console, 'warn').mockImplementation(warn => expect(warn).toBe("Please don't try to set the authentication method from outside the Authentication Menu screen"));
        await clickButton('set-method');

        await checkValues({
            prevScreen: '',
            authIndex: 0,
            keyName: 'confirmation'
        });
        jest.spyOn(console, 'warn').mockRestore();
    });

    it('does not change anything when you click BACK', async () => {
        await clickButton('back');

        await checkValues({
            prevScreen: '',
            authIndex: 0,
            keyName: 'confirmation'
        });
    });

    it('can go through the entire flow by clicking NEXT', async () => {
        const steps = [
            {
                prevScreen: '',
                authIndex: 0,
                keyName: 'confirmation'
            },
            {
                prevScreen: 'confirmation',
                authIndex: 0,
                keyName: 'menu',
                dataHelper: 'fakeData'
            },
            {
                prevScreen: 'menu',
                authIndex: 0,
                keyName: 'business'
            },
            {
                prevScreen: 'business',
                authIndex: 0,
                keyName: 'with'
            },
            {
                prevScreen: 'with',
                authIndex: 0,
                keyName: 'isengard'
            },
            {
                prevScreen: 'isengard',
                authIndex: 0,
                keyName: 'details'
            }
        ];

        for (let i = 0; i < steps.length; i++) {
            await checkValues(steps[i]);
            await clickButton('next');
        }
    });

    it('does not go past the last step, no matter how many times NEXT is clicked', async () => {
        for (let i = 0; i < 100; i++) {
            await clickButton('next');
        }

        await checkValues({
            prevScreen: 'isengard',
            authIndex: 0,
            keyName: 'details'
        });
    });

    it('can go all the way back through the flow by clicking BACK', async () => {
        const backwards = [
            {
                prevScreen: 'with',
                authIndex: 0,
                keyName: 'isengard'
            },
            {
                prevScreen: 'business',
                authIndex: 0,
                keyName: 'with'
            },
            {
                prevScreen: 'menu',
                authIndex: 0,
                keyName: 'business'
            },
            {
                prevScreen: 'confirmation',
                authIndex: 0,
                keyName: 'menu'
            },
            {
                prevScreen: '',
                authIndex: 0,
                keyName: 'confirmation'
            }
        ];
        for (let i = 0; i < 100; i++) {
            await clickButton('next');
        }
        for (let j = 0; j < backwards.length; j++) {
            await clickButton('back');
            await checkValues(backwards[j]);
        }
    });

    it('successfully changes flow based on new index selection', async () => {
        await clickButton('next');

        await clickButton('set-method');
        await clickButton('next');
        await checkValues({
            prevScreen: 'menu',
            authIndex: 1,
            keyName: 'remember'
        });

        await clickButton('back');
        await clickButton('set-method');
        await clickButton('next');
        await checkValues({
            prevScreen: 'menu',
            authIndex: 2,
            keyName: 'paint'
        });

        await clickButton('back');
        await clickButton('set-method');
        await clickButton('next');
        await checkValues({
            prevScreen: 'menu',
            authIndex: 0,
            keyName: 'business'
        });
    });
});