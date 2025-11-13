// ==========================================
// 🌐 Offline Support & Network Monitoring
// ==========================================

/**
 * Handle offline functionality and network status monitoring
 * Provides user feedback and queues operations when offline
 */
const OfflineSupport = {
    isOnline: navigator.onLine,
    pendingOperations: [],
    maxPendingOps: 50,
    statusIndicator: null,

    /**
     * Initialize offline support
     */
    init() {
        this.isOnline = navigator.onLine;

        // Create status indicator
        this.createStatusIndicator();

        // Listen for online/offline events
        window.addEventListener('online', () => this.handleOnline());
        window.addEventListener('offline', () => this.handleOffline());

        // Check connection periodically
        setInterval(() => this.checkConnection(), 30000); // Every 30 seconds

        // Initial status
        this.updateStatusIndicator();

        console.log(`🌐 Offline support initialized - Status: ${this.isOnline ? 'Online' : 'Offline'}`);
    },

    /**
     * Create network status indicator
     */
    createStatusIndicator() {
        const indicator = document.createElement('div');
        indicator.id = 'network-status';
        indicator.className = 'fixed bottom-4 left-4 px-4 py-2 rounded-full shadow-lg text-sm font-semibold z-50 transition-all';
        indicator.style.display = 'none';

        document.body.appendChild(indicator);
        this.statusIndicator = indicator;
    },

    /**
     * Update status indicator
     */
    updateStatusIndicator() {
        if (!this.statusIndicator) return;

        if (this.isOnline) {
            this.statusIndicator.className = 'fixed bottom-4 left-4 px-4 py-2 rounded-full shadow-lg text-sm font-semibold z-50 transition-all bg-green-500 text-white';
            this.statusIndicator.innerHTML = '✅ Online';
            this.statusIndicator.style.display = 'block';

            // Hide after 3 seconds
            setTimeout(() => {
                if (this.isOnline) {
                    this.statusIndicator.style.display = 'none';
                }
            }, 3000);
        } else {
            this.statusIndicator.className = 'fixed bottom-4 left-4 px-4 py-2 rounded-full shadow-lg text-sm font-semibold z-50 transition-all bg-red-500 text-white animate-pulse';
            this.statusIndicator.innerHTML = '📡 Offline - Changes will sync when reconnected';
            this.statusIndicator.style.display = 'block';
        }
    },

    /**
     * Handle going online
     */
    async handleOnline() {
        console.log('✅ Connection restored');
        this.isOnline = true;
        this.updateStatusIndicator();

        // Show success message
        if (window.showMessage) {
            window.showMessage('✅ Back online!', 'success');
        }

        // Play success sound
        if (window.Sounds) {
            window.Sounds.playSuccess();
        }

        // Process pending operations
        await this.processPendingOperations();
    },

    /**
     * Handle going offline
     */
    handleOffline() {
        console.warn('⚠️ Connection lost');
        this.isOnline = false;
        this.updateStatusIndicator();

        // Show warning message
        if (window.showMessage) {
            window.showMessage('⚠️ You are offline. Changes will save when reconnected.', 'warning');
        }

        // Play error sound
        if (window.Sounds) {
            window.Sounds.playError();
        }
    },

    /**
     * Check actual connection (beyond navigator.onLine)
     */
    async checkConnection() {
        try {
            // Try to fetch a small resource
            const response = await fetch('https://www.google.com/favicon.ico', {
                method: 'HEAD',
                mode: 'no-cors',
                cache: 'no-cache'
            });

            if (!this.isOnline) {
                // Was offline, now online
                this.handleOnline();
            }
        } catch (error) {
            if (this.isOnline) {
                // Was online, now offline
                this.handleOffline();
            }
        }
    },

    /**
     * Queue operation for later execution
     * @param {Function} operation - Async operation to queue
     * @param {string} description - Human-readable description
     * @returns {Promise} Promise that resolves when operation completes (now or later)
     */
    async queueOperation(operation, description = 'Operation') {
        if (this.isOnline) {
            // If online, execute immediately
            try {
                return await operation();
            } catch (error) {
                // If fails due to network, queue it
                if (this.isNetworkError(error)) {
                    console.warn('Network error, queueing operation:', description);
                    return this.addToPending(operation, description);
                }
                throw error;
            }
        } else {
            // If offline, queue it
            console.log('Offline, queueing operation:', description);
            return this.addToPending(operation, description);
        }
    },

    /**
     * Add operation to pending queue
     * @param {Function} operation - Operation to queue
     * @param {string} description - Description
     * @returns {Promise} Promise that resolves when operation completes
     */
    addToPending(operation, description) {
        return new Promise((resolve, reject) => {
            // Check queue size
            if (this.pendingOperations.length >= this.maxPendingOps) {
                reject(new Error('Pending operations queue is full'));
                return;
            }

            // Add to queue
            this.pendingOperations.push({
                operation,
                description,
                resolve,
                reject,
                timestamp: Date.now()
            });

            console.log(`📥 Queued: ${description} (${this.pendingOperations.length} pending)`);

            // Save queue to localStorage
            this.saveQueue();

            // Show feedback
            if (window.showMessage) {
                window.showMessage(
                    `💾 ${description} saved for later (${this.pendingOperations.length} pending)`,
                    'info'
                );
            }
        });
    },

    /**
     * Process all pending operations
     */
    async processPendingOperations() {
        if (this.pendingOperations.length === 0) {
            console.log('📭 No pending operations');
            return;
        }

        console.log(`📤 Processing ${this.pendingOperations.length} pending operations...`);

        const operations = [...this.pendingOperations];
        this.pendingOperations = [];

        let successCount = 0;
        let failCount = 0;

        for (const pending of operations) {
            try {
                const result = await pending.operation();
                pending.resolve(result);
                successCount++;
                console.log(`✅ Processed: ${pending.description}`);
            } catch (error) {
                console.error(`❌ Failed: ${pending.description}`, error);

                // If still a network error, re-queue
                if (this.isNetworkError(error)) {
                    this.pendingOperations.push(pending);
                } else {
                    pending.reject(error);
                    failCount++;
                }
            }
        }

        // Save updated queue
        this.saveQueue();

        // Show results
        if (successCount > 0 && window.showMessage) {
            window.showMessage(
                `✅ Synced ${successCount} pending change${successCount > 1 ? 's' : ''}`,
                'success'
            );
        }

        if (failCount > 0 && window.showMessage) {
            window.showMessage(
                `⚠️ ${failCount} operation${failCount > 1 ? 's' : ''} failed to sync`,
                'warning'
            );
        }
    },

    /**
     * Check if error is network-related
     * @param {Error} error - Error to check
     * @returns {boolean}
     */
    isNetworkError(error) {
        if (!error) return false;

        const networkCodes = ['unavailable', 'deadline-exceeded', 'network'];
        const networkMessages = ['network', 'timeout', 'fetch', 'connection'];

        // Check error code
        if (error.code && networkCodes.some(code => error.code.includes(code))) {
            return true;
        }

        // Check error message
        if (error.message) {
            const msg = error.message.toLowerCase();
            return networkMessages.some(word => msg.includes(word));
        }

        return false;
    },

    /**
     * Save pending queue to localStorage
     */
    saveQueue() {
        try {
            // Can't serialize functions, so just save metadata
            const metadata = this.pendingOperations.map(op => ({
                description: op.description,
                timestamp: op.timestamp
            }));

            localStorage.setItem('pending_operations', JSON.stringify(metadata));
        } catch (error) {
            console.error('Error saving pending queue:', error);
        }
    },

    /**
     * Load pending queue from localStorage (metadata only)
     */
    loadQueue() {
        try {
            const stored = localStorage.getItem('pending_operations');
            if (stored) {
                const metadata = JSON.parse(stored);
                console.log(`📥 Found ${metadata.length} pending operations from previous session`);

                if (metadata.length > 0 && window.showMessage) {
                    window.showMessage(
                        `ℹ️ You have ${metadata.length} pending change${metadata.length > 1 ? 's' : ''} from offline mode`,
                        'info'
                    );
                }
            }
        } catch (error) {
            console.error('Error loading pending queue:', error);
        }
    },

    /**
     * Clear pending operations
     */
    clearQueue() {
        this.pendingOperations = [];
        localStorage.removeItem('pending_operations');
        console.log('🗑️ Pending queue cleared');
    },

    /**
     * Get queue status
     * @returns {Object} Queue status
     */
    getQueueStatus() {
        return {
            isOnline: this.isOnline,
            pendingCount: this.pendingOperations.length,
            operations: this.pendingOperations.map(op => ({
                description: op.description,
                timestamp: op.timestamp,
                age: Date.now() - op.timestamp
            }))
        };
    },

    /**
     * Show queue status to user
     */
    async showQueueStatus() {
        const status = this.getQueueStatus();

        let message = `Network Status: ${status.isOnline ? '✅ Online' : '❌ Offline'}\n`;
        message += `Pending Operations: ${status.pendingCount}\n`;

        if (status.pendingCount > 0) {
            message += '\nPending:\n';
            status.operations.forEach((op, i) => {
                const ageMinutes = Math.floor(op.age / 60000);
                message += `${i + 1}. ${op.description} (${ageMinutes}m ago)\n`;
            });
        }

        if (window.Modal) {
            await window.Modal.alert(message, 'Network Status', '🌐');
        } else {
            alert(message);
        }
    }
};

// Auto-initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        OfflineSupport.init();
        OfflineSupport.loadQueue();
    });
} else {
    OfflineSupport.init();
    OfflineSupport.loadQueue();
}

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.OfflineSupport = OfflineSupport;
}

console.log('✅ Offline support module loaded');
