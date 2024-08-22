// @ts-check

import js from '@eslint/js'
import tseslint from "typescript-eslint"

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    ignores: ["**/__test__/**", "**/eslint.config.js"],
  },
  {
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.build.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-this-alias": "off",
    },
  },
)
