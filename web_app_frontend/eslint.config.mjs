import globals from "globals";
import pluginJs from "@eslint/js";
import pluginVue from "eslint-plugin-vue";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    ignores: ['node_modules', 'dist'], // Files and directories to ignore
  },
  {
    files: ['**/*.js', '**/*.vue'], // Target JS and Vue files
    languageOptions: {
      globals: globals.browser, // Add browser globals
      parserOptions: {
        ecmaVersion: 'latest', // Latest ECMAScript version
        sourceType: 'module', // Use ES modules
      },
    },
    plugins: {
      js: pluginJs,
      vue: pluginVue,
    },
    rules: {
      ...pluginJs.configs.recommended.rules, // Include JavaScript recommended rules
      ...pluginVue.configs["flat/essential"].rules, // Include Vue essential rules
      'vue/multi-word-component-names': 'off', // Example: Customize Vue rules
    },
  },
];