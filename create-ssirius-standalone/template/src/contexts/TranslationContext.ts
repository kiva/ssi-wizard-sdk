import i18next from 'i18next';
import resources from '../translations.json';
import { initReactI18next } from 'react-i18next';
import config_constants from '../constants';
import { createContext } from 'react';

i18next.use(initReactI18next).init({
    lng: 'en',
    resources
});

const defaultT = i18next.getFixedT(config_constants.defaultLang);
const TranslationContext = createContext(defaultT);

export default TranslationContext;

export const i18n = i18next;

