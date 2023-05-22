import { APP_LANGUAGES, AppLanguage } from '../models/app.models';

/**
 * Get current application language based on the first href path segment.
 *
 * Only a localized build contains the locale id as the first path segment.
 *
 * Same applies to the angular dev server as it only supports one locale.
 *
 * @returns `AppLanguage` with matching locale id or `undefined` if none was found.
 */
export function getCurrentAppLanguage(): Readonly<AppLanguage> | undefined {
  const segment = window.location.pathname.split('/').at(1);

  return APP_LANGUAGES.find(language => language.locale === segment);
}
