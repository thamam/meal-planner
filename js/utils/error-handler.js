// ==========================================
// ⚠️ Error Handling Utilities
// ==========================================

/**
 * Standardized error handling for the application
 */
const ErrorHandler = {
    /**
     * Handle async operations with consistent error handling
     * @param {Function} fn - Async function to execute
     * @param {*} fallback - Fallback value on error
     * @param {boolean} showError - Whether to show error message to user
     * @returns {Promise<*>} Result or fallback
     */
    async handleAsync(fn, fallback = null, showError = true) {
        try {
            return await fn();
        } catch (error) {
            console.error('Error in async operation:', error);

            if (showError && typeof window.showMessage === 'function') {
                const userMessage = this.getUserFriendlyMessage(error);
                window.showMessage(userMessage, 'error');
            }

            // Track error (integrate with analytics/monitoring)
            this.trackError(error);

            return fallback;
        }
    },

    /**
     * Handle sync operations with consistent error handling
     * @param {Function} fn - Function to execute
     * @param {*} fallback - Fallback value on error
     * @param {boolean} showError - Whether to show error message to user
     * @returns {*} Result or fallback
     */
    handleSync(fn, fallback = null, showError = true) {
        try {
            return fn();
        } catch (error) {
            console.error('Error in sync operation:', error);

            if (showError && typeof window.showMessage === 'function') {
                const userMessage = this.getUserFriendlyMessage(error);
                window.showMessage(userMessage, 'error');
            }

            this.trackError(error);
            return fallback;
        }
    },

    /**
     * Convert technical error to user-friendly message
     * @param {Error} error - Error object
     * @returns {string} User-friendly message
     */
    getUserFriendlyMessage(error) {
        // Get current language
        const currentLang = window.i18n ? window.i18n.getCurrentLanguage() : 'en';

        // Firebase-specific errors
        if (error.code) {
            const firebaseMessages = {
                'permission-denied': {
                    en: '🔒 Permission denied. Please check your account.',
                    he: '🔒 הגישה נדחתה. אנא בדוק את החשבון שלך.'
                },
                'unavailable': {
                    en: '📡 Service temporarily unavailable. Please try again.',
                    he: '📡 השירות אינו זמין כרגע. נסה שוב.'
                },
                'deadline-exceeded': {
                    en: '⏱️ Request timeout. Please check your connection.',
                    he: '⏱️ הבקשה ארכה יותר מדי. בדוק את החיבור.'
                },
                'not-found': {
                    en: '🔍 Data not found.',
                    he: '🔍 המידע לא נמצא.'
                }
            };

            if (firebaseMessages[error.code]) {
                return firebaseMessages[error.code][currentLang];
            }
        }

        // Network errors
        if (error.message && error.message.includes('network')) {
            return currentLang === 'he'
                ? '📡 בעיית רשת. בדוק את החיבור לאינטרנט.'
                : '📡 Network error. Please check your internet connection.';
        }

        // Validation errors
        if (error.message && error.message.includes('Invalid')) {
            return currentLang === 'he'
                ? `❌ ${error.message}`
                : `❌ ${error.message}`;
        }

        // Generic error
        const genericMessages = {
            en: '❌ Something went wrong. Please try again.',
            he: '❌ משהו השתבש. נסה שוב.'
        };

        return genericMessages[currentLang];
    },

    /**
     * Track error for analytics/monitoring
     * @param {Error} error - Error to track
     * @param {Object} context - Additional context
     */
    trackError(error, context = {}) {
        // Log to console with full details
        console.error('Tracked Error:', {
            message: error.message,
            code: error.code,
            stack: error.stack,
            context: context,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
        });

        // In production, send to error tracking service (Sentry, LogRocket, etc.)
        // Example:
        // if (window.Sentry) {
        //     Sentry.captureException(error, { extra: context });
        // }
    },

    /**
     * Create a custom error with additional context
     * @param {string} message - Error message
     * @param {string} code - Error code
     * @param {Object} context - Additional context
     * @returns {Error} Enhanced error object
     */
    createError(message, code = 'APP_ERROR', context = {}) {
        const error = new Error(message);
        error.code = code;
        error.context = context;
        error.timestamp = new Date().toISOString();
        return error;
    },

    /**
     * Wrap a promise with timeout
     * @param {Promise} promise - Promise to wrap
     * @param {number} timeoutMs - Timeout in milliseconds
     * @param {string} timeoutMessage - Custom timeout message
     * @returns {Promise} Wrapped promise
     */
    async withTimeout(promise, timeoutMs = 15000, timeoutMessage = 'Operation timeout') {
        return Promise.race([
            promise,
            new Promise((_, reject) =>
                setTimeout(() => reject(this.createError(timeoutMessage, 'TIMEOUT')), timeoutMs)
            )
        ]);
    },

    /**
     * Retry an async operation with exponential backoff
     * @param {Function} fn - Async function to retry
     * @param {number} maxRetries - Maximum number of retries
     * @param {number} delayMs - Initial delay in milliseconds
     * @returns {Promise<*>} Result of successful operation
     */
    async retry(fn, maxRetries = 3, delayMs = 1000) {
        let lastError;

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                return await fn();
            } catch (error) {
                lastError = error;

                // Check if error is retryable
                const isRetryable = this.isRetryableError(error);

                if (!isRetryable || attempt === maxRetries) {
                    throw error;
                }

                // Wait before retry with exponential backoff
                const waitTime = delayMs * attempt;
                console.warn(`Retry ${attempt}/${maxRetries} after ${waitTime}ms:`, error.message);
                await new Promise(resolve => setTimeout(resolve, waitTime));
            }
        }

        throw lastError;
    },

    /**
     * Check if error is retryable
     * @param {Error} error - Error to check
     * @returns {boolean} Is retryable
     */
    isRetryableError(error) {
        if (!error) return false;

        // Retryable Firebase errors
        const retryableCodes = ['unavailable', 'deadline-exceeded', 'resource-exhausted'];
        if (error.code && retryableCodes.includes(error.code)) {
            return true;
        }

        // Network errors
        if (error.message && (
            error.message.includes('network') ||
            error.message.includes('timeout') ||
            error.message.includes('fetch')
        )) {
            return true;
        }

        return false;
    },

    /**
     * Safe element access with fallback
     * @param {string} elementId - Element ID
     * @param {Function} callback - Callback if element exists
     * @param {*} fallback - Fallback value if element doesn't exist
     * @returns {*} Result or fallback
     */
    safeElementAccess(elementId, callback, fallback = null) {
        const element = document.getElementById(elementId);

        if (!element) {
            console.warn(`Element not found: ${elementId}`);
            return fallback;
        }

        return this.handleSync(() => callback(element), fallback, false);
    },

    /**
     * Validate and get element or throw error
     * @param {string} elementId - Element ID
     * @returns {HTMLElement} Element
     * @throws {Error} If element not found
     */
    requireElement(elementId) {
        const element = document.getElementById(elementId);

        if (!element) {
            throw this.createError(
                `Required element not found: ${elementId}`,
                'ELEMENT_NOT_FOUND',
                { elementId }
            );
        }

        return element;
    }
};

/**
 * Global error handler for uncaught errors
 */
window.addEventListener('error', (event) => {
    console.error('Uncaught error:', event.error);
    ErrorHandler.trackError(event.error, { type: 'uncaught' });
});

/**
 * Global handler for unhandled promise rejections
 */
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    ErrorHandler.trackError(event.reason, { type: 'unhandled-promise' });
});

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.ErrorHandler = ErrorHandler;
}

console.log('✅ Error handler utilities loaded');
