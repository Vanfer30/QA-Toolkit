const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    specPattern: "cypress/e2e/**/*.{cy.{js,jsx,ts,tsx},feature}",
    supportFile: 'cypress/support/e2e.ts',
    stepDefinitions: [
      "cypress/e2e/step-definitions/**/*.{js,ts}"
    ],
    async setupNodeEvents(on, config) {
      const { addCucumberPreprocessorPlugin } = require('@badeball/cypress-cucumber-preprocessor');
      const createBundler = require('@bahmutov/cypress-esbuild-preprocessor');
      
      await addCucumberPreprocessorPlugin(on, config);
      
      on("file:preprocessor", createBundler({
        plugins: [
          require('@badeball/cypress-cucumber-preprocessor/esbuild').createEsbuildPlugin(config)
        ]
      }));
      
      return config;
    },
  },
});
