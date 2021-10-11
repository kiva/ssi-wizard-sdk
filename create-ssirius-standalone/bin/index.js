#!/usr/bin/env node
/**
 * MIT License
 * 
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * Source: https://github.com/facebook/docusaurus/blob/main/packages/create-docusaurus/bin/index.js
 */

const chalk = require('chalk');
const semver = require('semver');
const path = require('path');
const program = require('commander');
const { default: init } = require('../lib');
const requiredVersion = require('../package.json').engines.node;

if (!semver.satisfies(process.version, requiredVersion)) {
    console.log(
        chalk.red(`\nMinimum Node.js version not met :)`) +
        chalk.yellow(
            `\nYou are using Node.js ${process.version}, Requirement: Node.js ${requiredVersion}.\n`,
        ),
    );
    process.exit(99);
}

function wrapCommand(fn) {
    return (...args) =>
        fn(...args).catch((err) => {
            console.error(chalk.red(err.stack));
            process.exitCode = 1;
        });
}

program
    .version(require('../package.json').version)
    .usage('<command> [options]');

program
    .command('init [projectName] [rootDir]', { isDefault: true })
    .option('--skip-install', 'Skip NPM installation')
    .option('--pack <directory>', 'Your Pack directory to integrate into the template')
    .description('Initialize website.')
    .action(
        (projectName, rootDir = '.', { skipInstall, pack }) => {
            wrapCommand(init)(path.resolve(rootDir), projectName, {
                skipInstall,
                pack
            });
        },
    );

program.arguments('<command>').action((cmd) => {
    program.outputHelp();
    console.log(`  ${chalk.red(`\n  Unknown command ${chalk.yellow(cmd)}.`)}`);
    console.log();
});

program.parse(process.argv);

if (!process.argv.slice(1).length) {
    program.outputHelp();
}