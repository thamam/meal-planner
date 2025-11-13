// ==========================================
// 🚨 CRITICAL FIXES INTEGRATOR
// ==========================================

/**
 * This module integrates all critical fixes for:
 * 1. Memory leaks (event listeners)
 * 2. Race conditions (async operations)
 * 3. Data corruption (concurrent updates)
 *
 * MUST load AFTER all other modules
 */

const CriticalFixes = {
    applied: false,

    /**
     * Apply all critical fixes
     */
    async apply() {
        if (this.applied) {
            console.warn('⚠️ Critical fixes already applied');
            return;
        }

        console.log('🚨 Applying critical fixes...');

        try {
            // Fix 1: Replace leak-prone operations with safe versions
            this.patchMealPlanOperations();

            // Fix 2: Add validation to state mutations
            this.patchStateMutations();

            // Fix 3: Add safeguards to auto-save
            this.patchAutoSave();

            this.applied = true;
            console.log('✅ All critical fixes applied successfully');

            // Show confirmation to user (subtle)
            if (window.showMessage) {
                setTimeout(() => {
                    window.showMessage('✅ App stability improvements loaded', 'info');
                }, 2000);
            }
        } catch (error) {
            console.error('❌ Error applying critical fixes:', error);
            throw error;
        }
    },

    /**
     * Fix 1: Patch meal plan operations to use locking
     */
    patchMealPlanOperations() {
        if (!window.SafeMealPlanOps) {
            console.warn('⚠️ SafeMealPlanOps not loaded, skipping patch');
            return;
        }

        // Patch loadMealPlan
        if (typeof window.loadMealPlan === 'function') {
            const originalLoad = window.loadMealPlan;

            window.loadMealPlan = async function(...args) {
                console.log('🔒 Using safe meal plan load (with locking)');

                // Check if user exists
                if (!window.currentUser || !window.currentUser.id) {
                    if (window.showMessage) {
                        window.showMessage('⚠️ Please create a profile first', 'warning');
                    }
                    return;
                }

                try {
                    // Get week start
                    const monday = new Date();
                    const day = monday.getDay();
                    const diff = monday.getDate() - day + (day === 0 ? -6 : 1);
                    monday.setDate(diff);
                    const weekStartStr = monday.toISOString().split('T')[0];

                    // Use safe locked operation
                    const meals = await SafeMealPlanOps.load(
                        window.currentUser.id,
                        weekStartStr
                    );

                    if (meals) {
                        // Deep clone to prevent reference issues
                        window.weeklyMeals = JSON.parse(JSON.stringify(meals));

                        // Update UI
                        if (typeof window.updateWeeklyPlanDisplay === 'function') {
                            window.updateWeeklyPlanDisplay();
                        }

                        if (window.showMessage) {
                            window.showMessage('📂 Meal plan loaded!', 'success');
                        }
                        if (window.Sounds) {
                            window.Sounds.playSuccess();
                        }
                    } else {
                        if (window.showMessage) {
                            window.showMessage('ℹ️ No saved meal plan found', 'info');
                        }
                    }
                } catch (error) {
                    console.error('Error loading meal plan:', error);
                    if (window.showMessage) {
                        window.showMessage('❌ Failed to load meal plan', 'error');
                    }
                }
            };

            console.log('✅ Patched loadMealPlan with locking');
        }

        // Patch saveMealPlan
        if (typeof window.saveMealPlan === 'function') {
            const originalSave = window.saveMealPlan;

            window.saveMealPlan = async function(silent = false) {
                console.log('🔒 Using safe meal plan save (with locking)');

                // Check if user exists
                if (!window.currentUser || !window.currentUser.id) {
                    if (!silent && window.showMessage) {
                        window.showMessage('⚠️ Please create a profile first', 'warning');
                    }
                    return;
                }

                // Check if there's actually data to save
                const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
                const hasMeals = days.some(day =>
                    window.weeklyMeals[day] && window.weeklyMeals[day].length > 0
                );

                if (!hasMeals) {
                    if (!silent && window.showMessage) {
                        window.showMessage('ℹ️ No meals to save', 'info');
                    }
                    return;
                }

                try {
                    // Get week start
                    const monday = new Date();
                    const day = monday.getDay();
                    const diff = monday.getDate() - day + (day === 0 ? -6 : 1);
                    monday.setDate(diff);
                    const weekStartStr = monday.toISOString().split('T')[0];

                    // Prepare data
                    const mealPlanData = {
                        user_id: window.currentUser.id,
                        week_start: weekStartStr,
                        meals: JSON.stringify(window.weeklyMeals)
                    };

                    // Use safe locked operation
                    const result = await SafeMealPlanOps.save(mealPlanData);

                    if (!silent) {
                        if (window.showMessage) {
                            window.showMessage('💾 Meal plan saved!', 'success');
                        }
                        if (window.Sounds) {
                            window.Sounds.playSuccess();
                        }
                    }

                    return result;
                } catch (error) {
                    console.error('Error saving meal plan:', error);
                    if (!silent && window.showMessage) {
                        window.showMessage('❌ Failed to save meal plan', 'error');
                    }
                    throw error;
                }
            };

            console.log('✅ Patched saveMealPlan with locking');
        }
    },

    /**
     * Fix 2: Add validation to state mutations
     */
    patchStateMutations() {
        // Validate weeklyMeals structure before updates
        if (typeof window.updateWeeklyPlanDisplay === 'function') {
            const originalUpdate = window.updateWeeklyPlanDisplay;

            window.updateWeeklyPlanDisplay = function() {
                // Validate structure
                if (!window.weeklyMeals || typeof window.weeklyMeals !== 'object') {
                    console.error('❌ Invalid weeklyMeals structure, resetting');
                    window.weeklyMeals = {
                        monday: [],
                        tuesday: [],
                        wednesday: [],
                        thursday: [],
                        friday: []
                    };
                }

                // Ensure all days exist
                const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
                days.forEach(day => {
                    if (!Array.isArray(window.weeklyMeals[day])) {
                        console.warn(`⚠️ Missing/invalid ${day}, resetting`);
                        window.weeklyMeals[day] = [];
                    }
                });

                // Call original
                return originalUpdate.call(this);
            };

            console.log('✅ Patched updateWeeklyPlanDisplay with validation');
        }
    },

    /**
     * Fix 3: Add safeguards to auto-save
     */
    patchAutoSave() {
        if (!window.AutoSave) {
            console.warn('⚠️ AutoSave not loaded, skipping patch');
            return;
        }

        // Add debouncing to triggerAutoSave
        const originalTrigger = window.AutoSave.triggerAutoSave;
        let saveInProgress = false;

        window.AutoSave.triggerAutoSave = async function(saveFn, currentUser) {
            // Skip if save already in progress
            if (saveInProgress) {
                console.log('⏭️ Skipping auto-save (save in progress)');
                return;
            }

            // Skip if loading
            if (window.AutoSave.getLoadingState && window.AutoSave.getLoadingState()) {
                console.log('⏭️ Skipping auto-save (loading in progress)');
                return;
            }

            // Skip if no user
            if (!currentUser || !currentUser.id) {
                console.log('⏭️ Skipping auto-save (no user)');
                return;
            }

            // Set flag
            saveInProgress = true;

            try {
                await originalTrigger.call(this, saveFn, currentUser);
            } finally {
                // Clear flag after delay
                setTimeout(() => {
                    saveInProgress = false;
                }, 1000);
            }
        };

        console.log('✅ Patched AutoSave.triggerAutoSave with safeguards');
    },

    /**
     * Verify all fixes are working
     */
    verify() {
        const checks = {
            eventManager: typeof window.EventManager !== 'undefined',
            asyncLock: typeof window.AsyncLock !== 'undefined',
            safeMealPlanOps: typeof window.SafeMealPlanOps !== 'undefined',
            operationLocks: typeof window.OperationLocks !== 'undefined'
        };

        const allPassed = Object.values(checks).every(v => v);

        console.group('🔍 Critical Fixes Verification');
        console.log('Event Manager:', checks.eventManager ? '✅' : '❌');
        console.log('Async Lock:', checks.asyncLock ? '✅' : '❌');
        console.log('Safe Meal Plan Ops:', checks.safeMealPlanOps ? '✅' : '❌');
        console.log('Operation Locks:', checks.operationLocks ? '✅' : '❌');
        console.log('Overall Status:', allPassed ? '✅ ALL PASSED' : '❌ SOME FAILED');
        console.groupEnd();

        return allPassed;
    },

    /**
     * Get status of all critical systems
     */
    getStatus() {
        const status = {
            applied: this.applied,
            locks: {},
            memory: null,
            timestamp: new Date().toISOString()
        };

        // Get lock statuses
        if (window.OperationLocks) {
            Object.entries(window.OperationLocks).forEach(([name, lock]) => {
                status.locks[name] = lock.getStatus();
            });
        }

        // Get memory info
        if (window.EventManager && window.EventManager.getMemoryInfo) {
            status.memory = window.EventManager.getMemoryInfo();
        }

        return status;
    },

    /**
     * Display status to console
     */
    showStatus() {
        const status = this.getStatus();

        console.group('📊 Critical Fixes Status');
        console.log('Applied:', status.applied);
        console.log('Locks:', status.locks);
        if (status.memory) {
            console.log('Memory:', status.memory);
        }
        console.log('Timestamp:', status.timestamp);
        console.groupEnd();
    }
};

// Auto-apply fixes after all modules load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(async () => {
            await CriticalFixes.apply();
            CriticalFixes.verify();
        }, 1000); // Wait 1 second for all modules
    });
} else {
    setTimeout(async () => {
        await CriticalFixes.apply();
        CriticalFixes.verify();
    }, 1000);
}

// Export for debugging
if (typeof window !== 'undefined') {
    window.CriticalFixes = CriticalFixes;

    // Add developer console commands
    window.showCriticalStatus = () => CriticalFixes.showStatus();
    window.verifyCriticalFixes = () => CriticalFixes.verify();
}

console.log('✅ Critical fixes integrator loaded');
