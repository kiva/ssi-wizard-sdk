#!/usr/bin/env node

import constants from '../../src/constants';
import { readdirSync, readFileSync, writeJSONSync } from 'fs-extra';

function getLangs(): string[] {
    return [constants.defaultLang, ...getSubLangs(constants.defaultLang)];
}

function getSubLangs(locale: string): string[] {
    const ret: string[] = []
    if (-1 === locale.indexOf('-')) return ret;

    const parts: string[] = locale.split('-');
    parts.pop();
    while (parts && parts.length) {
        ret.push(parts.join('-'));
        parts.pop();
    }
    return ret;
}

function createTranslationFile() {
    const langs: string[] = getLangs();
    const i18nDirectory = `${__dirname}/../i18n`;
    const langData: any = {};
    langs.forEach((lang) => {
        const currentLangData = getLangData(lang, i18nDirectory);
        if (currentLangData) {
            langData[lang] = {
                translation: currentLangData
            };
        }
    });

    writeTranslations(langData)
}

function writeTranslations(data: any): void {
    writeJSONSync(`${__dirname}/../../src/translations.json`, data);
}

function getLangData(lang: string, directory: string): string {
    try {
        const langFile = readdirSync(directory)
        .filter(item =>
            0 === item.indexOf(lang));
        return JSON.parse(readFileSync(`${directory}/${langFile[0]}`, 'utf8'));
    } catch (e) {
        console.warn(`Could not find ${lang}.json in the i18n directory. Skipping...`);
        return '';
    }
}

createTranslationFile();
