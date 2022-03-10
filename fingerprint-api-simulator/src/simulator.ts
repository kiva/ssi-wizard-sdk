#!/usr/bin/env node

import { returnValues, endpoints } from "./defaults/config.js";
import yargs from 'yargs';
import {hideBin} from 'yargs/helpers';
import createEndpoints from "./utils/createEndpoints.js";
import parseOpts from "./utils/parseOpts.js";
import { serverInit, listenOnPort, configureEndpoints } from "./utils/serverUtils.js";

const argv = yargs(hideBin(process.argv))
    .usage('Usage: $0 [options]')
    .options({
        p: { type: 'number', default: 9907, alias: 'port' },
        i: { type: 'string', default: returnValues.ImageBase64, alias: 'image' },
        f: { type: 'string', alias: 'file' },
        endpoints: { type: 'array', default: endpoints }
    })
    .example([
        ['$0 -p, --port [number]', 'Set a custom port for the API to run. Default is 9907.'],
        ['$0 -f, --file [path/to/file]', 'Include a file containing custom data you\'d like to have included in the API response. Can be JSON, CommonJS or ESM.'],
        ['$0 -i, --image [path/to/imageFile]', 'Include a custom fingerprint image for conversion to base64'],
        ['$0 --endpoints /MyPath /MyOtherCoolPath /ThisCoolPath,/ThisOtherCoolPath', "Takes a space- or comma-separated lists of endpoints from which to serve the API response. Uses /EKYC/Info and /EKYC/Fingerprint by default."],
        ['$0 --any other --data desired', 'Custom options can be provided directly - in this example, any: "other" and data: "desired" would be added to your server response']
    ])
    .parseSync();

const points = createEndpoints(argv);
console.log(points);

parseOpts(argv).then(d => {
    const app = serverInit();
    configureEndpoints(app, points, d);
    listenOnPort(app, argv.p);
});
