module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    "cypress/globals": true,
  },
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "jest", "react-hooks", "cypress"],
  rules: {},
  overrides: [
    {
      files: ["**/*.ts", "**/*.js", "**/*.jsx", "**/*.tsx"],
      rules: {
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/prefer-as-const": "off",
        "@typescript-eslint/no-var-requires": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "react/prop-types": "off",
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": ["error"],
      },
    },
  ],
};
