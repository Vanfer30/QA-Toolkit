const { defineConfig } = require("cypress")
module.exports = defineConfig({

  // Global Cypress configuration options can be defined here
  env: {
    Live: "",
    Beta: "",
  },

  e2e: {
    chromeWebSecurity: false,
    numTestsKeptInMemory: 1,
    experimentalMemoryManagement: true,
    retries: {
      experimentalStrategy: "detect-flake-and-pass-on-threshold",
      experimentalOptions: {
        maxRetries: 2,
        passesRequired: 2,
      },
      openMode: true, // Should be true or false
      runMode: true, // Should be true or false
    },
    animationDistanceThreshold: 5,
    arch: "x64",
    browsers: [
      {
        name: "chrome",
        family: "chromium",
        channel: "stable",
        displayName: "Chrome",
        version: "124.0.6367.61",
        path: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", // Corrected path with double backslashes
        minSupportedVersion: 64,
        majorVersion: "124",
      },
      {
        name: "firefox",
        family: "firefox",
        channel: "stable",
        displayName: "Firefox",
        version: "121.0.1",
        path: "C:\\Program Files\\Mozilla Firefox\\firefox.exe", // Corrected path with double backslashes
        minSupportedVersion: 86,
        majorVersion: "121",
      },
      {
        name: "edge",
        family: "chromium",
        channel: "stable",
        displayName: "Edge",
        version: "124.0.2478.51",
        path: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe", // Corrected path with double backslashes
        minSupportedVersion: 79,
        majorVersion: "124",
      },
      {
        name: "electron",
        channel: "stable",
        family: "chromium",
        displayName: "Electron",
        version: "118.0.5993.159",
        path: "",
        majorVersion: 118,
      },
      {
        name: "webkit",
        family: "webkit",
        channel: "stable",
        displayName: "WebKit",
        version: "latest",
        path: "", // WebKit doesn't need a path, it's bundled with Cypress
        majorVersion: "latest",
      },
    ],
    clientCertificates: [],
    defaultCommandTimeout: 4000,
    downloadsFolder: "cypress/downloads",
    execTimeout: 60000,
    experimentalCspAllowList: false,
    experimentalFetchPolyfill: false,
    experimentalInteractiveRunEvents: false,
    experimentalModifyObstructiveThirdPartyCode: false,
    experimentalOriginDependencies: false,
    experimentalRunAllSpecs: true,
    experimentalSourceRewriting: false,
    experimentalStudio: false,
    experimentalWebKitSupport: true, // Enable experimental WebKit support
    fileServerFolder: "",
    fixturesFolder: "cypress/fixtures",
    hosts: null,
    includeShadowDom: false,
    isInteractive: true,
    keystrokeDelay: 0,
    modifyObstructiveCode: true,
    pageLoadTimeout: 60000,
    platform: "win32",
    port: null,
    redirectionLimit: 20,
    reporter: "spec",
    reporterOptions: null,
    requestTimeout: 5000,
    resolvedNodePath: null,
    resolvedNodeVersion: null,
    responseTimeout: 30000,
    screenshotOnRunFailure: true,
    screenshotsFolder: "cypress/screenshots",
    scrollBehavior: "top",
    slowTestThreshold: 10000,
    specPattern: [ "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",       
    'cypress/api/**/*.cy.{js,ts}',  'cypress/component/**/*.cy.{js,ts,jsx,tsx}',    // 👈 Add this line for API tests
    ],
    supportFile: "cypress/support/e2e.{js,jsx,ts,tsx}",
    supportFolder: false,
    taskTimeout: 60000,
    testingType: "e2e",
    testIsolation: true,
    trashAssetsBeforeRuns: true,
    userAgent: null,
    video: false,
    videoCompression: false,
    videosFolder: "cypress/videos",
    desktopviewportHeight: 1080,
    desktopviewportWidth: 1920,
    waitForAnimations: true,
    watchForFileChanges: true,
  },

  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },

  },
});
