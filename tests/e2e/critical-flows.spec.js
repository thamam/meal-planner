/**
 * End-to-End Tests for Critical User Flows
 * Kids' Meal Planner Application
 *
 * Run with: npx playwright test
 */

const { test, expect } = require('@playwright/test');

// Test configuration
const APP_URL = 'http://localhost:8000';

// Test data
const TEST_USER = {
    name: 'Test User',
    age: '8',
    avatar: '🦁'
};

const TEST_PASSWORD = 'TestPass123';

/**
 * Setup: Clear storage before each test
 */
test.beforeEach(async ({ page }) => {
    await page.goto(APP_URL);
    await page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
    });
    await page.reload();
});

/**
 * FLOW 1: First-Time User - Profile Creation
 * Priority: CRITICAL
 */
test.describe('Flow 1: Profile Creation', () => {
    test('should create a new user profile successfully', async ({ page }) => {
        await page.goto(APP_URL);

        // Wait for app to load
        await page.waitForSelector('.container', { timeout: 5000 });

        // Check if profile creation button/modal appears
        const hasProfileButton = await page.locator('button:has-text("Create Profile")').isVisible()
            .catch(() => false);

        if (hasProfileButton) {
            await page.click('button:has-text("Create Profile")');
        }

        // Wait for profile modal
        await page.waitForSelector('#profileName', { timeout: 5000 });

        // Fill in profile details
        await page.fill('#profileName', TEST_USER.name);
        await page.fill('#profileAge', TEST_USER.age);

        // Select avatar
        const avatarButton = page.locator(`button[data-emoji="${TEST_USER.avatar}"]`);
        if (await avatarButton.count() > 0) {
            await avatarButton.click();
        } else {
            // Fallback: click first available avatar
            await page.locator('.avatar-grid button').first().click();
        }

        // Save profile
        await page.click('button:has-text("Save")');

        // Wait for modal to close (check if modal is gone)
        await page.waitForSelector('#profileModal', { state: 'hidden', timeout: 5000 })
            .catch(() => page.waitForTimeout(2000)); // Fallback wait

        // Verify profile is saved
        const savedUser = await page.evaluate(() => {
            const user = localStorage.getItem('currentUser');
            return user ? JSON.parse(user) : null;
        });

        expect(savedUser).toBeTruthy();
        expect(savedUser.name).toBe(TEST_USER.name);
        expect(savedUser.age).toBe(parseInt(TEST_USER.age));

        // Verify UI shows user info
        const userName = await page.textContent('.user-name, [data-testid="user-name"]')
            .catch(() => '');
        expect(userName).toContain(TEST_USER.name);
    });

    test('should validate name (reject empty)', async ({ page }) => {
        await page.goto(APP_URL);
        await page.waitForSelector('.container', { timeout: 5000 });

        // Open profile modal if needed
        const hasProfileButton = await page.locator('button:has-text("Create Profile")').isVisible()
            .catch(() => false);
        if (hasProfileButton) {
            await page.click('button:has-text("Create Profile")');
        }

        await page.waitForSelector('#profileName', { timeout: 5000 });

        // Try to save with empty name
        await page.fill('#profileName', '');
        await page.fill('#profileAge', '8');
        await page.click('button:has-text("Save")');

        // Should see error or modal should stay open
        await page.waitForTimeout(1000);

        const modalStillVisible = await page.locator('#profileModal').isVisible()
            .catch(() => false);

        expect(modalStillVisible).toBeTruthy(); // Modal should not close
    });

    test('should validate age (reject out of range)', async ({ page }) => {
        await page.goto(APP_URL);
        await page.waitForSelector('.container', { timeout: 5000 });

        const hasProfileButton = await page.locator('button:has-text("Create Profile")').isVisible()
            .catch(() => false);
        if (hasProfileButton) {
            await page.click('button:has-text("Create Profile")');
        }

        await page.waitForSelector('#profileName', { timeout: 5000 });

        // Try with age too young
        await page.fill('#profileName', 'Test User');
        await page.fill('#profileAge', '3');
        await page.click('button:has-text("Save")');

        await page.waitForTimeout(1000);
        const modalStillVisible = await page.locator('#profileModal').isVisible()
            .catch(() => false);

        expect(modalStillVisible).toBeTruthy();
    });
});

/**
 * FLOW 2: Parent Password Setup (First Time)
 * Priority: CRITICAL
 */
