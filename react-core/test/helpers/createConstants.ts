import { IConstants } from "../../src/interfaces/IConstants";
import Mock from "../mocks/Mock";
import IVerificationOptionPartial from "../interfaces/IVerificationOptionPartial";
import { AuthOption } from "../../src/interfaces/AuthOptionInterfaces";

export default function createConstants(options: IVerificationOptionPartial[]): IConstants {
    const component_map = {
        confirmation: {
            component: Mock,
            props: {
                keyName: 'confirmation'
            }
        },
        menu: {
            component: Mock,
            props: {
                keyName: 'menu'
            },
            dataHelper: 'fakeData'
        },
        details: {
            component: Mock,
            props: {
                keyName: 'details'
            }
        }
    };

    const verification_options: AuthOption[] = options.map(option => {
        addSequenceToComponentMap(option.sequence, component_map);

        return {
            ...option,
            title: 'Mock Option',
            description: 'This is a mock authentication option menu item',
            id: 'MOCK'
        };
    });

    const baseConfig = {
        verification_options,
        component_map,
        direction: 'rtl',
        defaultLang: 'en',
        credentialKeyMap: {
            firstName: {
                name: 'First Name',
                rendered: true,
                dataType: 'text'
            }
        },
        t: () => 'Translated!'
    };

    return baseConfig;
}

function addSequenceToComponentMap(sequence: string[], componentMap: any) {
    sequence.forEach(step => {
        if (!componentMap.hasOwnProperty(step)) {
            componentMap[step] = {
                component: Mock,
                props: {
                    keyName: step
                }
            };
        }
    });
}