// ==========================================
// 📱 Mobile & Touch Support Module
// ==========================================

/**
 * Enhanced mobile and touch support for drag-and-drop operations
 * Provides polyfills for touch events and improves mobile UX
 */
const MobileSupport = {
    touchDevice: false,
    draggedElement: null,
    dropTarget: null,
    touchStartPos: { x: 0, y: 0 },
    clonedElement: null,

    /**
     * Initialize mobile support
     */
    init() {
        this.touchDevice = this.isTouchDevice();

        if (this.touchDevice) {
            console.log('📱 Touch device detected - enabling mobile support');
            this.enableTouchDragDrop();
            this.addMobileStyles();
        } else {
            console.log('🖱️ Desktop device - using native drag-drop');
        }

        // Add viewport meta tag if not present
        this.ensureViewportMeta();

        // Prevent zoom on double-tap
        this.preventDoubleTapZoom();

        // Add touch feedback class
        this.addTouchFeedback();
    },

    /**
     * Detect if device supports touch
     * @returns {boolean}
     */
    isTouchDevice() {
        return (
            'ontouchstart' in window ||
            navigator.maxTouchPoints > 0 ||
            navigator.msMaxTouchPoints > 0
        );
    },

    /**
     * Enable touch-based drag and drop
     */
    enableTouchDragDrop() {
        // Prevent default touch behavior on draggable elements
        document.addEventListener('touchstart', (e) => {
            const foodItem = e.target.closest('.food-item');
            if (foodItem) {
                e.preventDefault(); // Prevent scrolling when touching food items
                this.handleTouchStart(e);
            }
        }, { passive: false });

        document.addEventListener('touchmove', (e) => {
            if (this.draggedElement) {
                e.preventDefault(); // Prevent scrolling while dragging
                this.handleTouchMove(e);
            }
        }, { passive: false });

        document.addEventListener('touchend', (e) => {
            if (this.draggedElement) {
                this.handleTouchEnd(e);
            }
        });

        document.addEventListener('touchcancel', (e) => {
            if (this.draggedElement) {
                this.handleTouchEnd(e);
            }
        });
    },

    /**
     * Handle touch start
     * @param {TouchEvent} e - Touch event
     */
    handleTouchStart(e) {
        const foodItem = e.target.closest('.food-item');
        if (!foodItem) return;

        this.draggedElement = foodItem;

        // Store touch start position
        const touch = e.touches[0];
        this.touchStartPos = { x: touch.clientX, y: touch.clientY };

        // Create visual clone
        this.clonedElement = foodItem.cloneNode(true);
        this.clonedElement.style.position = 'fixed';
        this.clonedElement.style.pointerEvents = 'none';
        this.clonedElement.style.opacity = '0.8';
        this.clonedElement.style.transform = 'scale(1.1)';
        this.clonedElement.style.zIndex = '1000';
        this.clonedElement.style.transition = 'none';
        this.clonedElement.style.left = touch.clientX - 50 + 'px';
        this.clonedElement.style.top = touch.clientY - 50 + 'px';

        document.body.appendChild(this.clonedElement);

        // Visual feedback
        foodItem.style.opacity = '0.3';

        // Play sound
        if (window.Sounds) {
            window.Sounds.playClick();
        }

        // Haptic feedback if available
        this.vibrate(10);
    },

    /**
     * Handle touch move
     * @param {TouchEvent} e - Touch event
     */
    handleTouchMove(e) {
        if (!this.clonedElement) return;

        const touch = e.touches[0];

        // Move cloned element
        this.clonedElement.style.left = touch.clientX - 50 + 'px';
        this.clonedElement.style.top = touch.clientY - 50 + 'px';

        // Find potential drop target
        const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
        const mealSlot = elementBelow ? elementBelow.closest('.meal-slot') : null;

        // Visual feedback for drop zones
        document.querySelectorAll('.meal-slot').forEach(slot => {
            slot.classList.remove('drag-over');
        });

        if (mealSlot) {
            mealSlot.classList.add('drag-over');
            this.dropTarget = mealSlot;
        } else {
            this.dropTarget = null;
        }
    },

    /**
     * Handle touch end
     * @param {TouchEvent} e - Touch event
     */
    handleTouchEnd(e) {
        if (!this.draggedElement) return;

        // Remove clone
        if (this.clonedElement) {
            this.clonedElement.remove();
            this.clonedElement = null;
        }

        // Restore original element
        this.draggedElement.style.opacity = '1';

        // Handle drop
        if (this.dropTarget) {
            this.simulateDrop(this.draggedElement, this.dropTarget);

            // Success feedback
            this.vibrate([10, 50, 10]);
        }

        // Cleanup
        document.querySelectorAll('.meal-slot').forEach(slot => {
            slot.classList.remove('drag-over');
        });

        this.draggedElement = null;
        this.dropTarget = null;
    },

    /**
     * Simulate drop event for compatibility with existing drop handlers
     * @param {HTMLElement} foodItem - Dragged food item
     * @param {HTMLElement} mealSlot - Drop target
     */
    simulateDrop(foodItem, mealSlot) {
        // Set up for existing drag handler to work
        if (window.CategorizedView) {
            window.CategorizedView.draggedElement = foodItem;
        }

        // Create synthetic drop event
        const dropEvent = new DragEvent('drop', {
            bubbles: true,
            cancelable: true,
            dataTransfer: new DataTransfer()
        });

        Object.defineProperty(dropEvent, 'currentTarget', {
            value: mealSlot,
            writable: false
        });

        // Call existing drop handler
        if (typeof window.handleDrop === 'function') {
            window.handleDrop(dropEvent);
        }

        // Cleanup
        if (window.CategorizedView) {
            window.CategorizedView.draggedElement = null;
        }
    },

    /**
     * Add mobile-specific styles
     */
    addMobileStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Mobile-specific improvements */
            .food-item {
                -webkit-tap-highlight-color: rgba(139, 92, 246, 0.3);
                -webkit-touch-callout: none;
                user-select: none;
                min-height: 80px;
                min-width: 80px;
            }

            .meal-slot {
                min-height: 150px;
                touch-action: none;
            }

            /* Larger touch targets on mobile */
            @media (max-width: 768px) {
                button {
                    min-height: 44px;
                    min-width: 44px;
                }

                .food-item {
                    padding: 1rem;
                }

                .meal-slot {
                    min-height: 180px;
                }

                /* Prevent text selection during drag */
                .food-item, .meal-slot {
                    -webkit-user-select: none;
                    user-select: none;
                }
            }

            /* Touch feedback */
            .touch-active {
                transform: scale(0.95);
                opacity: 0.7;
            }
        `;
        document.head.appendChild(style);
    },

    /**
     * Ensure viewport meta tag is present
     */
    ensureViewportMeta() {
        let viewport = document.querySelector('meta[name="viewport"]');

        if (!viewport) {
            viewport = document.createElement('meta');
            viewport.name = 'viewport';
            viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
            document.head.appendChild(viewport);
        } else {
            // Ensure it prevents zooming
            const content = viewport.getAttribute('content');
            if (!content.includes('user-scalable=no')) {
                viewport.content = content + ', user-scalable=no';
            }
        }
    },

    /**
     * Prevent double-tap zoom
     */
    preventDoubleTapZoom() {
        let lastTap = 0;

        document.addEventListener('touchend', (e) => {
            const currentTime = new Date().getTime();
            const tapLength = currentTime - lastTap;

            if (tapLength < 300 && tapLength > 0) {
                e.preventDefault();
            }

            lastTap = currentTime;
        }, { passive: false });
    },

    /**
     * Add touch feedback to interactive elements
     */
    addTouchFeedback() {
        document.addEventListener('touchstart', (e) => {
            const interactive = e.target.closest('button, .food-item, [onclick]');
            if (interactive) {
                interactive.classList.add('touch-active');
            }
        });

        document.addEventListener('touchend', (e) => {
            const interactive = e.target.closest('button, .food-item, [onclick]');
            if (interactive) {
                interactive.classList.remove('touch-active');
            }
        });

        document.addEventListener('touchcancel', (e) => {
            document.querySelectorAll('.touch-active').forEach(el => {
                el.classList.remove('touch-active');
            });
        });
    },

    /**
     * Trigger vibration if available
     * @param {number|Array} pattern - Vibration pattern
     */
    vibrate(pattern) {
        if ('vibrate' in navigator) {
            navigator.vibrate(pattern);
        }
    },

    /**
     * Check if device is in landscape mode
     * @returns {boolean}
     */
    isLandscape() {
        return window.matchMedia('(orientation: landscape)').matches;
    },

    /**
     * Show orientation suggestion for mobile users
     */
    showOrientationSuggestion() {
        if (!this.touchDevice) return;

        if (this.isLandscape()) {
            const suggestion = document.createElement('div');
            suggestion.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded-full z-50 text-sm shadow-lg';
            suggestion.textContent = '💡 Tip: Use portrait mode for better experience';
            document.body.appendChild(suggestion);

            setTimeout(() => suggestion.remove(), 5000);
        }
    }
};

// Auto-initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => MobileSupport.init());
} else {
    MobileSupport.init();
}

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.MobileSupport = MobileSupport;
}

console.log('✅ Mobile support module loaded');