test.describe('Flow 2: Password Setup', () => {
    test.beforeEach(async ({ page }) => {
        // Create a profile first
        await page.goto(APP_URL);
        await page.evaluate((user) => {
            localStorage.setItem('currentUser', JSON.stringify({
                name: user.name,
                age: parseInt(user.age),
                avatar: user.avatar,
                id: 'test-user-' + Date.now()
            }));
        }, TEST_USER);
        await page.reload();
    });

    test('should reject short passwords', async ({ page }) => {
        // Click Parent tab
        await page.click('button:has-text("Parent"), [data-tab="parent"]').catch(() =>
            page.click('text=Parent').catch(() => {})
        );

        // Wait for password modal
        await page.waitForSelector('input[type="password"]', { timeout: 5000 });

        // Enter short password
        await page.fill('input[type="password"]', 'abc');
        await page.click('button:has-text("OK")');

        // Should show error or modal should stay open
        await page.waitForTimeout(1000);

        const errorVisible = await page.locator('text=/too short|at least 6/i').isVisible()
            .catch(() => false);

        expect(errorVisible).toBeTruthy();
    });

    test('should accept valid password', async ({ page }) => {
        // Click Parent tab
        await page.click('button:has-text("Parent"), [data-tab="parent"]').catch(() =>
            page.click('text=Parent')
        );

        await page.waitForSelector('input[type="password"]', { timeout: 5000 });

        // Enter valid password
        await page.fill('input[type="password"]', TEST_PASSWORD);
        await page.click('button:has-text("OK")');

        // Wait for confirmation modal
        await page.waitForTimeout(1000);

        // Should ask for confirmation
        const confirmVisible = await page.locator('input[type="password"]').isVisible()
            .catch(() => false);

        if (confirmVisible) {
            // Enter same password for confirmation
            await page.fill('input[type="password"]', TEST_PASSWORD);
            await page.click('button:has-text("OK")');

            // Wait for success
            await page.waitForTimeout(2000);
        }

        // Verify password was saved
        const hashedPassword = await page.evaluate(() => {
            return localStorage.getItem('parentPassword');
        });

        expect(hashedPassword).toBeTruthy();
        expect(hashedPassword).not.toBe(TEST_PASSWORD); // Should be hashed
    });
});

/**
 * FLOW 3: Parent Login (Returning User)
 * Priority: CRITICAL
 */
test.describe('Flow 3: Parent Login', () => {
    test.beforeEach(async ({ page }) => {
        // Setup: Create profile and password
        await page.goto(APP_URL);
        await page.evaluate(async (data) => {
            // Set user
            localStorage.setItem('currentUser', JSON.stringify({
                name: data.user.name,
                age: parseInt(data.user.age),
                avatar: data.user.avatar,
                id: 'test-user-' + Date.now()
            }));

            // Hash password (SHA-256)
            const encoder = new TextEncoder();
            const data_buffer = encoder.encode(data.password);
            const hash = await crypto.subtle.digest('SHA-256', data_buffer);
            const hashArray = Array.from(new Uint8Array(hash));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

            localStorage.setItem('parentPassword', hashHex);
            sessionStorage.clear(); // No active session
        }, { user: TEST_USER, password: TEST_PASSWORD });

        await page.reload();
    });

    test('should reject wrong password', async ({ page }) => {
        // Click Parent tab
        await page.click('button:has-text("Parent"), [data-tab="parent"]').catch(() =>
            page.click('text=Parent')
        );

        await page.waitForSelector('input[type="password"]', { timeout: 5000 });

        // Enter wrong password
        await page.fill('input[type="password"]', 'WrongPassword123');
        await page.click('button:has-text("OK")');

        await page.waitForTimeout(1000);

        // Should show error
        const errorVisible = await page.locator('text=/incorrect|wrong|invalid/i').isVisible()
            .catch(() => false);

        expect(errorVisible).toBeTruthy();
    });

    test('should accept correct password', async ({ page }) => {
        // Click Parent tab
        await page.click('button:has-text("Parent"), [data-tab="parent"]').catch(() =>
            page.click('text=Parent')
        );

        await page.waitForSelector('input[type="password"]', { timeout: 5000 });

        // Enter correct password
        await page.fill('input[type="password"]', TEST_PASSWORD);
        await page.click('button:has-text("OK")');

        await page.waitForTimeout(2000);

        // Verify session created
        const session = await page.evaluate(() => {
            return sessionStorage.getItem('parentAuthenticated');
        });

        expect(session).toBeTruthy();
    });
});

