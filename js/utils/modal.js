// ==========================================
// 🪟 Custom Modal Components
// ==========================================

/**
 * Custom modal manager to replace native alert/confirm/prompt dialogs
 */
const Modal = {
    /**
     * Show alert modal
     * @param {string} message - Message to display
     * @param {string} title - Modal title
     * @param {string} icon - Icon emoji
     * @returns {Promise<void>}
     */
    async alert(message, title = 'Notice', icon = 'ℹ️') {
        return new Promise((resolve) => {
            this.show({
                title: `${icon} ${title}`,
                message: message,
                buttons: [
                    {
                        text: 'OK',
                        class: 'bg-purple-500 hover:bg-purple-600 text-white',
                        onClick: () => {
                            this.hide();
                            resolve();
                        }
                    }
                ]
            });
        });
    },

    /**
     * Show confirm modal
     * @param {string} message - Message to display
     * @param {string} title - Modal title
     * @param {Object} options - Additional options
     * @returns {Promise<boolean>} User's choice
     */
    async confirm(message, title = 'Confirm', options = {}) {
        const {
            icon = '❓',
            confirmText = 'Yes',
            cancelText = 'No',
            confirmClass = 'bg-green-500 hover:bg-green-600 text-white',
            cancelClass = 'bg-gray-300 hover:bg-gray-400 text-gray-700'
        } = options;

        return new Promise((resolve) => {
            this.show({
                title: `${icon} ${title}`,
                message: message,
                buttons: [
                    {
                        text: confirmText,
                        class: confirmClass,
                        onClick: () => {
                            this.hide();
                            resolve(true);
                        }
                    },
                    {
                        text: cancelText,
                        class: cancelClass,
                        onClick: () => {
                            this.hide();
                            resolve(false);
                        }
                    }
                ]
            });
        });
    },

    /**
     * Show prompt modal
     * @param {string} message - Message to display
     * @param {string} defaultValue - Default input value
     * @param {Object} options - Additional options
     * @returns {Promise<string|null>} User input or null if cancelled
     */
    async prompt(message, defaultValue = '', options = {}) {
        const {
            title = 'Input Required',
            icon = '✏️',
            inputType = 'text',
            placeholder = '',
            validator = null
        } = options;

        return new Promise((resolve) => {
            const inputId = 'modal-prompt-input';

            this.show({
                title: `${icon} ${title}`,
                message: message,
                content: `
                    <input
                        type="${inputType}"
                        id="${inputId}"
                        value="${this.escapeHtml(defaultValue)}"
                        placeholder="${this.escapeHtml(placeholder)}"
                        class="w-full px-4 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-500 outline-none text-lg"
                        autofocus
                    />
                    <div id="modal-prompt-error" class="text-red-500 text-sm mt-2 hidden"></div>
                `,
                buttons: [
                    {
                        text: 'OK',
                        class: 'bg-purple-500 hover:bg-purple-600 text-white',
                        onClick: () => {
                            const input = document.getElementById(inputId);
                            const value = input ? input.value.trim() : '';

                            // Validate if validator provided
                            if (validator) {
                                const validation = validator(value);
                                if (!validation.valid) {
                                    const errorDiv = document.getElementById('modal-prompt-error');
                                    if (errorDiv) {
                                        errorDiv.textContent = validation.message;
                                        errorDiv.classList.remove('hidden');
                                    }
                                    return; // Don't close modal
                                }
                            }

                            this.hide();
                            resolve(value || null);
                        }
                    },
                    {
                        text: 'Cancel',
                        class: 'bg-gray-300 hover:bg-gray-400 text-gray-700',
                        onClick: () => {
                            this.hide();
                            resolve(null);
                        }
                    }
                ]
            });

            // Add Enter key support
            setTimeout(() => {
                const input = document.getElementById(inputId);
                if (input) {
                    input.focus();
                    input.addEventListener('keydown', (e) => {
                        if (e.key === 'Enter') {
                            const okButton = document.querySelector('.modal-custom button');
                            if (okButton) okButton.click();
                        }
                    });
                }
            }, 100);
        });
    },

    /**
     * Show custom modal
     * @param {Object} config - Modal configuration
     */
    show(config) {
        const {
            title = 'Modal',
            message = '',
            content = '',
            buttons = [],
            closeOnBackdrop = false
        } = config;

        // Remove existing modal if any
        this.hide();

        // Create modal HTML
        const modalHTML = `
            <div id="custom-modal" class="modal-custom fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
                <div class="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4 animate-slideUp">
                    <h2 class="text-2xl font-bold text-purple-600 mb-4">${this.escapeHtml(title)}</h2>

                    ${message ? `<p class="text-gray-700 mb-6 text-lg">${this.escapeHtml(message)}</p>` : ''}

                    ${content ? `<div class="mb-6">${content}</div>` : ''}

                    <div class="flex gap-3">
                        ${buttons.map((btn, index) => `
                            <button
                                class="flex-1 px-6 py-3 rounded-full font-semibold transition ${btn.class}"
                                data-button-index="${index}">
                                ${this.escapeHtml(btn.text)}
                            </button>
                        `).join('')}
                    </div>
                </div>
            </div>

            <style>
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out;
                }

                .animate-slideUp {
                    animation: slideUp 0.3s ease-out;
                }
            </style>
        `;

        // Add to DOM
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Attach button event listeners
        const modal = document.getElementById('custom-modal');
        if (modal) {
            buttons.forEach((btn, index) => {
                const button = modal.querySelector(`[data-button-index="${index}"]`);
                if (button && btn.onClick) {
                    button.addEventListener('click', btn.onClick);
                }
            });

            // Close on backdrop click if enabled
            if (closeOnBackdrop) {
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        this.hide();
                    }
                });
            }

            // Play sound
            if (window.Sounds) {
                window.Sounds.playClick();
            }
        }
    },

    /**
     * Hide and remove modal
     */
    hide() {
        const modal = document.getElementById('custom-modal');
        if (modal) {
            modal.style.opacity = '0';
            setTimeout(() => modal.remove(), 200);
        }
    },

    /**
     * Escape HTML to prevent XSS
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    /**
     * Show loading modal
     * @param {string} message - Loading message
     * @returns {Object} Modal controller with close method
     */
    showLoading(message = 'Loading...') {
        this.show({
            title: '⏳ Please Wait',
            content: `
                <div class="flex flex-col items-center py-4">
                    <div class="loading-spinner mb-4"></div>
                    <p class="text-gray-600">${this.escapeHtml(message)}</p>
                </div>

                <style>
                    .loading-spinner {
                        width: 50px;
                        height: 50px;
                        border: 4px solid #f3f4f6;
                        border-top: 4px solid #8b5cf6;
                        border-radius: 50%;
                        animation: spin 1s linear infinite;
                    }

                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                </style>
            `,
            buttons: [],
            closeOnBackdrop: false
        });

        return {
            close: () => this.hide()
        };
    },

    /**
     * Show success modal
     * @param {string} message - Success message
     * @param {string} title - Modal title
     * @returns {Promise<void>}
     */
    async success(message, title = 'Success') {
        return this.alert(message, title, '✅');
    },

    /**
     * Show error modal
     * @param {string} message - Error message
     * @param {string} title - Modal title
     * @returns {Promise<void>}
     */
    async error(message, title = 'Error') {
        return this.alert(message, title, '❌');
    },

    /**
     * Show warning modal
     * @param {string} message - Warning message
     * @param {string} title - Modal title
     * @returns {Promise<void>}
     */
    async warning(message, title = 'Warning') {
        return this.alert(message, title, '⚠️');
    }
};

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.Modal = Modal;
}

console.log('✅ Modal utilities loaded');
