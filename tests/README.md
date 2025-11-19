# Test Suite - Kids' Meal Planner

## Overview
Automated end-to-end tests using Playwright to validate critical user flows and catch issues before deployment.

## Setup

### Prerequisites
- Node.js (v16 or higher)
- npm

### Installation
```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install chromium
# Or install all browsers (chromium, firefox, webkit)
npx playwright install
```

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Tests in UI Mode (Interactive)
```bash
npm run test:ui
```

### Run Tests in Debug Mode
```bash
npm run test:debug
```

### Run Tests for Specific Browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Run Specific Test File
```bash
npx playwright test tests/e2e/critical-flows.spec.js
```

### Run Specific Test
```bash
npx playwright test -g "should create a new user profile"
```

## Test Reports

### View HTML Report
After running tests, view the detailed HTML report:
```bash
npm run test:report
```

Or open directly:
```bash
open tests/results/html-report/index.html
```

### Test Results Location
- **HTML Report**: `tests/results/html-report/`
- **JSON Results**: `tests/results/test-results.json`
- **Screenshots**: `test-results/*/test-failed-*.png`
- **Videos**: `test-results/*/video.webm`

## Test Structure

### Test Files
```
tests/
├── e2e/
│   └── critical-flows.spec.js    # Main E2E test suite
├── results/
│   ├── html-report/              # Interactive HTML report
│   └── test-results.json         # Machine-readable results
└── README.md                     # This file
```

### Test Suites
1. **Flow 1: Profile Creation** - User profile setup and validation
2. **Flow 2: Password Setup** - Parent password creation
3. **Flow 3: Parent Login** - Authentication flow
4. **Flow 4: Security & Validation** - XSS protection, input sanitization
5. **Flow 5: Module Loading** - Verify all modules load correctly
6. **Error Handling** - Corrupted data, console errors

## Writing Tests

### Example Test
```javascript
test('should do something', async ({ page }) => {
    await page.goto('http://localhost:8000');
    await page.click('button:has-text("Click Me")');
    const result = await page.textContent('#result');
    expect(result).toBe('Success');
});
```

### Best Practices
1. Use `data-testid` attributes for stable selectors
2. Add meaningful test descriptions
3. Clean up state in `beforeEach` hook
4. Take screenshots on failure (automatic)
5. Use page object pattern for complex UIs

## Debugging Tests

### Run with UI
```bash
npx playwright test --ui
```

### Run with Debug Mode
```bash
npx playwright test --debug
```

### Run Headed (Show Browser)
```bash
npx playwright test --headed
```

### Run with Trace
```bash
npx playwright test --trace on
```

Then view trace:
```bash
npx playwright show-trace trace.zip
```

## Continuous Integration

### GitHub Actions (Future)
```yaml
name: E2E Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npx playwright install --with-deps
      - run: npm test
      - uses: actions/upload-artifact@v2
        if: always()
        with:
          name: test-results
          path: tests/results/
```

## Current Test Status

See `docs/development/TEST_RESULTS.md` for latest test run results.

**Last Run**: 2025-11-18
**Pass Rate**: 0% (12/12 failed - expected for initial test setup)

**Known Issues**:
- Test selectors need update to match HTML structure
- Console errors on page load need investigation
- Corrupted data handling needs improvement

## Manual Testing

For manual test flows, see:
- `docs/development/E2E_TEST_PLAN.md` - Comprehensive manual test plan
- `test-runner.html` - Browser-based manual test runner

To run manual tests:
```bash
npm start
# Open http://localhost:8000/test-runner.html
```

## Troubleshooting

### Tests timing out
- Increase timeout in `playwright.config.js`
- Check if server is running on port 8000
- Verify selectors match actual HTML

### Cannot find elements
- Use Playwright Inspector: `npx playwright test --debug`
- Check screenshots in `test-results/`
- Verify element exists in manual testing

### Browser installation issues
```bash
# Reinstall browsers
npx playwright install --force
```

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Test Generation](https://playwright.dev/docs/codegen)

---

## Quick Reference

```bash
# Setup
npm install && npx playwright install chromium

# Run tests
npm test

# View report
npm run test:report

# Debug
npm run test:debug

# Generate new tests
npx playwright codegen http://localhost:8000
```
