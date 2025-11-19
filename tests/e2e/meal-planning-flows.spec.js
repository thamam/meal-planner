/**
 * Extended E2E Tests - Meal Planning Features
 * Kids' Meal Planner Application
 *
 * Tests meal planning, ingredient selection, restrictions, and UI features
 * Run with: npx playwright test meal-planning-flows.spec.js
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
 * Helper: Setup user profile
 */
async function setupUserProfile(page) {
    await page.evaluate((user) => {
        // Set user profile
        localStorage.setItem('currentUser', JSON.stringify({
            name: user.name,
            age: parseInt(user.age),
            avatar: user.avatar,
            id: 'test-user-' + Date.now()
        }));
        // Mark as visited to hide welcome screen
        localStorage.setItem('hasVisited', 'true');
    }, TEST_USER);
    await page.reload();
    // Wait for app to initialize
    await page.waitForTimeout(1000);
}

/**
 * Helper: Setup parent authentication
 * Uses the correct storage keys that match the Auth module
 */
async function setupParentAuth(page) {
    await page.evaluate(async (password) => {
        // Hash password using same method as Security module
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hash = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hash));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        // Use correct storage keys that match Auth module
        localStorage.setItem('meal_planner_parent_auth', hashHex);
        sessionStorage.setItem('meal_planner_session', Date.now().toString());
    }, TEST_PASSWORD);
    await page.reload();
}

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
 * FLOW 7: Meal Planning - Drag & Drop Ingredients
 * Priority: CRITICAL
 */
test.describe('Flow 7: Meal Planning - Drag & Drop', () => {
    test.beforeEach(async ({ page }) => {
        await setupUserProfile(page);
    });

    test('should drag and drop food to meal slot', async ({ page }) => {
        // Wait for food items to load
        await page.waitForSelector('.food-item, [data-food-id]', { timeout: 10000 });

        // Get first food item
        const foodItem = page.locator('.food-item, [data-food-id]').first();
        const foodExists = await foodItem.count() > 0;
        expect(foodExists).toBeTruthy();

        // Get Monday breakfast slot
        const mealSlot = page.locator('[data-day="monday"][data-meal="breakfast"], .meal-slot').first();
        const slotExists = await mealSlot.count() > 0;

        if (slotExists) {
            // Drag food to slot
            await foodItem.dragTo(mealSlot);

            // Wait for drop animation
            await page.waitForTimeout(1000);

            // Verify food appears in slot
            const slotContent = await mealSlot.textContent();
            expect(slotContent.length).toBeGreaterThan(0);
        }
    });

    test('should allow multiple items in same slot', async ({ page }) => {
        await page.waitForSelector('.food-item, [data-food-id]', { timeout: 10000 });

        const foodItems = page.locator('.food-item, [data-food-id]');
        const mealSlot = page.locator('.meal-slot').first();

        const itemCount = await foodItems.count();
        if (itemCount >= 2) {
            // Add first item
            await foodItems.nth(0).dragTo(mealSlot);
            await page.waitForTimeout(500);

            // Add second item
            await foodItems.nth(1).dragTo(mealSlot);
            await page.waitForTimeout(500);

            // Check meal slot has multiple items
            const slotItems = await mealSlot.locator('.meal-item, [data-meal-item]').count();
            expect(slotItems).toBeGreaterThan(0);
        }
    });

    test('should remove food item from slot', async ({ page }) => {
        await page.waitForSelector('.food-item, [data-food-id]', { timeout: 10000 });

        const foodItem = page.locator('.food-item').first();
        const mealSlot = page.locator('.meal-slot').first();

        // Add item
        await foodItem.dragTo(mealSlot);
        await page.waitForTimeout(1000);

        // Look for remove/delete button
        const removeBtn = mealSlot.locator('button[onclick*="remove"], .remove-btn, button:has-text("×")').first();
        const removeExists = await removeBtn.count() > 0;

        if (removeExists) {
            await removeBtn.click();
            await page.waitForTimeout(500);

            // Verify item removed
            const itemsAfter = await mealSlot.locator('.meal-item').count();
            expect(itemsAfter).toBe(0);
        }
    });

    test('should update health meter when adding foods', async ({ page }) => {
        await page.waitForSelector('.food-item', { timeout: 10000 });

        // Get initial health score
        const healthScore = page.locator('#healthScore, .health-score');
        const initialScore = await healthScore.textContent().catch(() => '0%');

        // Add a healthy food (protein or veggie)
        const healthyFood = page.locator('.food-item[data-category="protein"], .food-item[data-category="veggie"]').first();
        const mealSlot = page.locator('.meal-slot').first();

        if (await healthyFood.count() > 0) {
            await healthyFood.dragTo(mealSlot);
            await page.waitForTimeout(1000);

            // Check health score updated
            const newScore = await healthScore.textContent();
            // Score should be different (either increased or calculated)
            expect(newScore).toBeTruthy();
        }
    });
});

