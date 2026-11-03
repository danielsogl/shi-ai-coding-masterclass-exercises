// @ts-check
import eslint from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";
import angular from "angular-eslint";
import ngrx from "@ngrx/eslint-plugin";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import playwright from "eslint-plugin-playwright";

export default defineConfig([
  globalIgnores([
    "dist/",
    "coverage/",
    ".angular/",
    ".features-gen/",
    "playwright-report/",
    "test-results/",
  ]),
  {
    files: ["**/*.ts"],
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended,
      tseslint.configs.stylistic,
      angular.configs.tsRecommended,
      ngrx.configs.operators,
      eslintConfigPrettier,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", ignoreRestSiblings: true },
      ],
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "app",
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "app",
          style: "kebab-case",
        },
      ],
    },
  },
  {
    files: ["src/**/*.ts"],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    extends: [ngrx.configs.signalsTypeChecked],
  },
  {
    files: ["**/*.html"],
    extends: [
      angular.configs.templateRecommended,
      angular.configs.templateAccessibility,
    ],
    rules: {},
  },
  {
    files: ["e2e/**/*.ts"],
    extends: [playwright.configs["flat/recommended"]],
    rules: {
      // playwright-bdd steps (Given/When/Then) are not test() blocks.
      "playwright/no-standalone-expect": "off",
    },
  },
]);
