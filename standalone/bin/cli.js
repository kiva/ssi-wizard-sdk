#!/usr/bin/env node

'use strict';

const spawn = require('cross-spawn');
const fs = require('fs-extra');
const args = process.argv.slice(2);
const build_template = 'ssirius build --config=<FILE NAME>';
const start_template = 'ssirius start --config=<FILE NAME>';
const cwd = process.cwd() + '/';

if (args.length === 0) {
    console.log(
        `You need to specify a script to run. For now there are but 2 options:\n\t${start_template}\n\t${build_template}\n`
    );
    process.exit(99);
}

if (args.length > 2) {
    console.log(
        `Invalid arguments supplied to the script - please run using either\n\t${start_template}\n\t${build_template}\n`
    );
    process.exit(99);
}

const {script, file} = getScriptAndConfigFile(args);

if (['start', 'build'].indexOf(script) === -1) {
    console.log(
        `Your attempt to run "ssirius ${script}" failed! We only support "ssirius start" and "ssirius build"\n`
    );
}

let configInfo = fs.readFileSync(file, 'utf8');

if (isJsonFile(file)) {
    configInfo = 'const config = ' + configInfo + '; export default config;';
}

fs.writeFileSync(__dirname + '/../src/config.ts', configInfo);

// This is mostly ripped from react-scripts. Thank you, react-scripts!
//     To build your own non-SSI React app from scratch, check out https://create-react-app.dev
const result = spawn.sync(
    process.execPath,
    [__dirname + '/../scripts/' + script, file],
    {stdio: 'inherit'}
);

if (result.signal) {
    if (result.signal === 'SIGKILL') {
        console.log(
            'The build failed because the process exited too early. ' +
                'This probably means the system ran out of memory or someone called ' +
                '`kill -9` on the process.'
        );
    } else if (result.signal === 'SIGTERM') {
        console.log(
            'Someone, or something, terminated the process. Exiting...'
        );
        process.exit(1);
    }
}
process.exit(result.status);

function getScriptAndConfigFile(args) {
    const ret = {};
    args.forEach(arg => {
        if (arg.indexOf('--config') === 0 && arg.indexOf('=') > -1) {
            ret['file'] = determineFileName(arg);
        } else {
            ret['script'] = arg;
        }
    });
    return ret;
}

function determineFileName(arg) {
    return arg.split('=')[1];
}

function isJsonFile(fileName) {
    return fileName.lastIndexOf('.json') === fileName.length - 5;
}
