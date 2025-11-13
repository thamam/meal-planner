// ==========================================
// 📊 State Management System
// ==========================================

/**
 * Centralized state management to replace global variables
 * Provides reactive updates and change tracking
 */
class StateManager {
    constructor() {
        this._state = {
            // User state
            currentUser: null,
            selectedAvatar: '😊',

            // Food data
            foodItems: [],
            compositeItems: [],
            customFoods: [],

            // Weekly meals
            weeklyMeals: {
                monday: [],
                tuesday: [],
                wednesday: [],
                thursday: [],
                friday: []
            },

            // Composite builder state
            currentCompositeItem: null,
            compositeSelections: {},
            pendingCompositeDay: null,

            // UI state
            isLoadingMealPlan: false,
            currentTab: 'planner',
            currentFoodCategory: 'protein',
            currentFoodManagementCategory: 'all',

            // Settings
            soundEnabled: true,
            musicEnabled: false,
            guidanceEnabled: true,
            language: 'he'
        };

        this._listeners = new Map();
        this._history = [];
        this._maxHistorySize = 50;
    }

    /**
     * Get state value
     * @param {string} key - State key
     * @returns {*} State value
     */
    get(key) {
        return this._state[key];
    }

    /**
     * Set state value
     * @param {string} key - State key
     * @param {*} value - New value
     * @param {boolean} silent - Don't trigger listeners
     */
    set(key, value, silent = false) {
        const oldValue = this._state[key];

        // Don't update if value hasn't changed (shallow comparison)
        if (oldValue === value) {
            return;
        }

        // Save to history
        this._saveToHistory(key, oldValue, value);

        // Update state
        this._state[key] = value;

        // Notify listeners
        if (!silent) {
            this._notify(key, value, oldValue);
        }

        // Log change
        console.log(`📊 State updated: ${key}`, { from: oldValue, to: value });
    },

    /**
     * Update multiple state values at once
     * @param {Object} updates - Key-value pairs to update
     * @param {boolean} silent - Don't trigger listeners
     */
    update(updates, silent = false) {
        Object.entries(updates).forEach(([key, value]) => {
            this.set(key, value, silent);
        });
    },

    /**
     * Subscribe to state changes
     * @param {string|Array<string>} keys - State key(s) to listen to
     * @param {Function} callback - Callback function
     * @returns {Function} Unsubscribe function
     */
    subscribe(keys, callback) {
        const keyArray = Array.isArray(keys) ? keys : [keys];

        keyArray.forEach(key => {
            if (!this._listeners.has(key)) {
                this._listeners.set(key, new Set());
            }
            this._listeners.get(key).add(callback);
        });

        // Return unsubscribe function
        return () => {
            keyArray.forEach(key => {
                const listeners = this._listeners.get(key);
                if (listeners) {
                    listeners.delete(callback);
                }
            });
        };
    },

    /**
     * Notify listeners of state change
     * @param {string} key - State key
     * @param {*} newValue - New value
     * @param {*} oldValue - Old value
     * @private
     */
    _notify(key, newValue, oldValue) {
        const listeners = this._listeners.get(key);
        if (listeners) {
            listeners.forEach(callback => {
                try {
                    callback(newValue, oldValue, key);
                } catch (error) {
                    console.error(`Error in state listener for ${key}:`, error);
                }
            });
        }

        // Notify wildcard listeners (listening to all changes)
        const wildcardListeners = this._listeners.get('*');
        if (wildcardListeners) {
            wildcardListeners.forEach(callback => {
                try {
                    callback(key, newValue, oldValue);
                } catch (error) {
                    console.error('Error in wildcard state listener:', error);
                }
            });
        }
    },

    /**
     * Save state change to history
     * @param {string} key - State key
     * @param {*} oldValue - Old value
     * @param {*} newValue - New value
     * @private
     */
    _saveToHistory(key, oldValue, newValue) {
        this._history.push({
            key,
            oldValue,
            newValue,
            timestamp: Date.now()
        });

        // Limit history size
        if (this._history.length > this._maxHistorySize) {
            this._history.shift();
        }
    },

