// @ts-check

/**
 * @see https://github.com/stylelint/stylelint/blob/main/docs/user-guide/configure.md
 *
 * @type {import('stylelint').Config}
 */
const config = {
  extends: [
    'stylelint-config-standard-scss', // also extends: recommended-scss, standard, recommended
    'stylelint-config-clean-order',
    'stylelint-config-prettier-scss',
  ],
  rules: {},
};

module.exports = config;
