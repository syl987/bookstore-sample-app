import { inject, LOCALE_ID } from '@angular/core';

import { APP_LANGUAGES, AppLanguage } from '../models/app.models';

/**
 * Get current application language based on the current LOCALE_ID.
 *
 * @returns `AppLanguage` with matching locale id.
 */
export function getCurrentAppLanguage(locale = inject(LOCALE_ID)): AppLanguage {
  const lang = APP_LANGUAGES.find(language => language.locale === locale);

  if (!lang) {
    throw new Error('Internal Error: Invalid locale definition.');
  }
  return lang;
}
