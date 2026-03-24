import { createI18n, type I18nOptions } from 'vue-i18n';
import messages from '@intlify/unplugin-vue-i18n/messages';

const options: I18nOptions = {
    availableLocales: ['en'],
    fallbackLocale: 'en',
    legacy: false,
    locale: localStorage.getItem('lang') ?? 'en',
    messages
};

export default createI18n(options);