/**
 * FLOW 4: Input Validation & Security
 * Priority: CRITICAL
 */
test.describe('Flow 4: Security & Validation', () => {
    test('should sanitize XSS attempts in name', async ({ page }) => {
        await page.goto(APP_URL);
        await page.waitForSelector('.container', { timeout: 5000 });

        const hasProfileButton = await page.locator('button:has-text("Create Profile")').isVisible()
            .catch(() => false);
        if (hasProfileButton) {
            await page.click('button:has-text("Create Profile")');
        }

        await page.waitForSelector('#profileName', { timeout: 5000 });

        // Try XSS attack
        const xssPayload = '<script>alert("xss")</script>';
        await page.fill('#profileName', xssPayload);
        await page.fill('#profileAge', '8');

        // Select avatar
        await page.locator('.avatar-grid button').first().click();

        await page.click('button:has-text("Save")');
        await page.waitForTimeout(2000);

        // Verify input was sanitized
        const savedUser = await page.evaluate(() => {
            const user = localStorage.getItem('currentUser');
            return user ? JSON.parse(user) : null;
        });

        if (savedUser) {
            expect(savedUser.name).not.toContain('<script>');
            expect(savedUser.name).not.toContain('alert');
        }
    });

    test('should hash passwords before storage', async ({ page }) => {
        await page.goto(APP_URL);

        // Setup profile
        await page.evaluate((user) => {
            localStorage.setItem('currentUser', JSON.stringify({
                name: user.name,
                age: parseInt(user.age),
                avatar: user.avatar,
                id: 'test-user-' + Date.now()
            }));
        }, TEST_USER);
        await page.reload();

        // Try to set password
        await page.click('button:has-text("Parent"), [data-tab="parent"]').catch(() =>
            page.click('text=Parent')
        );

        await page.waitForSelector('input[type="password"]', { timeout: 5000 });
        await page.fill('input[type="password"]', TEST_PASSWORD);
        await page.click('button:has-text("OK")');

        await page.waitForTimeout(1000);

        // Handle confirmation if it appears
        const confirmVisible = await page.locator('input[type="password"]').isVisible()
            .catch(() => false);
        if (confirmVisible) {
            await page.fill('input[type="password"]', TEST_PASSWORD);
            await page.click('button:has-text("OK")');
            await page.waitForTimeout(2000);
        }

        // Check password is hashed
        const storedPassword = await page.evaluate(() => {
            return localStorage.getItem('parentPassword');
        });

        if (storedPassword) {
            expect(storedPassword).not.toBe(TEST_PASSWORD); // Not plain text
            expect(storedPassword.length).toBeGreaterThan(30); // Hashed value is long
        }
    });
});

/**
 * FLOW 5: Module Availability
 * Priority: HIGH
 */
test.describe('Flow 5: Module Loading', () => {
    test('should load all required modules', async ({ page }) => {
        await page.goto(APP_URL);
        await page.waitForTimeout(2000); // Wait for modules to load

        const modules = await page.evaluate(() => {
            const requiredModules = [
                'Security',
                'Modal',
                'ErrorHandler',
                'Auth',
                'Sounds',
                'i18n'
            ];

            const results = {};
            for (const moduleName of requiredModules) {
                results[moduleName] = typeof window[moduleName] !== 'undefined';
            }
            return results;
        });

        // Verify all modules loaded
        for (const [moduleName, loaded] of Object.entries(modules)) {
            expect(loaded).toBeTruthy(`Module ${moduleName} should be loaded`);
        }
    });
});

/**
 * Error Handling Tests
 */
test.describe('Error Handling', () => {
    test('should handle corrupted localStorage data', async ({ page }) => {
        await page.goto(APP_URL);

        // Inject corrupted data
        await page.evaluate(() => {
            localStorage.setItem('currentUser', 'CORRUPTED{{{JSON');
        });

        // Reload page - should not crash
        await page.reload();
        await page.waitForTimeout(2000);

        // App should still be functional
        const containerVisible = await page.locator('.container').isVisible();
        expect(containerVisible).toBeTruthy();
    });

    test('should not crash on console errors', async ({ page }) => {
        const consoleErrors = [];
        page.on('console', msg => {
            if (msg.type() === 'error') {
                consoleErrors.push(msg.text());
            }
        });

        await page.goto(APP_URL);
        await page.waitForTimeout(3000);

        // Should have minimal or no console errors
        expect(consoleErrors.length).toBeLessThan(5);
    });
});
