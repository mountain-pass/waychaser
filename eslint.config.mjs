import tseslint from "typescript-eslint";
import eslintPluginSecurity from "eslint-plugin-security";
import eslintPluginUnicorn from "eslint-plugin-unicorn";
import eslintPluginPromise from "eslint-plugin-promise";
import eslintPluginIstanbul from "eslint-plugin-istanbul";
import eslintPluginJsdoc from "eslint-plugin-jsdoc";
import eslintPluginJson from "eslint-plugin-json";
import eslintPluginChaiFriendly from "eslint-plugin-chai-friendly";
import eslintConfigPrettier from "eslint-config-prettier";

export default tseslint.config(
  // Global ignores (replaces .eslintignore)
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      "coverage/**",
      "report/**",
      "test-results/**",
      ".nyc_output/**",
      "target/**",
      "lib/**",
      "out/**",
      ".env",
      "cucumber.js",
    ],
  },

  // JSON files - use JSON plugin only (no TypeScript parsing)
  {
    files: ["**/*.json"],
    ...eslintPluginJson.configs.recommended,
  },

  // Base TypeScript config (TS/JS files only)
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.mjs", "**/*.cjs"],
    extends: [...tseslint.configs.recommended],
    languageOptions: {
      parserOptions: {
        sourceType: "module",
        projectService: {
          allowDefaultProject: [
            "eslint.config.mjs",
            "rollup.config.browser.mjs",
            "rollup.config.node.mjs",
          ],
        },
      },
      globals: {
        Promise: true,
      },
    },
    plugins: {
      istanbul: eslintPluginIstanbul,
    },
  },

  // Security (TS/JS files only)
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.mjs", "**/*.cjs"],
    ...eslintPluginSecurity.configs.recommended,
  },

  // Unicorn (TS/JS files only)
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.mjs", "**/*.cjs"],
    ...eslintPluginUnicorn.configs["flat/recommended"],
  },

  // Promise (TS/JS files only)
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.mjs", "**/*.cjs"],
    ...eslintPluginPromise.configs["flat/recommended"],
  },

  // JSDoc (TS/JS files only)
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.mjs", "**/*.cjs"],
    ...eslintPluginJsdoc.configs["flat/recommended"],
  },

  // Prettier (TS/JS files only, must be last preset to override formatting rules)
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.mjs", "**/*.cjs"],
    ...eslintConfigPrettier,
  },

  // Main rules for all TS/JS files
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.mjs", "**/*.cjs"],
    rules: {
      "istanbul/no-ignore-file": "error",
      "istanbul/prefer-ignore-reason": "error",
      "promise/no-callback-in-promise": "off",
      "security/detect-object-injection": "off",
      "unicorn/no-array-reduce": "off",
      "unicorn/explicit-length-check": [
        "error",
        {
          "non-zero": "not-equal",
        },
      ],
      "unicorn/prefer-node-protocol": "off",
      "unicorn/consistent-assert": "off",
      "unicorn/no-array-sort": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
    },
  },

  // Test files override
  {
    files: ["src/test/**/*.ts", "src/test/**/*.js"],
    plugins: {
      ...eslintPluginChaiFriendly.configs.recommendedFlat.plugins,
    },
    languageOptions: {
      globals: {
        expect: true,
        PendingError: true,
      },
    },
    rules: {
      ...eslintPluginChaiFriendly.configs.recommendedFlat.rules,
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "security/detect-non-literal-fs-filename": "off",
      "jsdoc/require-jsdoc": "off",
      "security/detect-object-injection": "off",
      "unicorn/no-array-callback-reference": "off",
      "unicorn/prefer-node-protocol": "off",
      "unicorn/prefer-module": "off",
    },
  },

  // Scripts override
  {
    files: ["scripts/**/*.js", "scripts/**/*.mjs"],
    rules: {
      "unicorn/prefer-top-level-await": "off",
      "promise/catch-or-return": "off",
      "promise/always-return": "off",
    },
  },
);
