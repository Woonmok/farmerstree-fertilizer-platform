export default [
  {
    files: ["**/*.js"],
    languageOptions: { ecmaVersion: 2022, sourceType: "module", globals: { document: true, window: true, navigator: true, URL: true, Blob: true, alert: true, console: true, Date: true, Array: true, Number: true, Math: true, Object: true, String: true, Infinity: true } },
    rules: {
      "no-undef": "error",
      "no-unused-vars": "warn",
      "no-unreachable": "error",
      "no-constant-condition": "error",
      "use-isnan": "error",
      "eqeqeq": "warn",
      "no-dupe-keys": "error",
    }
  }
];