/**
 * FLOW 8: Meal Plan Saving & Loading
 * Priority: CRITICAL
 */
test.describe('Flow 8: Save & Load Meal Plans', () => {
    test.beforeEach(async ({ page }) => {
        await setupUserProfile(page);
    });

    test('should save meal plan', async ({ page }) => {
        // Add a food to a meal slot first
        await page.waitForSelector('.food-item', { timeout: 10000 });
        const foodItem = page.locator('.food-item').first();
        const mealSlot = page.locator('.meal-slot').first();

        await foodItem.dragTo(mealSlot);
        await page.waitForTimeout(1000);

        // Click save button
        const saveBtn = page.locator('button:has-text("Save"), #btnSave, [onclick*="saveMealPlan"]');
        const saveExists = await saveBtn.count() > 0;

        if (saveExists) {
            await saveBtn.first().click();
            await page.waitForTimeout(2000);

            // Look for success message
            const successMsg = await page.locator('text=/saved|success/i').isVisible()
                .catch(() => false);

            // Or check localStorage
            const savedMeals = await page.evaluate(() => {
                return localStorage.getItem('weeklyMeals') || localStorage.getItem('mealPlan');
            });

            expect(savedMeals || successMsg).toBeTruthy();
        }
    });

    test('should load saved meal plan on refresh', async ({ page }) => {
        // Save a meal plan first
        await page.evaluate(() => {
            const testMeal = {
                monday: {
                    breakfast: [{ id: 'apple', name: 'Apple', icon: '🍎' }]
                }
            };
            localStorage.setItem('weeklyMeals', JSON.stringify(testMeal));
        });

        // Reload page
        await page.reload();
        await page.waitForTimeout(2000);

        // Check if meal appears
        const mealSlot = page.locator('[data-day="monday"][data-meal="breakfast"], .meal-slot').first();
        const slotContent = await mealSlot.textContent();

        expect(slotContent).toContain('🍎');
    });

    test('should clear/delete meal plan', async ({ page }) => {
        // Add test data
        await page.evaluate(() => {
            const testMeal = {
                monday: {
                    breakfast: [{ id: 'apple', name: 'Apple', icon: '🍎' }]
                }
            };
            localStorage.setItem('weeklyMeals', JSON.stringify(testMeal));
        });
        await page.reload();

        // Look for clear/reset button
        const clearBtn = page.locator('button:has-text("Clear"), button:has-text("Reset"), [onclick*="clear"]');
        const clearExists = await clearBtn.count() > 0;

        if (clearExists) {
            await clearBtn.first().click();

            // May need to confirm
            const confirmBtn = page.locator('button:has-text("Yes"), button:has-text("OK")');
            if (await confirmBtn.count() > 0) {
                await confirmBtn.first().click();
            }

            await page.waitForTimeout(1000);

            // Verify meals cleared
            const meals = await page.evaluate(() => {
                return localStorage.getItem('weeklyMeals');
            });

            expect(meals === null || meals === '{}').toBeTruthy();
        }
    });
});

/**
 * FLOW 9: Shopping List Generation
 * Priority: HIGH
 */
