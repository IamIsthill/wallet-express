import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";
import eslintPluginUnicorn from 'eslint-plugin-unicorn'


export default defineConfig([
    {
        files: ["**/*.{js,mjs,cjs,ts}"],
        plugins: { js, },
        extends: ["js/recommended"],
    },
    {
        files: ["**/*.{js,mjs,cjs,ts}"],
        languageOptions: { globals: globals.browser }
    },
    eslintPluginUnicorn.configs.all,
    {
        rules: {
            'unicorn/better-regex': 'warn',
        },
        ignores: [
            "src/infrastructure/mongo/repositories/mongo-account-repository.ts",
            "src/infrastructure/mongo/repositories/mongo-transaction-repository.ts"
        ]
    },
    tseslint.configs.recommended,
    tseslint.configs.stylistic,
    globalIgnores([
        "src/infrastructure/mongo/repositories/mongo-account-repository.ts",
        "src/infrastructure/mongo/repositories/mongo-transaction-repository.ts"
    ]),
]);
