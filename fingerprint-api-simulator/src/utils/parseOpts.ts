import IConfig from "../interfaces/IConfig";
import IOpts from "../interfaces/IOpts";
import { returnValues } from "../defaults/config.js";
import createBase64Img from "./createBase64Img.js";
import path from "path";
import { createRequire } from "module";

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

async function addExternalFileData(fileName: string, conf: IConfig) {
    let data;
    try {
        const d = await import(path.resolve(process.cwd(), fileName));
        data = d.default;
    } catch {
        const require = createRequire(import.meta.url);
        data = require(path.resolve(process.cwd(), fileName));
    } finally {
        insertData(data, conf);
    }
}

function insertData(data: any, conf: IConfig): void {
    for (const k in data) {
        conf[k] = data[k];
    }
}