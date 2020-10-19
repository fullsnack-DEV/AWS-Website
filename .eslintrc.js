module.exports = {
  "parser": "babel-eslint",
  "settings": {
    "react": {
      "version": "detect"
    },
  },
  root: true,
  // extends: ["plugin:react-native/all"],
  "extends" : [
    "eslint:recommended",
    "plugin:react/recommended",
    "airbnb-base"
  ],
  "plugins": [
    "react",
    "react-native"
  ],
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "rules": {
    "no-use-before-define": ["error", { "functions": true, "classes": true, "variables": false }],
    "react-native/no-unused-styles": 2,
    "react-native/split-platform-components": 2,
    "react-native/no-inline-styles": 0,
    "react-native/no-color-literals": 0,
    "react-native/no-raw-text": 2,
    "react-native/no-single-element-style-arrays": 2,
    "react/prop-types": [0],
    "react/display-name": [0],
    "quotes": [
      "error",
      "single"
    ],
    "max-len": ["warn", { "code": 132 }],
    "no-undef": [ 1 ],
    "react/jsx-curly-spacing": [ 0, "always" ],
    "react/jsx-indent": [ 2, 4 ],
    "semi": [0, "never"],
    "camelcase": [0]
  },
  globals: {
    fetch: false,
    React: false
  },
  "env": {
    "react-native/react-native": true,
    "node": true
  },
};
