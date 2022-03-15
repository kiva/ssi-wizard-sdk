import createBase64Img from '../src/utils/createBase64Img';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('The base64 image converter (createBase64Img) utility', () => {

    it('successfully converts an image file to a base64 string', () => {
        const imgData = createBase64Img(path.resolve(__dirname, 'testAssets', 'images', 'kiva_small.jpg'));
        const expectedData = fs.readFileSync(path.resolve(__dirname, 'testAssets', 'images', 'kiva_small_expected.txt'), 'utf8')
        expect(imgData).toEqual(expectedData);
    });

    it('returns an empty string when there\'s no data in the file', () => {
        const imgData = createBase64Img(path.resolve(__dirname, 'testAssets', 'images', 'emptyImg.png'));
        expect(imgData).toEqual('');
    });

    it('throws an error when trying to convert a file that doesn\'t exist', () => {
        expect(() => {
            createBase64Img(path.resolve(__dirname, 'testAssets', 'images', 'doesNotExist.png'))
        }).toThrow();
    });
})