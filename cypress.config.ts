import { defineConfig } from "cypress";
import react from "@vitejs/plugin-react";

export default defineConfig({
  projectId: "r926s1",

  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
      viteConfig: {
        plugins: [react()],
      },
    },
    specPattern: "cypress/component/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/component.js",
    indexHtmlFile: "cypress/support/component-index.html",
  },

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  
  reporter: 'mochawesome',
  reporterOptions: {
    reportDir: 'cypress/results',
    overwrite: false,
    html: false,
    json: true
  }
});
