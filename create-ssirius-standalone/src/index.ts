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
 * Source: https://github.com/facebook/docusaurus/blob/main/packages/create-docusaurus/src/index.ts
 */

import chalk from 'chalk';
import { execSync } from 'child_process';
import fs from 'fs-extra';
import path from 'path';

export default async function init(
    rootDir: string,
    projectName: string,
    cliOptions: Partial<{
        skipInstall: boolean,
        pack: string,
        build: boolean
    }> = {}
): Promise<void> {
    const templateDirectory = path.resolve(__dirname, '../template');

    const projectDirectory = path.resolve(rootDir, projectName);
    const hasPackageJson = cliOptions.pack && fs.existsSync(path.resolve(cliOptions.pack, 'package.json'));
    if (fs.existsSync(projectDirectory)) {
        throw new Error(`Your project directory "${projectDirectory}" already exists - please choose another name or delete the offending files and folders`);
    }

    console.log(
        `\n${chalk.cyan('Creating your SSIrius project in ' + rootDir + '/' + projectName)}\n`
    );

    await fs.copy(templateDirectory, projectDirectory);

    console.log(
        `\n${chalk.magenta('Copied all the template files to ' + rootDir + '/' + projectName)}\n`
    );

    await setPkgDefaults(path.resolve(projectDirectory, 'package.json'), {
        name: projectName,
        version: '0.0.0',
        private: true
    });

    console.log(
        `\n${chalk.cyan('Template created!')}\n`
    );

    if (cliOptions.pack) {
        console.log(
            `\n${chalk.magenta('And since you made a pre-built pack (go you!!!) we\'ll be adding it to the build')}\n`
        );
        if (hasPackageJson) {
            console.log(`${chalk.green('You have also included a package.json file - you will need to manually run npm install once setup is complete')}`);
            cliOptions.skipInstall = true;
        }

        await integrateExternalPack(cliOptions.pack, projectDirectory);
        console.log(
            `\n${chalk.magenta('Success!!!')}`
        );
    }

    if (!cliOptions.skipInstall || cliOptions.build) {
        console.log(`\n${chalk.cyan('So you have chosen to have us install your NPM package...')}`);
        execSync(`cd ${projectName} && npm i ${cliOptions.build ? ' && npm run build' : ''}`);
    }
}

async function updateDependencies(pkgPath: string, externalPkg: string) {
    let pkg: any = await fs.readFile(pkgPath, 'utf8'),
        extPkg: any = await fs.readFile(externalPkg, 'utf8');

    pkg = JSON.parse(pkg);
    extPkg = JSON.parse(extPkg);

    ['dependencies', 'devDependencies', 'peerDependencies'].forEach(dep => {
        // The goal of this function is to merge the dependencies of an externally provided package into
        // the dependencies for the ssirius-standalone template.
        //
        // As you can see, we prioritize the template package dependencies, because our bias is that our platform should work for you.
        // That said, if you have an external package.json we will skip installation, so feel free to undo this work.
        if (pkg.hasOwnProperty(dep) && extPkg.hasOwnProperty(dep)) {
            pkg[dep] = Object.assign(extPkg[dep], pkg[dep]);
        } else if (extPkg.hasOwnProperty(dep)) {
            pkg[dep] = extPkg[dep];
        }
    });

    await outputFormattedJson(pkgPath, pkg);
}

function outputFormattedJson(path: string, data: any) {
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

async function setPkgDefaults(pkgPath: string, obj: Record<string, unknown>) {
    let pkgContent = {};

    try {
        const content = await fs.readFile(pkgPath, 'utf-8');
        pkgContent = JSON.parse(content);
    } catch (e: any) {
        console.log(`\n${chalk.green('We couldn\'t detect a package.json file in your package. We\'ll just give you a basic one for now.')}`);
    }
    const newPkg = Object.assign(pkgContent, obj);

    await outputFormattedJson(pkgPath, newPkg);
}

async function integrateExternalPack(packPath: string, projectDirectory: string): Promise<void> {
    const packDirectory = path.resolve(process.cwd(), packPath);

    const packContents = fs.readdirSync(packDirectory)
        .filter(item =>
            !item.startsWith('.')
            && !fs.lstatSync(path.resolve(packDirectory, item)).isSymbolicLink()
        );

    packContents.forEach(element => {
        switch (element) {
            case 'package-lock.json':
            case 'node_modules':
                break;
            case 'i18n':
                fs.copy(path.resolve(packDirectory, element), path.resolve(projectDirectory, 'tools', element));
                generateTranslationFile(path.resolve(packDirectory, element), path.resolve(projectDirectory, 'src', 'translations.json'));
                break;
            case 'package.json':
                updateDependencies(path.resolve(projectDirectory, 'package.json'), path.resolve(packDirectory, 'package.json'));
                break;
            default:
                fs.copy(path.resolve(packDirectory, element), path.resolve(projectDirectory, 'src', element));
        }
    });

}

async function generateTranslationFile(translationDirectory: string, dest: string): Promise<void> {
    const translationFiles = fs
        .readdirSync(translationDirectory)
        .filter(item =>
            !item.startsWith('.') &&
            path.extname(item) === '.json'
        );
    const translationData: any = {};

    translationFiles.forEach(file => {
        const translations = fs.readFileSync(path.resolve(translationDirectory, file), 'utf8');
        const parsed = JSON.parse(translations);
        const lang = file.split('.json')[0];

        translationData[lang] = {
            translation: parsed
        }
    });

    fs.writeFileSync(dest, JSON.stringify(translationData));
}
