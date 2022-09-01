/* eslint-disable import/prefer-default-export */
import LocalizedStrings from 'react-native-localization';
import * as RNLocalize from 'react-native-localize';

import english from './en';
import french from './fr';
import korean from './ko';
import thai from './th';

export const strings = new LocalizedStrings({
  en: english,
  fr: french,
  ko: korean,
  th: thai,
});

console.log('Device language', RNLocalize.getLocales()[0].languageCode);
strings.setLanguage(RNLocalize.getLocales()[0].languageCode);
