// ==========================================
// 🔒 CRITICAL FIX: Async Operation Locking
// ==========================================

/**
 * CRITICAL: This module prevents race conditions in async operations
 *
 * PROBLEM: Multiple simultaneous calls to loadMealPlan() or saveMealPlan()
 * can cause data corruption:
 * - Load starts
 * - User makes change
 * - Save starts
 * - Load completes (overwrites recent change)
 * - Save completes (saves old data)
 * - Result: Data loss!
 *
 * SOLUTION: Lock-based async operation management
 */

class AsyncLock {
    constructor(name = 'lock') {
        this.name = name;
        this.locked = false;
        this.queue = [];
        this.currentOperation = null;
    }

    /**
     * Acquire lock and execute operation
     * @param {Function} operation - Async operation to execute
     * @param {Object} options - Options
     * @returns {Promise<*>} Operation result
     */
    async acquire(operation, options = {}) {
        const {
            timeout = 30000, // 30 second timeout
            priority = 0,
            description = 'Operation'
        } = options;

        // If locked, queue the operation
        if (this.locked) {
            console.log(`🔒 ${this.name}: Queuing ${description} (priority: ${priority})`);
            return new Promise((resolve, reject) => {
                const timeoutId = setTimeout(() => {
                    const index = this.queue.findIndex(item => item.timeoutId === timeoutId);
                    if (index !== -1) {
                        this.queue.splice(index, 1);
                    }
                    reject(new Error(`${description} timed out waiting for lock`));
                }, timeout);

                this.queue.push({
                    operation,
                    resolve,
                    reject,
                    priority,
                    description,
                    timeoutId,
                    enqueuedAt: Date.now()
                });

                // Sort queue by priority (higher first)
                this.queue.sort((a, b) => b.priority - a.priority);
            });
        }

        // Acquire lock
        this.locked = true;
        this.currentOperation = description;
        console.log(`🔓 ${this.name}: Acquired for ${description}`);

        try {
            // Execute with timeout
            const result = await Promise.race([
                operation(),
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error(`${description} execution timeout`)), timeout)
                )
            ]);

            return result;
        } catch (error) {
            console.error(`❌ ${this.name}: ${description} failed:`, error);
            throw error;
        } finally {
            // Release lock
            this.locked = false;
            this.currentOperation = null;
            console.log(`🔓 ${this.name}: Released from ${description}`);

            // Process next in queue
            this.processQueue();
        }
    }

    /**
     * Process queued operations
     */
    async processQueue() {
        if (this.queue.length === 0 || this.locked) {
            return;
        }

        // Get next operation (already sorted by priority)
        const next = this.queue.shift();

        if (!next) return;

        // Clear timeout
        clearTimeout(next.timeoutId);

        const waitTime = Date.now() - next.enqueuedAt;
        console.log(`⏱️ ${this.name}: Processing ${next.description} (waited ${waitTime}ms)`);

        try {
            const result = await this.acquire(next.operation, {
                description: next.description,
                priority: next.priority
            });
            next.resolve(result);
        } catch (error) {
            next.reject(error);
        }
    }

    /**
     * Check if lock is currently held
     * @returns {boolean}
     */
    isLocked() {
        return this.locked;
    }

    /**
     * Get queue status
     * @returns {Object}
     */
    getStatus() {
        return {
            locked: this.locked,
            currentOperation: this.currentOperation,
            queueLength: this.queue.length,
            queuedOperations: this.queue.map(item => ({
                description: item.description,
                priority: item.priority,
                waitTime: Date.now() - item.enqueuedAt
            }))
        };
    }

    /**
     * Clear the queue (emergency use only)
     */
    clearQueue() {
        console.warn(`⚠️ ${this.name}: Clearing ${this.queue.length} queued operations`);

        this.queue.forEach(item => {
            clearTimeout(item.timeoutId);
            item.reject(new Error('Queue cleared'));
        });

        this.queue = [];
    }

    /**
     * Force release lock (emergency use only)
     */
    forceRelease() {
        console.warn(`⚠️ ${this.name}: Force releasing lock`);
        this.locked = false;
        this.currentOperation = null;
        this.processQueue();
    }
}