    /**
     * Get state change history
     * @param {string} key - Optional key filter
     * @param {number} limit - Max number of entries
     * @returns {Array} History entries
     */
    getHistory(key = null, limit = 10) {
        let history = this._history;

        if (key) {
            history = history.filter(entry => entry.key === key);
        }

        return history.slice(-limit);
    },

    /**
     * Compute derived state (memoized getter)
     * @param {string} key - Derived state key
     * @param {Function} computer - Function to compute value
     * @param {Array<string>} dependencies - State keys this depends on
     */
    computed(key, computer, dependencies = []) {
        let cachedValue;
        let isDirty = true;

        // Subscribe to dependencies
        dependencies.forEach(dep => {
            this.subscribe(dep, () => {
                isDirty = true;
            });
        });

        // Define getter
        Object.defineProperty(this, key, {
            get: () => {
                if (isDirty) {
                    cachedValue = computer(this._state);
                    isDirty = false;
                }
                return cachedValue;
            },
            enumerable: true,
            configurable: true
        });
    },

    /**
     * Reset state to defaults
     * @param {Array<string>} keys - Specific keys to reset, or all if not provided
     */
    reset(keys = null) {
        const defaultState = {
            weeklyMeals: {
                monday: [],
                tuesday: [],
                wednesday: [],
                thursday: [],
                friday: []
            },
            compositeSelections: {},
            currentCompositeItem: null,
            pendingCompositeDay: null
        };

        if (keys) {
            keys.forEach(key => {
                if (defaultState.hasOwnProperty(key)) {
                    this.set(key, defaultState[key]);
                }
            });
        } else {
            Object.entries(defaultState).forEach(([key, value]) => {
                this.set(key, value);
            });
        }
    },

    /**
     * Persist state to localStorage
     * @param {Array<string>} keys - Keys to persist
     * @param {string} storageKey - localStorage key
     */
    persist(keys, storageKey = 'app_state') {
        const stateToPersist = {};

        keys.forEach(key => {
            stateToPersist[key] = this._state[key];
        });

        try {
            localStorage.setItem(storageKey, JSON.stringify(stateToPersist));
        } catch (error) {
            console.error('Error persisting state:', error);
        }
    },

    /**
     * Restore state from localStorage
     * @param {string} storageKey - localStorage key
     */
    restore(storageKey = 'app_state') {
        try {
            const stored = localStorage.getItem(storageKey);
            if (stored) {
                const parsedState = JSON.parse(stored);
                Object.entries(parsedState).forEach(([key, value]) => {
                    this.set(key, value, true); // Silent update
                });
            }
        } catch (error) {
            console.error('Error restoring state:', error);
        }
    },

    /**
     * Debug: Get full state snapshot
     * @returns {Object} Current state
     */
    getSnapshot() {
        return { ...this._state };
    },

    /**
     * Debug: Log current state
     */
    debug() {
        console.group('📊 State Manager Debug');
        console.log('Current State:', this.getSnapshot());
        console.log('Listeners:', Array.from(this._listeners.entries()));
        console.log('Recent History:', this.getHistory(null, 5));
        console.groupEnd();
    }
}

// Create global state instance
const AppState = new StateManager();

// Define computed properties
AppState.computed('totalMeals', (state) => {
    let count = 0;
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    days.forEach(day => {
        count += state.weeklyMeals[day].length;
    });
    return count;
}, ['weeklyMeals']);

AppState.computed('categoryCounts', (state) => {
    const counts = {
        protein: 0,
        veggie: 0,
        fruit: 0,
        grain: 0,
        dairy: 0,
        snack: 0
    };

    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    days.forEach(day => {
        state.weeklyMeals[day].forEach(meal => {
            if (counts.hasOwnProperty(meal.category)) {
                counts[meal.category]++;
            }
        });
    });

    return counts;
}, ['weeklyMeals']);

// Auto-persist certain state changes
AppState.subscribe(['soundEnabled', 'musicEnabled', 'guidanceEnabled', 'language'], () => {
    AppState.persist(
        ['soundEnabled', 'musicEnabled', 'guidanceEnabled', 'language'],
        'app_preferences'
    );
});

// Restore preferences on load
AppState.restore('app_preferences');

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.AppState = AppState;
    window.StateManager = StateManager;
}

console.log('✅ State manager loaded');
