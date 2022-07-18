module.exports = {
  parser: '@babel/eslint-parser',
  settings: {
    react: {
      version: 'detect',
    },
  },
  root: true,
  // extends: ["plugin:react-native/all"],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'airbnb-base',
    'prettier',
  ],
  plugins: ['react', 'react-native', 'react-hooks'],
  parserOptions: {
    requireConfigFile: false,
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    // 'react-hooks/rules-of-hooks':'off',
    'no-unsafe-optional-chaining': 'off',
    'no-console': 'off',
    'template-curly-spacing': 'off',
    'prefer-destructuring': 0,
    'no-use-before-define': [
      'error',
      {functions: true, classes: true, variables: false},
    ],
    'no-underscore-dangle': ['error', {allowAfterThis: true}],
    'react-native/no-unused-styles': 2,
    'react-native/split-platform-components': 2,
    'react-native/no-inline-styles': 0,
    'react-native/no-color-literals': 0,
    'react-native/no-raw-text': 0,
    'react-native/no-single-element-style-arrays': 2,
    'react/prop-types': [0],
    'react/display-name': [0],
    quotes: ['error', 'single', {avoidEscape: true}],
    'max-len': ['warn', {code: 1000}],
    'no-undef': [2],
    'react/jsx-curly-spacing': [0, 'always'],
    'no-restricted-syntax': [0],
    'no-tabs': 0,
    indent: ['off'],
    'react/jsx-indent': ['warn', 2],

    'no-plusplus': ['error', {allowForLoopAfterthoughts: true}],
    'one-var-declaration-per-line': [0],
    'one-var': [0],
    semi: [0, 'never'],
    camelcase: [0],
    'react-hooks/rules-of-hooks': ['warn'], // Checks rules of Hooks
    'react-hooks/exhaustive-deps': 'warn', // Checks effect dependencies
  },
  globals: {
    fetch: false,
    React: false,
  },
  env: {
    'react-native/react-native': true,
    node: true,
  },
};
