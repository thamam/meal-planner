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
    operationRegistry: {}, // Registry of serializable operations

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

        // Load any pending operations from previous session
        this.loadQueue();

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
     * Register a serializable operation type
     * @param {string} type - Operation type identifier
     * @param {Function} handler - Function that takes data and returns a Promise
     */
    registerOperation(type, handler) {
        this.operationRegistry[type] = handler;
        console.log(`📝 Registered operation type: ${type}`);
    },

    /**
     * Queue operation for later execution
     * @param {Function|Object} operation - Async operation function OR operation descriptor {type, data}
     * @param {string} description - Human-readable description
     * @returns {Promise} Promise that resolves when operation completes (now or later)
     */
    async queueOperation(operation, description = 'Operation') {
        // Determine if operation is serializable (object descriptor) or function
        const isSerializable = typeof operation === 'object' && operation.type;

        if (this.isOnline) {
            // If online, execute immediately
            try {
                if (isSerializable) {
                    const handler = this.operationRegistry[operation.type];
                    if (!handler) {
                        throw new Error(`Unknown operation type: ${operation.type}`);
                    }
                    return await handler(operation.data);
                } else {
                    return await operation();
                }
            } catch (error) {
                // If fails due to network, queue it
                if (this.isNetworkError(error)) {
                    console.warn('Network error, queueing operation:', description);
                    return this.addToPending(operation, description, isSerializable);
                }
                throw error;
            }
        } else {
            // If offline, queue it
            console.log('Offline, queueing operation:', description);
            return this.addToPending(operation, description, isSerializable);
        }
    },

    /**
     * Add operation to pending queue
     * @param {Function|Object} operation - Operation to queue (function or descriptor)
     * @param {string} description - Description
     * @param {boolean} isSerializable - Whether operation can be serialized
     * @returns {Promise} Promise that resolves when operation completes
     */
    addToPending(operation, description, isSerializable = false) {
        return new Promise((resolve, reject) => {
            // Check queue size
            if (this.pendingOperations.length >= this.maxPendingOps) {
                reject(new Error('Pending operations queue is full'));
                return;
            }

            // Add to queue
            const pendingOp = {
                operation,
                description,
                resolve,
                reject,
                timestamp: Date.now(),
                isSerializable
            };

            this.pendingOperations.push(pendingOp);

            console.log(`📥 Queued: ${description} (${this.pendingOperations.length} pending)`);

            // Save queue to localStorage (only serializable operations persist)
            this.saveQueue();

            // Show feedback
            if (window.showMessage) {
                const warningNote = !isSerializable ? ' (will be lost on refresh)' : '';
                window.showMessage(
                    `💾 ${description} saved for later${warningNote} (${this.pendingOperations.length} pending)`,
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
                let result;

                // Execute operation based on type
                if (pending.isSerializable) {
                    const handler = this.operationRegistry[pending.operation.type];
                    if (!handler) {
                        throw new Error(`Unknown operation type: ${pending.operation.type}`);
                    }
                    result = await handler(pending.operation.data);
                } else {
                    result = await pending.operation();
                }

                if (pending.resolve) pending.resolve(result);
                successCount++;
                console.log(`✅ Processed: ${pending.description}`);
            } catch (error) {
                console.error(`❌ Failed: ${pending.description}`, error);

                // If still a network error, re-queue
                if (this.isNetworkError(error)) {
                    this.pendingOperations.push(pending);
                } else {
                    if (pending.reject) pending.reject(error);
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
     * Only serializable operations are saved; non-serializable operations are lost on page refresh
     */
    saveQueue() {
        try {
            // Filter for serializable operations only
            const serializableOps = this.pendingOperations
                .filter(op => op.isSerializable)
                .map(op => ({
                    operation: op.operation, // This is already a {type, data} object
                    description: op.description,
                    timestamp: op.timestamp,
                    isSerializable: true
                }));

            if (serializableOps.length > 0) {
                localStorage.setItem('pending_operations', JSON.stringify(serializableOps));
                console.log(`💾 Saved ${serializableOps.length} serializable operations to localStorage`);
            } else {
                localStorage.removeItem('pending_operations');
            }

            // Log warning for non-serializable operations
            const nonSerializableCount = this.pendingOperations.length - serializableOps.length;
            if (nonSerializableCount > 0) {
                console.warn(`⚠️ ${nonSerializableCount} non-serializable operation(s) will be lost on page refresh`);
            }
        } catch (error) {
            console.error('Error saving pending queue:', error);
        }
    },

    /**
     * Load pending queue from localStorage
     * Reconstructs serializable operations from saved descriptors
     */
    loadQueue() {
        try {
            const stored = localStorage.getItem('pending_operations');
            if (!stored) {
                return;
            }

            const savedOps = JSON.parse(stored);
            if (!Array.isArray(savedOps) || savedOps.length === 0) {
                return;
            }

            console.log(`📥 Loading ${savedOps.length} pending operations from previous session`);

            // Reconstruct pending operations
            let restoredCount = 0;
            for (const savedOp of savedOps) {
                // Verify operation type is registered
                if (!savedOp.operation || !savedOp.operation.type) {
                    console.warn(`⚠️ Skipping invalid saved operation:`, savedOp);
                    continue;
                }

                if (!this.operationRegistry[savedOp.operation.type]) {
                    console.warn(`⚠️ Skipping operation with unregistered type: ${savedOp.operation.type}`);
                    continue;
                }

                // Create a new promise for this operation
                const promise = new Promise((resolve, reject) => {
                    this.pendingOperations.push({
                        operation: savedOp.operation,
                        description: savedOp.description,
                        timestamp: savedOp.timestamp,
                        isSerializable: true,
                        resolve,
                        reject
                    });
                });

                restoredCount++;
            }

            if (restoredCount > 0) {
                console.log(`✅ Restored ${restoredCount} pending operations`);

                if (window.showMessage) {
                    window.showMessage(
                        `ℹ️ You have ${restoredCount} pending change${restoredCount > 1 ? 's' : ''} from offline mode`,
                        'info'
                    );
                }

                // If online, process them immediately
                if (this.isOnline) {
                    setTimeout(() => this.processPendingOperations(), 1000);
                }
            }
        } catch (error) {
            console.error('Error loading pending queue:', error);
            // Clear corrupted data
            localStorage.removeItem('pending_operations');
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
    });
} else {
    OfflineSupport.init();
}

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.OfflineSupport = OfflineSupport;
}

console.log('✅ Offline support module loaded');