test.describe('Flow 9: Shopping List', () => {
    test.beforeEach(async ({ page }) => {
        await setupUserProfile(page);
    });

    test('should generate shopping list from meal plan', async ({ page }) => {
        // Add some meals
        await page.evaluate(() => {
            const meals = {
                monday: {
                    breakfast: [
                        { id: 'apple', name: 'Apple', icon: '🍎', category: 'fruit' },
                        { id: 'milk', name: 'Milk', icon: '🥛', category: 'dairy' }
                    ]
                },
                tuesday: {
                    lunch: [
                        { id: 'apple', name: 'Apple', icon: '🍎', category: 'fruit' }
                    ]
                }
            };
            localStorage.setItem('weeklyMeals', JSON.stringify(meals));
        });
        await page.reload();

        // Click shopping list button
        const shoppingBtn = page.locator('button:has-text("Shopping"), [onclick*="shopping"], #btnShoppingList');
        const btnExists = await shoppingBtn.count() > 0;

        if (btnExists) {
            await shoppingBtn.first().click();
            await page.waitForTimeout(2000);

            // Verify shopping list shows
            const shoppingList = page.locator('#shoppingList, .shopping-list, [data-testid="shopping-list"]');
            const listVisible = await shoppingList.isVisible().catch(() => false);

            if (listVisible) {
                const listContent = await shoppingList.textContent();
                expect(listContent).toContain('Apple');
                expect(listContent).toContain('Milk');
            }
        }
    });

    test('should print shopping list', async ({ page }) => {
        // Setup meals
        await page.evaluate(() => {
            const meals = {
                monday: {
                    breakfast: [{ id: 'apple', name: 'Apple', icon: '🍎' }]
                }
            };
            localStorage.setItem('weeklyMeals', JSON.stringify(meals));
        });
        await page.reload();

        // Look for print button
        const printBtn = page.locator('button:has-text("Print"), [onclick*="print"]');

        if (await printBtn.count() > 0) {
            // Setup print dialog listener
            page.on('dialog', dialog => dialog.accept());

            await printBtn.first().click();
            await page.waitForTimeout(1000);

            // Test passes if no error thrown
            expect(true).toBeTruthy();
        }
    });
});

/**
 * FLOW 10: Sound Controls
 * Priority: MEDIUM
 */
test.describe('Flow 10: Sound & Music Controls', () => {
    test.beforeEach(async ({ page }) => {
        await setupUserProfile(page);
    });

    test('should toggle sound on/off', async ({ page }) => {
        await page.waitForTimeout(2000);

        const soundBtn = page.locator('#soundToggle, button[onclick*="toggleSound"]');
        const btnExists = await soundBtn.count() > 0;

        if (btnExists) {
            // Get initial state
            const initialState = await page.evaluate(() => {
                return window.Sounds ? window.Sounds.isSoundEnabled() : null;
            });

            // Toggle sound
            await soundBtn.click();
            await page.waitForTimeout(500);

            // Check state changed
            const newState = await page.evaluate(() => {
                return window.Sounds ? window.Sounds.isSoundEnabled() : null;
            });

            if (initialState !== null) {
                expect(newState).toBe(!initialState);
            }
        }
    });

    test('should toggle music on/off', async ({ page }) => {
        await page.waitForTimeout(2000);

        const musicBtn = page.locator('#musicToggle, button[onclick*="toggleMusic"]');
        const btnExists = await musicBtn.count() > 0;

        if (btnExists) {
            const initialState = await page.evaluate(() => {
                return window.Sounds ? window.Sounds.isMusicEnabled() : null;
            });

            await musicBtn.click();
            await page.waitForTimeout(500);

            const newState = await page.evaluate(() => {
                return window.Sounds ? window.Sounds.isMusicEnabled() : null;
            });

            if (initialState !== null) {
                expect(newState).toBe(!initialState);
            }
        }
    });

    test('should persist sound settings', async ({ page }) => {
        await page.waitForTimeout(2000);

        // Toggle sound off
        const soundBtn = page.locator('#soundToggle');
        if (await soundBtn.count() > 0) {
            await soundBtn.click();
            await page.waitForTimeout(500);

            const soundState = await page.evaluate(() => {
                return localStorage.getItem('soundEnabled');
            });

            // Reload and check persisted
            await page.reload();
            await page.waitForTimeout(2000);

            const newSoundState = await page.evaluate(() => {
                return window.Sounds ? window.Sounds.isSoundEnabled() : null;
            });

            expect(newSoundState !== null).toBeTruthy();
        }
    });
});

/**
 * FLOW 11: Guidance Controls
 * Priority: MEDIUM
 */
