import { i18n } from "../contexts/TranslationContext";

export default function useTranslator(lng?: string) {
    const currentLanguage = lng ?? 'en';

    return i18n.getFixedT(currentLanguage);
}
