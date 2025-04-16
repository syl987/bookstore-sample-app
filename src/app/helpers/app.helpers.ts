import { AppLanguage, AppLanguages } from '../models/app.models';

/**
 * Get current language by locale.
 *
 * @param languages Available languages.
 * @param locale Current locale id.
 * @returns `AppLanguage` with matching locale id.
 * @throws If non has been matched.
 */
export function getCurrentAppLanguage(languages: AppLanguages, locale: string): AppLanguage {
  const lang = languages.find(l => l.locale === locale);

  if (!lang) {
    throw new Error('Could not determine current locale.');
  }
  return lang;
}
