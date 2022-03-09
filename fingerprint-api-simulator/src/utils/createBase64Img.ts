import fs from 'fs';

export default function createBase64Img(fileName: string): string {
    let fileData = fs.readFileSync(fileName);

    if (fileData) {
        return Buffer.from(fileData).toString('base64');
    }
    return '';
}
