// ==========================================
// 🔒 Security & Validation Utilities
// ==========================================

/**
 * Security utilities for input sanitization and validation
 */
const Security = {
    /**
     * Sanitize user input to prevent XSS attacks
     * @param {string} input - Raw user input
     * @returns {string} Sanitized input
     */
    sanitizeInput(input) {
        if (typeof input !== 'string') return '';

        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    },

    /**
     * Sanitize HTML content while preserving safe tags
     * @param {string} html - HTML content
     * @returns {string} Sanitized HTML
     */
    sanitizeHTML(html) {
        if (typeof html !== 'string') return '';

        const allowedTags = ['b', 'i', 'em', 'strong', 'span'];
        const div = document.createElement('div');
        div.innerHTML = html;

        // Remove scripts and dangerous elements
        const scripts = div.querySelectorAll('script, iframe, object, embed');
        scripts.forEach(script => script.remove());

        return div.innerHTML;
    },

    /**
     * Validate email format
     * @param {string} email - Email address
     * @returns {boolean} Is valid
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    /**
     * Validate name (alphanumeric and common characters only)
     * @param {string} name - Name to validate
     * @returns {boolean} Is valid
     */
    isValidName(name) {
        if (!name || typeof name !== 'string') return false;

        const nameRegex = /^[a-zA-Z\u0590-\u05FF\s'-]{1,50}$/; // English and Hebrew
        return nameRegex.test(name.trim());
    },

    /**
     * Validate age for kids app (4-12 years)
     * @param {number} age - Age to validate
     * @returns {boolean} Is valid
     */
    isValidAge(age) {
        return typeof age === 'number' && age >= 4 && age <= 12;
    },

    /**
     * Validate emoji (check if it's a valid single emoji)
     * @param {string} emoji - Emoji to validate
     * @returns {boolean} Is valid
     */
    isValidEmoji(emoji) {
        if (!emoji || typeof emoji !== 'string') return false;

        // Check if it's a valid emoji (Unicode emoji ranges)
        const emojiRegex = /^(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)$/u;
        return emojiRegex.test(emoji.trim());
    },

    /**
     * Generate a secure random ID
     * @returns {string} Random ID
     */
    generateId() {
        return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    },

    /**
     * Hash a password (simple for demo - use proper auth in production)
     * @param {string} password - Password to hash
     * @returns {Promise<string>} Hashed password
     */
    async hashPassword(password) {
        // In production, use Firebase Auth or bcrypt
        // This is a simple implementation for demo purposes
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hash = await crypto.subtle.digest('SHA-256', data);
        return Array.from(new Uint8Array(hash))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    },

    /**
     * Validate password strength
     * @param {string} password - Password to validate
     * @returns {Object} Validation result with strength level
     */
    validatePassword(password) {
        if (!password || typeof password !== 'string') {
            return { valid: false, strength: 'none', message: 'Password is required' };
        }

        const minLength = 6;
        const hasNumber = /\d/.test(password);
        const hasLetter = /[a-zA-Z]/.test(password);

        if (password.length < minLength) {
            return {
                valid: false,
                strength: 'weak',
                message: `Password must be at least ${minLength} characters`
            };
        }

        if (!hasNumber || !hasLetter) {
            return {
                valid: true,
                strength: 'medium',
                message: 'Password is okay, but could be stronger with letters and numbers'
            };
        }

        return {
            valid: true,
            strength: 'strong',
            message: 'Password is strong!'
        };
    }
};

/**
 * Data validation schemas
 */
const ValidationSchemas = {
    user: {
        id: (v) => typeof v === 'string' && v.length > 0,
        name: (v) => Security.isValidName(v),
        age: (v) => Security.isValidAge(v),
        avatar: (v) => Security.isValidEmoji(v),
        preferences: (v) => typeof v === 'string' || typeof v === 'object'
    },

    foodItem: {
        id: (v) => typeof v === 'string' && v.length > 0,
        name: (v) => typeof v === 'string' && v.length > 0 && v.length <= 100,
        category: (v) => ['protein', 'veggie', 'fruit', 'grain', 'dairy', 'snack'].includes(v),
        icon: (v) => Security.isValidEmoji(v),
        weekly_limit: (v) => typeof v === 'number' && v >= 0 && v <= 7
    },

    customFood: {
        name: (v) => typeof v === 'string' && v.length > 0 && v.length <= 100,
        category: (v) => ['protein', 'veggie', 'fruit', 'grain', 'dairy', 'snack'].includes(v),
        icon: (v) => Security.isValidEmoji(v),
        weekly_limit: (v) => typeof v === 'number' && v >= 0 && v <= 7,
        is_sweet: (v) => typeof v === 'boolean'
    }
};

/**
 * Validate data against a schema
 * @param {Object} data - Data to validate
 * @param {Object} schema - Validation schema
 * @returns {Object} Validation result
 */
function validateSchema(data, schema) {
    const errors = [];

    for (const [key, validator] of Object.entries(schema)) {
        if (data[key] === undefined) {
            errors.push(`Missing required field: ${key}`);
            continue;
        }

        if (!validator(data[key])) {
            errors.push(`Invalid value for ${key}: ${data[key]}`);
        }
    }

    return {
        valid: errors.length === 0,
        errors: errors,
        message: errors.length > 0 ? errors.join(', ') : 'Validation passed'
    };
}

/**
 * Safe JSON parse with fallback
 * @param {string} jsonString - JSON string to parse
 * @param {*} fallback - Fallback value if parsing fails
 * @returns {*} Parsed value or fallback
 */
function safeJSONParse(jsonString, fallback = null) {
    try {
        return JSON.parse(jsonString);
    } catch (error) {
        console.warn('JSON parse error:', error);
        return fallback;
    }
}

/**
 * Safe JSON stringify
 * @param {*} value - Value to stringify
 * @param {string} fallback - Fallback string if stringify fails
 * @returns {string} JSON string or fallback
 */
function safeJSONStringify(value, fallback = '{}') {
    try {
        return JSON.stringify(value);
    } catch (error) {
        console.warn('JSON stringify error:', error);
        return fallback;
    }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.Security = Security;
    window.ValidationSchemas = ValidationSchemas;
    window.validateSchema = validateSchema;
    window.safeJSONParse = safeJSONParse;
    window.safeJSONStringify = safeJSONStringify;
}

console.log('✅ Security utilities loaded');
