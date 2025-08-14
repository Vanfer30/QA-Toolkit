import { defineConfig } from 'cypress';
import { addCucumberPreprocessorPlugin } from '@badeball/cypress-cucumber-preprocessor';
import { createBundler } from '@bahmutov/cypress-esbuild-preprocessor';

export default defineConfig({
  e2e: {
    specPattern: 'cypress/e2e/**/*.{cy.{js,jsx,ts,tsx},feature}',
    supportFile: 'cypress/support/e2e.ts',
    stepDefinitions: 'cypress/support/step_definitions/**/*.ts',
    
    // BrowserStack specific configuration
    baseUrl: 'http://localhost:3000', // Update this to your app URL
    
    // BrowserStack Local tunnel configuration
    env: {
      browserstack: true,
      browserstackLocal: true,
      browserstackLocalIdentifier: 'qa-toolkit-local'
    },

    // Enhanced video and screenshot settings for BrowserStack
    video: true,
    videoCompression: 32,
    screenshotOnRunFailure: true,
    trashAssetsBeforeRuns: true,

    // BrowserStack specific viewport and user agent
    viewportWidth: 1920,
    viewportHeight: 1080,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',

    // Enhanced retry logic for BrowserStack
    retries: {
      runMode: 2,
      openMode: 0
    },

    // BrowserStack specific timeouts
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,

    async setupNodeEvents(on, config) {
      await addCucumberPreprocessorPlugin(on, config);
      
      on("file:preprocessor", createBundler({
        plugins: [
          require('@badeball/cypress-cucumber-preprocessor/esbuild').createEsbuildPlugin(config)
        ]
      }));

      // BrowserStack specific event handlers
      on('task', {
        // Log BrowserStack session info
        log(message) {
          console.log(message);
          return null;
        },
        // Get BrowserStack session info
        getSessionInfo() {
          return null;
        }
      });

      return config;
    },
  },

  // Component testing configuration for BrowserStack
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
    specPattern: 'cypress/component/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/component.ts',
  },

  // BrowserStack specific reporter
  reporter: 'mochawesome',
  reporterOptions: {
    reportDir: 'cypress/results',
    overwrite: false,
    html: false,
    json: true
  }
});

