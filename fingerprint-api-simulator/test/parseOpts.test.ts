import parseOpts, {addExternalFileData, insertData} from '../src/utils/parseOpts';
import {returnValues} from '../src/defaults/config';
import path from 'path';
import IConfig from '../src/interfaces/IConfig';
import {jest} from '@jest/globals'
import { fileURLToPath } from "url";
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createDefaultConfig(): IConfig {
    return {
        ImageBase64: 'Aloha',
        FingerprintSensorSerialNumber: 'Jest Simulator'
    };
}

describe('Opts Parsing', () => {
    const expectedData: IConfig = {
        ...createDefaultConfig(),
        token: 'TT',
        endpoints: ["Turtle", "Toes"],
        p: 2002,
        port: 2002,
        i: "fakeImage",
        image: "fakeImage",
        nestedKey: {
            randomData: [1, 2, 3],
            hello: 'sweetie'
        },
        bestTurtle: true
    }

    describe('parseOpts', () => {
        it('returns a simple config when the default options are applied', async () => {
            const conf = await parseOpts({
                i: returnValues.ImageBase64,
                p: 9907,
                endpoints: returnValues.endpoints
            });

            expect(conf).toEqual(returnValues);
        });

        it('adds values supplied by the options to the config object', async () => {
            const conf = await parseOpts({
                i: returnValues.ImageBase64,
                p: 9907,
                endpoints: returnValues.endpoints,
                extraOpt: 'excelsior' 
            });

            expect(conf).toEqual({
                ...returnValues,
                extraOpt: 'excelsior'
            });
        });

        it('updates the image when the -i option is provided', async () => {
            const conf = await parseOpts({
                i: path.resolve(__dirname, 'testAssets', 'images', 'kiva_small.jpg'),
                p: 9907,
                endpoints: returnValues.endpoints
            });

            expect(conf.ImageBase64).toEqual(fs.readFileSync(path.resolve(__dirname, 'testAssets', 'images', 'kiva_small_expected.txt'), 'utf8'));
        });

        it('inserts data from external file into conf when -f option is provided', async () => {
            const conf = await parseOpts({
                i: returnValues.ImageBase64,
                p: 9907,
                endpoints: returnValues.endpoints,
                f: path.resolve(__dirname, 'testAssets', 'externalDataFiles', 'data.json')
            });

            expect(conf).toEqual({
                ...returnValues,
                token: 'TT',
                endpoints: ["Turtle", "Toes"],
                p: 2002,
                port: 2002,
                i: "fakeImage",
                image: "fakeImage",
                nestedKey: {
                    randomData: [1, 2, 3],
                    hello: 'sweetie'
                },
                bestTurtle: true
            });
        });
    });

    describe('addExternalFileData', () => {
        it('parses data from a ESM JS file and adds it to the API\'s return value', async () => {
            const defaultConfig = createDefaultConfig();
            await addExternalFileData(path.resolve(__dirname, 'testAssets', 'externalDataFiles', 'esmData.js'), defaultConfig);
            expect(defaultConfig).toEqual(expectedData);
        });

        it('parses data from a CJS file and adds it to the API\'s return value', async () => {
            const defaultConfig = createDefaultConfig();
            await addExternalFileData(path.resolve(__dirname, 'testAssets', 'externalDataFiles', 'data.cjs'), defaultConfig);
            expect(defaultConfig).toEqual(expectedData);
        });

        it('parses data from a JSON file and adds it to the API\'s return value', async () => {
            const defaultConfig = createDefaultConfig();
            await addExternalFileData(path.resolve(__dirname, 'testAssets', 'externalDataFiles', 'data.json'), defaultConfig);
            expect(defaultConfig).toEqual(expectedData);
        });

        it('throws a warning if the file type cannot be imported', () => {
            const fileName = path.resolve(__dirname, 'testAssets', 'images', 'kiva_small.jpg');
            const warningString = `Sorry! We were not able to read ${fileName}, so the data in that file will not be added to your API response`;

            jest.spyOn(console, 'warn');
            addExternalFileData(fileName, createDefaultConfig()).then(() => {
                expect(console.warn).toHaveBeenCalledWith(warningString)
            });
        });
    });

    describe('insertData', () => {
        it('inserts all provided data into an IConfig object', () => {
            const testConfig = createDefaultConfig();
            const inserting: any = {
                to: 'infinity',
                and: 'beyond',
                toyStory: 1,
                good: true,
                arr: ['a', 'y', '!']
            };
            insertData(inserting, testConfig);

            expect(testConfig).toMatchObject(inserting)
        })
    })
});