#!/usr/bin/env node

const { execSync } = require('child_process');
const { startLocal, stopLocal } = require('./browserstack-tunnel');

async function runBrowserStackTests() {
  console.log('🚀 Starting BrowserStack Local tunnel...');
  
  try {
    // Start BrowserStack Local tunnel
    await startLocal();
    
    console.log('✅ BrowserStack Local tunnel is running');
    console.log('🌐 Running Cypress tests with BrowserStack integration...');
    
    // Wait a moment for tunnel to stabilize
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Run Cypress tests with BrowserStack config
    execSync('npx cypress run --config-file cypress.browserstack.config.ts', {
      stdio: 'inherit',
      env: {
        ...process.env,
        BROWSERSTACK_ACCESS_KEY: process.env.BROWSERSTACK_ACCESS_KEY,
        BROWSERSTACK_USERNAME: process.env.BROWSERSTACK_USERNAME
      }
    });
    
    console.log('✅ All tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Error running tests:', error.message);
    process.exit(1);
  } finally {
    console.log('🛑 Stopping BrowserStack Local tunnel...');
    await stopLocal();
    console.log('✅ BrowserStack Local tunnel stopped');
  }
}

// Check if required environment variables are set
if (!process.env.BROWSERSTACK_ACCESS_KEY || !process.env.BROWSERSTACK_USERNAME) {
  console.error('❌ Missing required environment variables:');
  console.error('   - BROWSERSTACK_ACCESS_KEY');
  console.error('   - BROWSERSTACK_USERNAME');
  console.error('');
  console.error('Please set these in your environment or create a .env file');
  process.exit(1);
}

// Run the tests
runBrowserStackTests();
