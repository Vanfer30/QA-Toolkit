import { defineConfig } from 'cypress';
import react from '@vitejs/plugin-react';
import createBundler from "@bahmutov/cypress-esbuild-preprocessor";
import { addCucumberPreprocessorPlugin } from "@badeball/cypress-cucumber-preprocessor";

export default defineConfig({
  projectId: 'r926s1',

  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
      viteConfig: { plugins: [react()] },
    },
    specPattern: 'cypress/component/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/component.ts',
    indexHtmlFile: 'cypress/support/component-index.html',
  },

  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: "cypress/e2e/**/*.{cy.{js,jsx,ts,tsx},feature}", 
    supportFile: 'cypress/support/e2e.ts',
    async setupNodeEvents(on, config) {
      await addCucumberPreprocessorPlugin(on, config);
      
      on("file:preprocessor", createBundler({
        plugins: [
          require('@badeball/cypress-cucumber-preprocessor/esbuild').createEsbuildPlugin(config)
        ]
      }));
      
      return config;
    },
    reporter: 'mochawesome',
    reporterOptions: {
      reportDir: 'cypress/results',
      overwrite: false,
      html: false,
      json: true,
    },
  },
});

