import config from './config';
import { readdirSync, readFileSync, writeJSONSync } from 'fs-extra';

function getLang(): string {
    return config.defaultLang;
}

function createTranslationFile() {
    const lang: string = getLang();
    const i18nDirectory = `${__dirname}/../../i18n`;
    const langData = getLangData(lang, i18nDirectory);

    writeTranslations(lang, langData);
}

function writeTranslations(lang: string, data: any): void {
    writeJSONSync(`${__dirname}/../../../src/translations.json`, {
        [lang]: {
            translation: data
        }
    });
}

function getLangData(lang: string, directory: string) {
    const langFile = readdirSync(directory)
        .filter(item =>
            0 === item.indexOf(lang));
    return JSON.parse(readFileSync(`${directory}/${langFile[0]}`, 'utf8'));
}

createTranslationFile();
