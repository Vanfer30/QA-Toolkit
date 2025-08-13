# 🚀 BrowserStack Integration with Cypress

This guide shows you how to run your Gherkin/Cucumber tests on BrowserStack's cloud infrastructure.

## 📋 Prerequisites

1. **BrowserStack Account**: Sign up at [browserstack.com](https://www.browserstack.com)
2. **Access Credentials**: Get your username and access key from [BrowserStack Settings](https://www.browserstack.com/accounts/settings/access-keys)

## 🔧 Setup

### 1. Environment Variables

Create a `.env` file in your project root:

```bash
# Copy the example file
cp browserstack.env.example .env

# Edit with your credentials
BROWSERSTACK_USERNAME=your_actual_username
BROWSERSTACK_ACCESS_KEY=your_actual_access_key
```

### 2. Install Dependencies

```bash
npm install
```

## 🚀 Usage

### Quick Start

```bash
# Run all tests with BrowserStack
npm run test:browserstack

# Run specific feature
npm run test:browserstack:login

# Run all features
npm run test:browserstack:features
```

### Manual Tunnel Management

```bash
# Start BrowserStack Local tunnel
npm run browserstack:tunnel:start

# Stop BrowserStack Local tunnel
npm run browserstack:tunnel:stop
```

## 🌐 BrowserStack Local

BrowserStack Local creates a secure tunnel between your machine and BrowserStack's testing infrastructure.

### How It Works

1. **Tunnel Creation**: Establishes secure connection to BrowserStack
2. **Local Testing**: Your local app becomes accessible to BrowserStack
3. **Cross-Browser Testing**: Tests run on real browsers in the cloud
4. **Results**: Get detailed reports, videos, and screenshots

### Benefits

- ✅ **Real Browsers**: Test on actual browser versions
- ✅ **Multiple OS**: Windows, macOS, Linux support
- ✅ **Mobile Testing**: iOS and Android browsers
- ✅ **Parallel Execution**: Run multiple tests simultaneously
- ✅ **Detailed Reports**: Videos, screenshots, and logs

## 📱 Supported Browsers & Devices

### Desktop Browsers
- **Chrome**: Latest, Latest-1
- **Firefox**: Latest, Latest-1  
- **Edge**: Latest
- **Safari**: Latest

### Operating Systems
- **Windows 10**: Chrome, Firefox, Edge
- **macOS Big Sur**: Chrome, Safari

### Mobile Browsers
- **iOS Safari**: Latest
- **Android Chrome**: Latest

## ⚙️ Configuration

### BrowserStack Config (`browserstack.json`)

```json
{
  "browsers": [...],
  "run_settings": {
    "parallels": 3,
    "build_name": "QA-Toolkit Cypress Tests"
  }
}
```

### Cypress Config (`cypress.browserstack.config.ts`)

- Enhanced video recording
- Screenshot capture on failure
- Retry logic for flaky tests
- BrowserStack-specific timeouts

## 🔍 Troubleshooting

### Common Issues

1. **Tunnel Connection Failed**
   ```bash
   # Check your credentials
   echo $BROWSERSTACK_ACCESS_KEY
   echo $BROWSERSTACK_USERNAME
   ```

2. **Tests Not Running**
   ```bash
   # Verify tunnel is running
   npm run browserstack:tunnel:start
   
   # Check logs
   tail -f browserstack-local.log
   ```

3. **Local App Not Accessible**
   - Ensure your app is running on the configured port
   - Check firewall settings
   - Verify the `baseUrl` in `cypress.browserstack.config.ts`

### Debug Mode

```bash
# Enable verbose logging
BROWSERSTACK_LOCAL_VERBOSE=true npm run test:browserstack
```

## 📊 Test Results

### Where to Find Results

1. **Local Results**: `cypress/results/`
2. **BrowserStack Dashboard**: [Automate Dashboard](https://automate.browserstack.com/dashboard)
3. **Videos**: Automatically recorded and stored
4. **Screenshots**: Captured on test failures

### Result Types

- **Mochawesome Reports**: HTML and JSON reports
- **Video Recordings**: MP4 files of test execution
- **Screenshots**: PNG files of test failures
- **Console Logs**: Detailed execution logs

## 🚀 CI/CD Integration

### GitHub Actions

```yaml
- name: Run BrowserStack Tests
  env:
    BROWSERSTACK_USERNAME: ${{ secrets.BROWSERSTACK_USERNAME }}
    BROWSERSTACK_ACCESS_KEY: ${{ secrets.BROWSERSTACK_ACCESS_KEY }}
  run: npm run test:browserstack
```

### Environment Variables in CI

- `BROWSERSTACK_USERNAME`: Your BrowserStack username
- `BROWSERSTACK_ACCESS_KEY`: Your BrowserStack access key

## 💡 Best Practices

1. **Parallel Execution**: Use `parallels: 3` for faster execution
2. **Retry Logic**: Enable retries for flaky tests
3. **Video Recording**: Keep videos for debugging
4. **Screenshots**: Capture failures for analysis
5. **Local Tunnel**: Always use BrowserStack Local for secure testing

## 🔗 Useful Links

- [BrowserStack Documentation](https://www.browserstack.com/docs)
- [Cypress Documentation](https://docs.cypress.io)
- [BrowserStack Local](https://www.browserstack.com/local-testing)
- [Automate Dashboard](https://automate.browserstack.com/dashboard)

## 🆘 Support

- **BrowserStack Support**: [support.browserstack.com](https://support.browserstack.com)
- **Cypress Support**: [docs.cypress.io](https://docs.cypress.io)
- **Project Issues**: Create an issue in this repository
