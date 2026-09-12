export default [
  {
    files: ["**/*.js", "**/*.mjs"],
    ignores: ["node_modules/**", "uploads/**", "playwright-report/**", "test-results/**"],
    languageOptions: { ecmaVersion: 2024, sourceType: "module", globals: { process: "readonly", console: "readonly", Buffer: "readonly", URL: "readonly", URLSearchParams: "readonly", fetch: "readonly", performance: "readonly", setInterval: "readonly", clearInterval: "readonly", setTimeout: "readonly" } },
    rules: {
      "no-unused-vars": ["error", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }],
      "no-undef": "error"
    }
  },
  {
    files: ["tests/**/*.spec.mjs"],
    languageOptions: { globals: { document: "readonly", window: "readonly" } }
  }
];
