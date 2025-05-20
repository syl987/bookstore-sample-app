// @ts-check

/**
 * @see https://github.com/stylelint/stylelint/blob/main/docs/user-guide/configure.md
 *
 * @type {import('stylelint').Config}
 */
const config = {
  extends: [
    'stylelint-config-recommended-scss', // also extends: recommended
    'stylelint-config-clean-order',
    'stylelint-config-prettier-scss',
  ],
  rules: {
    'selector-pseudo-element-no-unknown': [true, { ignorePseudoElements: ['ng-deep'] }], // recommended override: support angular elements
  },
};

module.exports = config;
