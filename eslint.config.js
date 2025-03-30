// @ts-check

const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');
const imports = require('eslint-plugin-import');
const ngrx = require('@ngrx/eslint-plugin/v9');
const regexp = require('eslint-plugin-regexp');
const simpleImportSort = require('eslint-plugin-simple-import-sort');
const unusedImports = require('eslint-plugin-unused-imports');
const prettier = require('eslint-config-prettier');

module.exports = tseslint.config(
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.strict,
      ...tseslint.configs.stylisticTypeChecked,
      ...angular.configs.tsRecommended,
      imports.flatConfigs?.recommended,
      imports.flatConfigs?.typescript,
      ngrx.configs.all,
      regexp.configs['flat/recommended'],
      prettier,
    ],
    plugins: {
      'simple-import-sort': simpleImportSort,
      'unused-imports': unusedImports,
    },
    processor: angular.processInlineTemplates,
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
      },
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },
    rules: {
      // ==== imports ====
      'import/first': 'warn',
      'import/newline-after-import': 'warn',
      'import/no-absolute-path': 'warn',
      'import/no-duplicates': 'warn',
      'import/no-useless-path-segments': 'warn',
      'simple-import-sort/imports': 'warn',
      'simple-import-sort/exports': 'warn',
      'unused-imports/no-unused-imports': 'warn',

      // ==== @ngrx ====
      '@ngrx/on-function-explicit-return-type': 'off', // recommended override: avoid ugly code by prettier

      // ==== regexp ====
      'regexp/sort-character-class-elements': 'warn',

      // ==== eslint: possible problems ====
      'no-self-compare': 'warn',
      'no-unreachable-loop': 'warn',
      'no-unused-private-class-members': 'warn',

      // ==== eslint: suggestions ====
      'curly': 'warn',
      'default-case-last': 'warn',
      'eqeqeq': ['warn', 'always', { null: 'ignore' }],
      'func-style': ['warn', 'declaration', { allowArrowFunctions: true }],
      'grouped-accessor-pairs': ['warn', 'setBeforeGet'],
      'guard-for-in': 'warn',
      'no-caller': 'warn',
      'no-console': 'warn',
      'no-else-return': 'warn',
      'no-empty': ['error', { allowEmptyCatch: true }], // recommended override: provide options
      'no-eval': 'warn',
      'no-extend-native': 'warn',
      'no-extra-bind': 'warn',
      'no-extra-label': 'warn',
      'no-iterator': 'warn',
      'no-lone-blocks': 'warn',
      'no-lonely-if': 'warn',
      'no-new': 'warn',
      'no-new-func': 'warn',
      'no-new-wrappers': 'warn',
      'no-object-constructor': 'warn',
      'no-octal-escape': 'warn',
      'no-proto': 'warn',
      'no-restricted-imports': [
        'warn',
        {
          paths: [
            {
              name: 'rxjs/operators',
              message: "Please import from 'rxjs' instead.",
            },
            {
              name: '@angular/forms',
              importNames: ['FormsModule', 'NgForm', 'NgModel', 'NgModelGroup'],
              message: 'Please use reactive forms instead.',
            },
          ],
        },
      ],
      'no-return-assign': 'warn',
      'no-script-url': 'warn',
      'no-undef-init': 'warn',
      'no-unneeded-ternary': 'warn',
      'no-useless-computed-key': ['warn', { enforceForClassMembers: true }],
      'no-useless-concat': 'warn',
      'no-useless-rename': 'warn',
      'no-useless-return': 'warn',
      'no-warning-comments': ['warn', { terms: ['todo'] }],
      'operator-assignment': 'warn',
      'prefer-arrow-callback': ['warn', { allowUnboundThis: false }],
      'prefer-destructuring': 'warn',
      'prefer-exponentiation-operator': 'warn',
      'prefer-numeric-literals': 'warn',
      'prefer-object-spread': 'warn',
      'yoda': ['warn', 'never', { exceptRange: true }],

      // ==== @typescript-eslint: supported rules ====
      '@typescript-eslint/await-thenable': 'warn', // from: recommended-type-checked-only
      '@typescript-eslint/member-ordering': ['warn', { default: ['static-field', 'instance-field', 'constructor', 'static-method', 'instance-method'] }],
      '@typescript-eslint/method-signature-style': ['warn', 'method'],
      '@typescript-eslint/no-deprecated': 'warn',
      '@typescript-eslint/no-empty-function': 'off', // stylistic override: sometimes needed
      '@typescript-eslint/no-empty-object-type': ['warn', { allowInterfaces: 'with-single-extends' }], // recommended override: useful with libraries
      '@typescript-eslint/no-explicit-any': 'off', // recommended override: useful with libraries and generic data
      '@typescript-eslint/no-extraneous-class': 'off', // strict override: support angular annotated empty classes
      '@typescript-eslint/no-for-in-array': 'warn', // from: recommended-type-checked-only
      '@typescript-eslint/no-namespace': 'off', // recommended override: used for utils
      '@typescript-eslint/no-non-null-assertion': 'off', // recommended override: useful with angular and specs at times
      '@typescript-eslint/no-unnecessary-qualifier': 'warn',
      '@typescript-eslint/no-useless-constructor': 'off', // strict override: needed in annotated angular classes
      '@typescript-eslint/no-useless-empty-export': 'warn',
      '@typescript-eslint/parameter-properties': ['warn', { prefer: 'parameter-property' }],
      '@typescript-eslint/prefer-enum-initializers': 'warn',
      '@typescript-eslint/prefer-nullish-coalescing': 'off', // stylistic override: sometimes intended
      '@typescript-eslint/prefer-readonly': 'warn',
      '@typescript-eslint/require-await': 'warn', // from: recommended-type-checked-only

      // ==== @typescript-eslint: extension rules ====
      // tuples: same-name eslint rules need to be turned off before
      'no-invalid-this': 'off',
      '@typescript-eslint/no-invalid-this': 'warn',
      'no-loop-func': 'off',
      '@typescript-eslint/no-loop-func': 'warn',
      'no-shadow': 'off',
      '@typescript-eslint/no-shadow': 'warn',
      'no-unused-expressions': 'off',
      '@typescript-eslint/no-unused-expressions': 'warn',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { args: 'none', varsIgnorePattern: '^_+$' }], // recommended override: provide special options

      // ==== @angular-eslint: typescript ====
      '@angular-eslint/component-max-inline-declarations': 'warn',
      '@angular-eslint/consistent-component-styles': 'warn',
      '@angular-eslint/contextual-decorator': 'error',
      '@angular-eslint/no-async-lifecycle-method': 'warn',
      '@angular-eslint/no-conflicting-lifecycle': 'warn',
      '@angular-eslint/no-duplicates-in-metadata-arrays': 'warn',
      '@angular-eslint/no-inputs-metadata-property': 'off', // recommended override: necessary for extending a component
      '@angular-eslint/no-outputs-metadata-property': 'off', // recommended override: necessary for extending a component
      '@angular-eslint/no-queries-metadata-property': 'off', // recommended override: necessary for extending a component
      '@angular-eslint/prefer-on-push-component-change-detection': 'warn',
      '@angular-eslint/prefer-output-readonly': 'warn',
      '@angular-eslint/prefer-standalone': 'warn',
      '@angular-eslint/relative-url-prefix': 'warn',
      '@angular-eslint/require-localize-metadata': 'off', // currently unused
      '@angular-eslint/runtime-localize': 'off', // currently unused
      '@angular-eslint/sort-lifecycle-methods': 'warn',
      '@angular-eslint/use-component-selector': 'warn',
      '@angular-eslint/use-lifecycle-interface': 'warn',
    },
  },
  {
    files: ['**/*.html'],
    extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
    rules: {
      // ==== @angular-eslint: template ====
      '@angular-eslint/template/attributes-order': 'off', // currently unused
      '@angular-eslint/template/button-has-type': 'off', // currently unused, prevent unintended submit type if placed within a form
      '@angular-eslint/template/eqeqeq': ['warn', { allowNullOrUndefined: true }], // recommended override: provide options
      '@angular-eslint/template/i18n': 'off', // currently unused
      '@angular-eslint/template/no-any': 'warn',
      '@angular-eslint/template/no-duplicate-attributes': 'warn',
      '@angular-eslint/template/no-inline-styles': 'off', // currently unused
      '@angular-eslint/template/no-interpolation-in-attributes': 'warn',
      '@angular-eslint/template/no-positive-tabindex': 'warn',
      '@angular-eslint/template/prefer-control-flow': 'warn',
      '@angular-eslint/template/prefer-ngsrc': 'off', // currently unused
      '@angular-eslint/template/prefer-self-closing-tags': 'off', // TODO resolve svg elements and enable
    },
  },
);
