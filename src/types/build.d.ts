/**
 * Dynamic build variables injectend into the app via `index.html`.
 *
 * @see `/src/assets/js/build.js` file for details.
 */
declare const build: {
  /** Currect version as read from package.json. */
  readonly version: string;
  /** Currect version date as ISO string (without time). */
  readonly date: string;
};
