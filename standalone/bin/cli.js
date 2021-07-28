#!/usr/bin/env node

'use strict';

const fs = require('fs-extra');
const args = process.argv.slice(2);
const build_template = 'ssirius build --config=<FILE NAME>';
const start_template = 'ssirius start --config=<FILE NAME>';

if (args.length === 0) {
    console.log(
        `You need to specify a script to run. For now there are but 2 options:\n\t${start_template}\n\t${build_template}\n`
    );
    process.exit(99);
}

if (args.length > 3) {
    console.log(
        `Invalid arguments supplied to the script - please run using either\n\t${start_template}\n\t${build_template}\n\nIf you are doing local development on the ssirius package, you may also add the --local flag to build locally.`
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

if ('start' === script) {
    const runDevServer = require('../scripts/start');
    runDevServer();
} else if ('build' === script) {
    const buildApp = require('../scripts/build');
    buildApp();
}

function getScriptAndConfigFile(args) {
    const ret = {};
    args.forEach(arg => {
        if (arg.indexOf('--config') === 0 && arg.indexOf('=') > -1) {
            ret['file'] = determineFileName(arg);
        } else if ('--local' !== arg) {
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