/**
 * Create specialized locks for different operations
 */
const OperationLocks = {
    mealPlan: new AsyncLock('MealPlan'),
    userData: new AsyncLock('UserData'),
    customFoods: new AsyncLock('CustomFoods'),
    rules: new AsyncLock('Rules')
};

/**
 * Improved meal plan operations with locking
 */
const SafeMealPlanOps = {
    /**
     * Load meal plan with lock protection
     * @param {string} userId - User ID
     * @param {string} weekStartStr - Week start date
     * @returns {Promise<Object|null>} Meal plan data
     */
    async load(userId, weekStartStr) {
        return await OperationLocks.mealPlan.acquire(
            async () => {
                console.log(`📂 Loading meal plan for user ${userId}, week ${weekStartStr}`);

                const data = await window.FirebaseAPI.getMealPlans(userId);
                const plan = data.data ? data.data.find(p =>
                    p.user_id === userId && p.week_start === weekStartStr
                ) : null;

                if (plan) {
                    try {
                        const meals = JSON.parse(plan.meals);
                        console.log('✅ Meal plan loaded successfully');
                        return meals;
                    } catch (error) {
                        console.error('❌ Error parsing meal plan:', error);
                        return null;
                    }
                }

                console.log('ℹ️ No meal plan found');
                return null;
            },
            {
                description: `Load meal plan (${userId})`,
                priority: 10 // High priority for loads
            }
        );
    },

    /**
     * Save meal plan with lock protection
     * @param {Object} mealPlanData - Meal plan data
     * @returns {Promise<Object>} Save result
     */
    async save(mealPlanData) {
        return await OperationLocks.mealPlan.acquire(
            async () => {
                console.log(`💾 Saving meal plan for user ${mealPlanData.user_id}`);

                // Get existing plans
                const plansData = await window.FirebaseAPI.getMealPlans(mealPlanData.user_id);
                const existingPlan = plansData.data ? plansData.data.find(p =>
                    p.user_id === mealPlanData.user_id &&
                    p.week_start === mealPlanData.week_start
                ) : null;

                let result;
                if (existingPlan) {
                    console.log('📝 Updating existing meal plan');
                    result = await window.FirebaseAPI.updateMealPlan(existingPlan.id, mealPlanData);
                } else {
                    console.log('✨ Creating new meal plan');
                    result = await window.FirebaseAPI.createMealPlan(mealPlanData);
                }

                // Verify save
                if (!result || !result.id) {
                    throw new Error('Save operation did not return valid result');
                }

                console.log('✅ Meal plan saved successfully');
                return result;
            },
            {
                description: `Save meal plan (${mealPlanData.user_id})`,
                priority: 5 // Normal priority for saves
            }
        );
    },

    /**
     * Delete meal plan with lock protection
     * @param {string} planId - Plan ID
     * @returns {Promise<Object>} Delete result
     */
    async delete(planId) {
        return await OperationLocks.mealPlan.acquire(
            async () => {
                console.log(`🗑️ Deleting meal plan ${planId}`);
                const result = await window.FirebaseAPI.deleteMealPlan(planId);
                console.log('✅ Meal plan deleted successfully');
                return result;
            },
            {
                description: `Delete meal plan (${planId})`,
                priority: 8 // Higher priority for destructive operations
            }
        );
    },

    /**
     * Get lock status
     */
    getStatus() {
        return OperationLocks.mealPlan.getStatus();
    }
};

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.AsyncLock = AsyncLock;
    window.OperationLocks = OperationLocks;
    window.SafeMealPlanOps = SafeMealPlanOps;
}

console.log('✅ Async lock system loaded');
