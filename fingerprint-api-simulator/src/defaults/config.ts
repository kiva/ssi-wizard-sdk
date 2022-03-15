import IConfig from "../interfaces/IConfig";
import createBase64Img from "../utils/createBase64Img.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const returnValues: IConfig = {
    FingerprintSensorSerialNumber: 'Kiva-Device-Simulator',
    ImageBase64: createBase64Img(__dirname + '/../images/fingerprint.png')
};

export const endpoints: string[] = [
    '/EKYC/Info',
    '/EKYC/Fingerprint'
];
