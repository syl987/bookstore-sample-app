// @ts-check

/**
 * @see https://prettier.io/docs/en/configuration.html
 *
 * @type {import("prettier").Config}
 */
const config = {
  arrowParens: 'avoid',
  printWidth: 180,
  singleQuote: true,
  quoteProps: 'consistent',
  plugins: ['prettier-plugin-tailwindcss'],
};

module.exports = config;
