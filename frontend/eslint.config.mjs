import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],

    extends: [js.configs.recommended],

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: globals.browser,
    },

    plugins: {
      react: pluginReact,
      "react-hooks": reactHooks,
    },

    rules: {
      "no-unused-vars": "warn",
      "no-console": "off",

      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",

      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },

    settings: {
      react: {
        version: "detect",
      },
    },
  },
]);