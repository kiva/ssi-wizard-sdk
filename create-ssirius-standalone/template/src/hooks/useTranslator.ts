import i18n from 'i18next';
import resources from '../translations.json';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
    lng: 'en',
    resources
});

export default function useTranslator(lng?: string) {
    const currentLanguage = lng ?? 'en';

    return i18n.getFixedT(currentLanguage);
}
