import IConfig from "../interfaces/IConfig";
import IOpts from "../interfaces/IOpts";
import { returnValues } from "../defaults/config.js";
import createBase64Img from "./createBase64Img.js";
import path from "path";

export default async function parseOpts(opts: IOpts): Promise<IConfig> {
    const conf: IConfig = returnValues;
    const ignored: any = {
        '_': true,
        '$0': true,
        'p': true,
        'port': true,
        'i': true,
        'image': true,
        'f': true,
        'file': true,
        'endpoints': true
    };
    if (opts.i !== conf.ImageBase64) {
        conf.ImageBase64 = createBase64Img(path.resolve(process.cwd(), opts.i))
    }
    if (opts.f) {
        await addExternalFileData(opts.f, conf);
    }
    for (const optKey in opts) {
        if (!ignored[optKey]) {
            conf[optKey] = opts[optKey];
        }
    }

    return conf;
}

export async function addExternalFileData(fileName: string, conf: IConfig) {
    try {
        const {default: data} = await import(path.resolve(process.cwd(), fileName));
        insertData(data, conf);
    } catch {
        console.warn(`Sorry! We were not able to read ${fileName}, so the data in that file will not be added to your API response`);
    }
}

export function insertData(data: any, conf: IConfig): void {
    for (const k in data) {
        conf[k] = data[k];
    }
}