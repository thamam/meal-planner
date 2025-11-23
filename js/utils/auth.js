// ==========================================
// 🔐 Authentication & Authorization Module
// ==========================================

/**
 * Authentication and authorization for Parent vs Child modes
 * Uses localStorage for demo - in production use Firebase Auth
 */
const Auth = {
    STORAGE_KEY: 'meal_planner_parent_auth',
    SESSION_KEY: 'meal_planner_session',

    /**
     * Initialize authentication system
     */
    init() {
        // Check if parent password is set
        const hasParentPassword = this.hasParentPassword();

        if (!hasParentPassword) {
            console.log('ℹ️ No parent password set. First-time setup required.');
        }

        // Clear session on page load (require re-auth each time)
        this.clearSession();
    },

    /**
     * Check if parent password is configured
     * @returns {boolean}
     */
    hasParentPassword() {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        return !!stored;
    },

    /**
     * Set up parent password (first-time setup)
     * @param {string} password - New password
     * @returns {Promise<boolean>} Success status
     */
    async setupParentPassword(password) {
        try {
            // Validate password strength
            if (!window.Security) {
                throw new Error('Security module not loaded');
            }

            const validation = window.Security.validatePassword(password);
            if (!validation.valid) {
                throw new Error(validation.message);
            }

            // Hash and store password
            const hashed = await window.Security.hashPassword(password);
            localStorage.setItem(this.STORAGE_KEY, hashed);

            console.log('✅ Parent password set up successfully');
            return true;
        } catch (error) {
            console.error('Error setting up parent password:', error);
            throw error;
        }
    },

    /**
     * Verify parent password
     * @param {string} password - Password to verify
     * @returns {Promise<boolean>} Is valid
     */
    async verifyParentPassword(password) {
        try {
            if (!this.hasParentPassword()) {
                // No password set yet - first time setup
                return false;
            }

            const stored = localStorage.getItem(this.STORAGE_KEY);
            const hashed = await window.Security.hashPassword(password);

            return stored === hashed;
        } catch (error) {
            console.error('Error verifying password:', error);
            return false;
        }
    },

    /**
     * Show parent login modal
     * @param {Object} options - Options
     * @returns {Promise<boolean>} Login success
     */
    async showParentLogin(options = {}) {
        const {
            title = 'Parent Login',
            message = 'Enter parent password to access parent features',
            allowSetup = true
        } = options;

        // Check if password is set
        const hasPassword = this.hasParentPassword();

        if (!hasPassword && allowSetup) {
            // First time - set up password
            return this.showParentSetup();
        }

        // Show login prompt
        const password = await window.Modal.prompt(
            message,
            '',
            {
                title: title,
                icon: '🔒',
                inputType: 'password',
                placeholder: 'Enter password',
                validator: (value) => {
                    if (!value) {
                        return { valid: false, message: 'Password is required' };
                    }
                    return { valid: true };
                }
            }
        );

        if (!password) {
            return false; // User cancelled
        }

        // Verify password
        const isValid = await this.verifyParentPassword(password);

        if (isValid) {
            // Create session
            this.createSession();

            if (window.Sounds) {
                window.Sounds.playSuccess();
            }

            return true;
        } else {
            await window.Modal.error(
                'Incorrect password. Please try again.',
                'Login Failed'
            );

            if (window.Sounds) {
                window.Sounds.playError();
            }

            return false;
        }
    },

    /**
     * Show parent password setup (first time)
     * @returns {Promise<boolean>} Setup success
     */
    async showParentSetup() {
        // Get new password (skip confirmation for streamlined flow)
        const password1 = await window.Modal.prompt(
            'Enter a password you\'ll remember (minimum 6 characters, with letters and numbers)',
            '',
            {
                title: 'Create Password',
                icon: '🔑',
                inputType: 'password',
                placeholder: 'Enter password',
                validator: (value) => {
                    const validation = window.Security.validatePassword(value);
                    return validation;
                }
            }
        );

        if (!password1) {
            return false;
        }

        // Confirm password
        const password2 = await window.Modal.prompt(
            'Please enter the same password again to confirm',
            '',
            {
                title: 'Confirm Password',
                icon: '🔑',
                inputType: 'password',
                placeholder: 'Confirm password',
                validator: (value) => {
                    if (value !== password1) {
                        return { valid: false, message: 'Passwords do not match' };
                    }
                    return { valid: true };
                }
            }
        );

        if (!password2 || password2 !== password1) {
            await window.Modal.error(
                'Password setup cancelled or passwords did not match.',
                'Setup Failed'
            );
            return false;
        }

        // Set up password
        try {
            await this.setupParentPassword(password1);
            this.createSession();

            await window.Modal.success(
                `Password set up successfully! You'll need this password to access parent features.\n\nIMPORTANT: Please remember this password - there's no recovery option yet.`,
                'Setup Complete'
            );

            if (window.Sounds) {
                window.Sounds.playSuccess();
            }

            return true;
        } catch (error) {
            await window.Modal.error(
                `Failed to set up password: ${error.message}`,
                'Setup Failed'
            );
            return false;
        }
    },

    /**
     * Create authentication session
     */
    createSession() {
        sessionStorage.setItem(this.SESSION_KEY, Date.now().toString());
    },

    /**
     * Clear authentication session
     */
    clearSession() {
        sessionStorage.removeItem(this.SESSION_KEY);
    },

    /**
     * Check if currently authenticated
     * @returns {boolean}
     */
    isAuthenticated() {
        const session = sessionStorage.getItem(this.SESSION_KEY);
        return !!session;
    },

    /**
     * Require parent authentication
     * @param {Function} callback - Function to call if authenticated
     * @param {Object} options - Login options
     * @returns {Promise<boolean>} Success status
     */
    async requireParentAuth(callback, options = {}) {
        // Check if already authenticated this session
        if (this.isAuthenticated()) {
            if (callback) await callback();
            return true;
        }

        // Show login
        const success = await this.showParentLogin(options);

        if (success && callback) {
            await callback();
        }

        return success;
    },

    /**
     * Reset parent password (security feature)
     * Requires user to know current password
     */
    async resetParentPassword() {
        if (!this.hasParentPassword()) {
            await window.Modal.warning(
                'No password is set up yet. Please set up a password first.',
                'No Password'
            );
            return;
        }

        // Verify current password first
        const currentPassword = await window.Modal.prompt(
            'Enter your current password',
            '',
            {
                title: 'Reset Password',
                icon: '🔒',
                inputType: 'password',
                placeholder: 'Current password'
            }
        );

        if (!currentPassword) {
            return;
        }

        const isValid = await this.verifyParentPassword(currentPassword);

        if (!isValid) {
            await window.Modal.error(
                'Incorrect current password.',
                'Reset Failed'
            );
            return;
        }

        // Get new password
        const newPassword = await window.Modal.prompt(
            'Enter your new password',
            '',
            {
                title: 'New Password',
                icon: '🔑',
                inputType: 'password',
                placeholder: 'New password',
                validator: (value) => window.Security.validatePassword(value)
            }
        );

        if (!newPassword) {
            return;
        }

        // Confirm new password
        const confirmPassword = await window.Modal.prompt(
            'Confirm your new password',
            '',
            {
                title: 'Confirm New Password',
                icon: '🔑',
                inputType: 'password',
                placeholder: 'Confirm new password',
                validator: (value) => {
                    if (value !== newPassword) {
                        return { valid: false, message: 'Passwords do not match' };
                    }
                    return { valid: true };
                }
            }
        );

        if (!confirmPassword || confirmPassword !== newPassword) {
            await window.Modal.error(
                'Password reset cancelled or passwords did not match.',
                'Reset Failed'
            );
            return;
        }

        // Update password
        try {
            await this.setupParentPassword(newPassword);

            await window.Modal.success(
                'Password updated successfully!',
                'Reset Complete'
            );

            if (window.Sounds) {
                window.Sounds.playSuccess();
            }
        } catch (error) {
            await window.Modal.error(
                `Failed to update password: ${error.message}`,
                'Reset Failed'
            );
        }
    },

    /**
     * Emergency password reset (clears password)
     * USE WITH CAUTION - for demo/development only
     */
    emergencyReset() {
        if (confirm('⚠️ WARNING: This will DELETE your parent password. You will need to set up a new one. Continue?')) {
            localStorage.removeItem(this.STORAGE_KEY);
            this.clearSession();
            alert('✅ Password cleared. You can now set up a new password.');
        }
    }
};

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.Auth = Auth;
}

console.log('✅ Authentication module loaded');
