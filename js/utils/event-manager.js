// ==========================================
// 🔧 CRITICAL FIX: Event Delegation & Memory Management
// ==========================================

/**
 * CRITICAL: This module fixes memory leaks caused by repeated event listener attachment
 *
 * PROBLEM: categorized-view.js calls attachDragEvents() on every render,
 * creating new listeners without removing old ones. This causes:
 * - Memory leaks
 * - Performance degradation
 * - Browser crashes after extended use
 *
 * SOLUTION: Use event delegation - attach listeners ONCE to parent container
 */

const EventManager = {
    initialized: false,
    eventHandlers: new Map(),

    /**
     * Initialize event delegation (call only once)
     */
    init() {
        if (this.initialized) {
            console.warn('EventManager already initialized');
            return;
        }

        console.log('🔧 Initializing EventManager with event delegation');

        // Use event delegation for food palette
        const foodPalette = document.getElementById('foodPalette');
        if (foodPalette) {
            this.setupFoodPaletteEvents(foodPalette);
        }

        // Use event delegation for weekly plan
        const weeklyPlan = document.getElementById('weeklyPlan');
        if (weeklyPlan) {
            this.setupWeeklyPlanEvents(weeklyPlan);
        }

        this.initialized = true;
        console.log('✅ EventManager initialized with event delegation');
    },

    /**
     * Setup food palette events using delegation
     * @param {HTMLElement} container - Food palette container
     */
    setupFoodPaletteEvents(container) {
        // Drag start - delegated
        container.addEventListener('dragstart', (e) => {
            const foodItem = e.target.closest('.food-item');
            if (foodItem) {
                this.handleFoodDragStart(e, foodItem);
            }
        });

        // Drag end - delegated
        container.addEventListener('dragend', (e) => {
            const foodItem = e.target.closest('.food-item');
            if (foodItem) {
                this.handleFoodDragEnd(e, foodItem);
            }
        });

        // Click for composite items - delegated
        container.addEventListener('click', (e) => {
            const foodItem = e.target.closest('.food-item');
            if (foodItem && foodItem.dataset.foodType === 'composite') {
                this.handleCompositeClick(foodItem);
            }
        });

        console.log('✅ Food palette events delegated');
    },

    /**
     * Setup weekly plan events using delegation
     * @param {HTMLElement} container - Weekly plan container
     */
    setupWeeklyPlanEvents(container) {
        // Drop - delegated
        container.addEventListener('drop', (e) => {
            const mealSlot = e.target.closest('.meal-slot');
            if (mealSlot && typeof window.handleDrop === 'function') {
                window.handleDrop(e);
            }
        });

        // Drag over - delegated
        container.addEventListener('dragover', (e) => {
            const mealSlot = e.target.closest('.meal-slot');
            if (mealSlot && typeof window.handleDragOver === 'function') {
                window.handleDragOver(e);
            }
        });

        // Drag leave - delegated
        container.addEventListener('dragleave', (e) => {
            const mealSlot = e.target.closest('.meal-slot');
            if (mealSlot && typeof window.handleDragLeave === 'function') {
                window.handleDragLeave(e);
            }
        });

        console.log('✅ Weekly plan events delegated');
    },

    /**
     * Handle food drag start
     * @param {DragEvent} e - Drag event
     * @param {HTMLElement} foodItem - Food item element
     */
    handleFoodDragStart(e, foodItem) {
        if (window.CategorizedView) {
            window.CategorizedView.draggedElement = foodItem;
        }

        foodItem.style.opacity = '0.5';
        e.dataTransfer.effectAllowed = 'copy';

        if (window.Sounds) {
            window.Sounds.playClick();
        }
    },

    /**
     * Handle food drag end
     * @param {DragEvent} e - Drag event
     * @param {HTMLElement} foodItem - Food item element
     */
    handleFoodDragEnd(e, foodItem) {
        foodItem.style.opacity = '1';

        if (window.CategorizedView) {
            window.CategorizedView.draggedElement = null;
        }
    },

    /**
     * Handle composite item click
     * @param {HTMLElement} foodItem - Food item element
     */
    handleCompositeClick(foodItem) {
        if (window.openCompositeBuilder) {
            const compositeId = foodItem.dataset.foodId;
            const compositeItems = window.compositeItems || [];
            const composite = compositeItems.find(item => item.id === compositeId);
            if (composite) {
                window.openCompositeBuilder(composite);
            }
        }
    },

    /**
     * Cleanup all event listeners (for testing/debugging)
     */
    cleanup() {
        console.log('🧹 Cleaning up EventManager...');

        const foodPalette = document.getElementById('foodPalette');
        if (foodPalette) {
            const newPalette = foodPalette.cloneNode(true);
            foodPalette.parentNode.replaceChild(newPalette, foodPalette);
        }

        const weeklyPlan = document.getElementById('weeklyPlan');
        if (weeklyPlan) {
            const newPlan = weeklyPlan.cloneNode(true);
            weeklyPlan.parentNode.replaceChild(newPlan, weeklyPlan);
        }

        this.initialized = false;
        this.eventHandlers.clear();

        console.log('✅ EventManager cleaned up');
    },

    /**
     * Get memory usage info (for debugging)
     */
    getMemoryInfo() {
        if (performance.memory) {
            return {
                usedJSHeapSize: (performance.memory.usedJSHeapSize / 1048576).toFixed(2) + ' MB',
                totalJSHeapSize: (performance.memory.totalJSHeapSize / 1048576).toFixed(2) + ' MB',
                jsHeapSizeLimit: (performance.memory.jsHeapSizeLimit / 1048576).toFixed(2) + ' MB'
            };
        }
        return null;
    },

    /**
     * Log memory usage (for debugging)
     */
    logMemoryUsage() {
        const info = this.getMemoryInfo();
        if (info) {
            console.log('📊 Memory Usage:', info);
        } else {
            console.log('Memory API not available in this browser');
        }
    }
};

/**
 * IMPORTANT: Override the problematic attachDragEvents function
 * from categorized-view.js to prevent memory leaks
 */
function patchCategorizedView() {
    if (window.CategorizedView) {
        // Replace the memory-leaking function with a no-op
        window.CategorizedView.attachDragEvents = function() {
            // Do nothing - events are handled by delegation now
            console.log('✅ Using event delegation (no individual listeners attached)');
        };

        console.log('✅ Patched CategorizedView.attachDragEvents to prevent memory leaks');
    }
}

// Auto-initialize after DOM is ready and modules are loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Wait for other modules to load
        setTimeout(() => {
            patchCategorizedView();
            EventManager.init();
        }, 500);
    });
} else {
    setTimeout(() => {
        patchCategorizedView();
        EventManager.init();
    }, 500);
}

// Export for debugging
if (typeof window !== 'undefined') {
    window.EventManager = EventManager;
}

console.log('✅ Event management fix loaded');