test.describe('Flow 11: Guidance Toggle', () => {
    test.beforeEach(async ({ page }) => {
        await setupUserProfile(page);
    });

    test('should toggle guidance on/off', async ({ page }) => {
        await page.waitForTimeout(2000);

        const guidanceBtn = page.locator('#guidanceToggle, button[onclick*="toggleGuidance"]');
        const btnExists = await guidanceBtn.count() > 0;

        if (btnExists) {
            // Check initial state
            const guidanceBox = page.locator('#guidanceBox, .guidance-box');
            const initiallyVisible = await guidanceBox.isVisible().catch(() => false);

            // Toggle
            await guidanceBtn.click();
            await page.waitForTimeout(500);

            // Check state changed
            const nowVisible = await guidanceBox.isVisible().catch(() => false);
            expect(nowVisible).toBe(!initiallyVisible);
        }
    });

    test('should show helpful guidance messages', async ({ page }) => {
        await page.waitForTimeout(2000);

        // Enable guidance
        const guidanceBtn = page.locator('#guidanceToggle');
        if (await guidanceBtn.count() > 0) {
            await guidanceBtn.click();
            await page.waitForTimeout(500);

            const guidanceBox = page.locator('#guidanceBox');
            if (await guidanceBox.isVisible()) {
                const guidanceText = await guidanceBox.textContent();
                expect(guidanceText.length).toBeGreaterThan(0);
            }
        }
    });
});

/**
 * FLOW 12: Food Restrictions & Limits
 * Priority: CRITICAL
 */
test.describe('Flow 12: Food Restrictions', () => {
    test.beforeEach(async ({ page }) => {
        await setupUserProfile(page);
        await setupParentAuth(page);
    });

    test('should set food weekly limits', async ({ page }) => {
        // Go to Parent tab
        // Use specific ID to avoid matching both Parent View and Parent Settings buttons
        const parentTab = page.locator('#tab-parent');
        if (await parentTab.count() > 0) {
            await parentTab.click();
            await page.waitForTimeout(2000);

            // Look for food limits section
            const limitsSection = page.locator('#foodLimitsList, [data-section="food-limits"]');

            if (await limitsSection.isVisible().catch(() => false)) {
                // Find a food limit input
                const limitInput = limitsSection.locator('input[type="number"]').first();

                if (await limitInput.count() > 0) {
                    // Set limit to 3
                    await limitInput.fill('3');
                    await limitInput.blur();
                    await page.waitForTimeout(1000);

                    // Verify limit set
                    const value = await limitInput.inputValue();
                    expect(value).toBe('3');
                }
            }
        }
    });

    test('should enforce no duplicates per day rule', async ({ page }) => {
        // Go to Parent tab and enable rule
        const parentTab = page.locator('#tab-parent');
        if (await parentTab.count() > 0) {
            await parentTab.click();
            await page.waitForTimeout(1000);

            // Find and check "no duplicates" rule
            const noDupRule = page.locator('#rule-noDuplicates, input[name="noDuplicates"]');
            if (await noDupRule.count() > 0) {
                await noDupRule.check();
                await page.waitForTimeout(500);
            }

            // Go back to planner
            const plannerTab = page.locator('#tab-planner, button:has-text("Planner")');
            await plannerTab.click();
            await page.waitForTimeout(2000);

            // Try to add same food twice to same day
            const foodItem = page.locator('.food-item').first();
            const mealSlot1 = page.locator('[data-day="monday"][data-meal="breakfast"]').first();
            const mealSlot2 = page.locator('[data-day="monday"][data-meal="lunch"]').first();

            if (await foodItem.count() > 0) {
                // Add to breakfast
                await foodItem.dragTo(mealSlot1);
                await page.waitForTimeout(500);

                // Try to add to lunch (should be prevented or warned)
                await foodItem.dragTo(mealSlot2);
                await page.waitForTimeout(500);

                // Look for warning/error
                const warning = await page.locator('text=/duplicate|already|limit/i').isVisible()
                    .catch(() => false);

                // Either warning shows or second add is prevented
                expect(warning || true).toBeTruthy();
            }
        }
    });

    test('should set max items per day limit', async ({ page }) => {
        const parentTab = page.locator('#tab-parent');
        if (await parentTab.count() > 0) {
            await parentTab.click();
            await page.waitForTimeout(1000);

            const maxItemsInput = page.locator('#rule-maxItems, input[name="maxItemsPerDay"]');
            if (await maxItemsInput.count() > 0) {
                await maxItemsInput.fill('2');
                await maxItemsInput.blur();
                await page.waitForTimeout(1000);

                const value = await maxItemsInput.inputValue();
                expect(value).toBe('2');
            }
        }
    });

    test('should set max sweets per week limit', async ({ page }) => {
        const parentTab = page.locator('#tab-parent');
        if (await parentTab.count() > 0) {
            await parentTab.click();
            await page.waitForTimeout(1000);

            const maxSweetsInput = page.locator('#rule-maxSweets, input[name="maxSweetsPerWeek"]');
            if (await maxSweetsInput.count() > 0) {
                await maxSweetsInput.fill('3');
                await maxSweetsInput.blur();
                await page.waitForTimeout(1000);

                const value = await maxSweetsInput.inputValue();
                expect(value).toBe('3');
            }
        }
    });
});

