const BrowserStackLocal = require('browserstack-local');

// BrowserStack Local instance
const bsLocal = new BrowserStackLocal.Local();

// BrowserStack Local Arguments
const bsLocalArgs = {
  'key': process.env.BROWSERSTACK_ACCESS_KEY,
  'forceLocal': true,
  'force': true,
  'verbose': true,
  'logFile': './browserstack-local.log'
};

// Method to start the Local instance
const startLocal = () => {
  return new Promise((resolve, reject) => {
    bsLocal.start(bsLocalArgs, (error) => {
      if (error) {
        console.log('BrowserStack Local Error:', error);
        reject(error);
      } else {
        console.log('BrowserStack Local is running');
        resolve();
      }
    });
  });
};

// Method to stop the Local instance
const stopLocal = () => {
  return new Promise((resolve) => {
    if (bsLocal.isRunning()) {
      bsLocal.stop(() => {
        console.log('BrowserStack Local stopped');
        resolve();
      });
    } else {
      resolve();
    }
  });
};

// Handle process termination
process.on('SIGINT', async () => {
  console.log('\nStopping BrowserStack Local...');
  await stopLocal();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\nStopping BrowserStack Local...');
  await stopLocal();
  process.exit(0);
});

module.exports = {
  startLocal,
  stopLocal,
  bsLocal
};