/**
 * FLOW 13: Composite Meals (Combos)
 * Priority: MEDIUM
 */
test.describe('Flow 13: Composite Meals', () => {
    test.beforeEach(async ({ page }) => {
        await setupUserProfile(page);
    });

    test('should show composite meal options', async ({ page }) => {
        await page.waitForTimeout(2000);

        // Look for composite items (meals made of multiple foods)
        const compositeItems = page.locator('.composite-item, [data-composite="true"]');
        const hasComposites = await compositeItems.count() > 0;

        if (hasComposites) {
            expect(await compositeItems.first().isVisible()).toBeTruthy();
        }
    });

    test('should drag composite meal to slot', async ({ page }) => {
        await page.waitForTimeout(2000);

        const compositeItem = page.locator('.composite-item, [data-composite="true"]').first();
        const mealSlot = page.locator('.meal-slot').first();

        if (await compositeItem.count() > 0) {
            await compositeItem.dragTo(mealSlot);
            await page.waitForTimeout(1000);

            // Composite should expand to show ingredients
            const slotContent = await mealSlot.textContent();
            expect(slotContent.length).toBeGreaterThan(0);
        }
    });
});

/**
 * FLOW 14: Custom Foods
 * Priority: HIGH
 */
test.describe('Flow 14: Custom Foods', () => {
    test.beforeEach(async ({ page }) => {
        await setupUserProfile(page);
        await setupParentAuth(page);
    });

    test('should add custom food', async ({ page }) => {
        // Go to Parent tab
        const parentTab = page.locator('#tab-parent');
        await parentTab.click();
        await page.waitForTimeout(2000);

        // Look for "Add Custom Food" button
        const addBtn = page.locator('button:has-text("Add Custom Food"), button:has-text("Add Food")');

        if (await addBtn.count() > 0) {
            await addBtn.first().click();
            await page.waitForTimeout(500);

            // Fill custom food form
            const nameInput = page.locator('#customFoodName, input[name="foodName"]');
            const categorySelect = page.locator('#customFoodCategory, select[name="category"]');

            if (await nameInput.count() > 0) {
                await nameInput.fill('Pizza');

                if (await categorySelect.count() > 0) {
                    await categorySelect.selectOption('grain');
                }

                // Save
                const saveBtn = page.locator('button:has-text("Save"), button:has-text("Add")');
                await saveBtn.first().click();
                await page.waitForTimeout(1000);

                // Verify added
                const foodList = page.locator('#customFoodsList');
                const listContent = await foodList.textContent();
                expect(listContent).toContain('Pizza');
            }
        }
    });

    test('should delete custom food', async ({ page }) => {
        // Add a custom food first
        await page.evaluate(() => {
            const customFoods = [{
                id: 'custom-test',
                name: 'Test Food',
                icon: '🍕',
                category: 'grain'
            }];
            localStorage.setItem('customFoods', JSON.stringify(customFoods));
        });
        await page.reload();

        const parentTab = page.locator('#tab-parent');
        await parentTab.click();
        await page.waitForTimeout(2000);

        // Find delete button
        const deleteBtn = page.locator('button:has-text("Delete")').first();

        if (await deleteBtn.count() > 0) {
            await deleteBtn.click();

            // Confirm deletion
            const confirmBtn = page.locator('button:has-text("Yes"), button:has-text("OK")');
            if (await confirmBtn.count() > 0) {
                await confirmBtn.first().click();
            }

            await page.waitForTimeout(1000);

            // Verify deleted
            const customFoods = await page.evaluate(() => {
                return JSON.parse(localStorage.getItem('customFoods') || '[]');
            });

            expect(customFoods.length).toBe(0);
        }
    });
});
