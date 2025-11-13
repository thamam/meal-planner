// ==========================================
// 🔧 App Improvements - Enhanced Functions
// ==========================================
// This file contains improved versions of critical functions from app.js
// that use the new security, error handling, and state management utilities
//
// TO INTEGRATE: Replace the corresponding functions in app.js with these improved versions

// ==========================================
// IMPROVED: Profile Management with Security
// ==========================================

/**
 * Save user profile with validation and security
 * REPLACES: async function saveProfile() in app.js (line 279)
 */
async function saveProfile_IMPROVED() {
    const name = document.getElementById('profileName').value.trim();
    const age = document.getElementById('profileAge').value;

    // Validate inputs using Security module
    if (!window.Security || !window.Security.isValidName(name)) {
        await window.Modal.error('Please enter a valid name (letters only, 1-50 characters)');
        if (window.Sounds) window.Sounds.playError();
        return;
    }

    const ageNum = parseInt(age);
    if (!window.Security.isValidAge(ageNum)) {
        await window.Modal.error('Age must be between 4 and 12 years');
        if (window.Sounds) window.Sounds.playError();
        return;
    }

    if (!window.Security.isValidEmoji(window.selectedAvatar)) {
        await window.Modal.error('Please select a valid avatar');
        if (window.Sounds) window.Sounds.playError();
        return;
    }

    // Sanitize inputs
    const sanitizedName = window.Security.sanitizeInput(name);

    // Save sound preferences
    let preferences = '{}';
    if (window.Sounds) {
        preferences = window.Sounds.saveSoundPreferences(window.currentUser) || '{}';
    }

    // Create user data with validation
    const userData = {
        name: sanitizedName,
        age: ageNum,
        avatar: window.selectedAvatar,
        preferences: preferences
    };

    // Validate against schema
    const validation = window.validateSchema(userData, {
        name: (v) => window.Security.isValidName(v),
        age: (v) => window.Security.isValidAge(v),
        avatar: (v) => window.Security.isValidEmoji(v),
        preferences: (v) => typeof v === 'string'
    });

    if (!validation.valid) {
        await window.Modal.error(`Validation failed: ${validation.message}`);
        if (window.Sounds) window.Sounds.playError();
        return;
    }

    // Use ErrorHandler for async operation
    const savedUser = await window.ErrorHandler.handleAsync(async () => {
        if (!window.FirebaseAPI) {
            throw window.ErrorHandler.createError(
                'FirebaseAPI is not loaded. Please refresh the page.',
                'FIREBASE_NOT_LOADED'
            );
        }

        console.log('Attempting to save user:', userData);
        let result;

        if (window.currentUser && window.currentUser.id) {
            console.log('Updating existing user:', window.currentUser.id);
            result = await window.FirebaseAPI.updateUser(window.currentUser.id, userData);
        } else {
            console.log('Creating new user');
            result = await window.FirebaseAPI.createUser(userData);
        }

        return result;
    }, null, true);

    if (!savedUser) {
        // Error already shown by ErrorHandler
        if (window.Sounds) window.Sounds.playError();
        return;
    }

    console.log('User saved successfully:', savedUser);

    window.currentUser = { ...userData, id: savedUser.id };

    // Save to localStorage with error handling
    window.ErrorHandler.handleSync(() => {
        localStorage.setItem('mealPlannerUser', JSON.stringify(window.currentUser));
    }, null, false);

    // Load user-specific data
    await window.loadCustomFoods();
    await window.loadUserRules();
    window.renderCategorizedFoodPalette();

    window.updateUserDisplay();
    window.closeProfileModal();

    window.showMessage('👤 Profile saved! Welcome, ' + sanitizedName + '!', 'success');
    if (window.Sounds) window.Sounds.playSuccess();
}

// ==========================================
// IMPROVED: Tab Switching with Authentication
// ==========================================

/**
 * Switch tabs with parent authentication
 * REPLACES: function switchTab(tab) in app.js (line 966)
 */
async function switchTab_IMPROVED(tab) {
    // If switching to parent view, require authentication
    if (tab === 'parent') {
        const authorized = await window.Auth.requireParentAuth();

        if (!authorized) {
            // User cancelled or authentication failed
            return;
        }
    }

    // Update tab UI
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active', 'bg-white', 'text-purple-600');
        btn.classList.add('bg-purple-100', 'text-purple-600');
    });

    if (tab === 'planner') {
        document.getElementById('tab-planner').classList.add('active', 'bg-white');
        document.getElementById('plannerTab').classList.remove('hidden');
        document.getElementById('parentTab').classList.add('hidden');
    } else {
        document.getElementById('tab-parent').classList.add('active', 'bg-white');
        document.getElementById('plannerTab').classList.add('hidden');
        document.getElementById('parentTab').classList.remove('hidden');
        window.updateParentView();
    }

    if (window.Sounds) window.Sounds.playClick();
}

// ==========================================
// IMPROVED: Clear Week with Confirmation
// ==========================================

/**
 * Clear week with custom modal confirmation
 * REPLACES: function clearWeek() in app.js (line 938)
 */
async function clearWeek_IMPROVED() {
    const confirmed = await window.Modal.confirm(
        'Are you sure you want to clear all meals for this week? This action cannot be undone!',
        'Clear Week',
        {
            icon: '🗑️',
            confirmText: 'Yes, Clear It',
            cancelText: 'No, Keep It',
            confirmClass: 'bg-red-500 hover:bg-red-600 text-white',
            cancelClass: 'bg-gray-300 hover:bg-gray-400 text-gray-700'
        }
    );

    if (!confirmed) {
        return;
    }

    if (window.AutoSave) {
        window.AutoSave.saveToHistory(window.weeklyMeals);
    }

    window.weeklyMeals = {
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: []
    };
    window.updateWeeklyPlanDisplay();

    if (window.AutoSave) {
        window.AutoSave.triggerAutoSave(window.saveMealPlan, window.currentUser);
    }

    window.showMessage('🗑️ Week cleared!', 'info');
    if (window.Sounds) window.Sounds.playClick();
}

// ==========================================
// IMPROVED: Save Custom Food with Validation
// ==========================================

/**
 * Save custom food with comprehensive validation
 * REPLACES: async function saveCustomFood() in app.js (line 2016)
 */
async function saveCustomFood_IMPROVED() {
    if (!currentUser) {
        await Modal.warning('Please create a profile first!');
        return;
    }

    const name = document.getElementById('customFoodName').value.trim();
    const category = document.getElementById('customFoodCategory').value;
    const icon = document.getElementById('customFoodIcon').value.trim();
    const limit = parseInt(document.getElementById('customFoodLimit').value) || 0;
    const isSweet = document.getElementById('customFoodSweet').checked;

    // Validate using ValidationSchemas
    const customFood = {
        name: name,
        category: category,
        icon: icon,
        weekly_limit: limit,
        is_sweet: isSweet
    };

    const validation = validateSchema(customFood, ValidationSchemas.customFood);

    if (!validation.valid) {
        await Modal.error(`Validation failed:\n${validation.message}`);
        return;
    }

    // Sanitize name
    const sanitizedName = Security.sanitizeInput(name);

    // Save to Firebase with error handling
    const savedFood = await ErrorHandler.handleAsync(async () => {
        const foodData = {
            user_id: currentUser.id,
            name: sanitizedName,
            category: category,
            icon: icon,
            weekly_limit: limit,
            is_sweet: isSweet
        };

        const result = await ErrorHandler.withTimeout(
            FirebaseAPI.createCustomFood(foodData),
            10000,
            'Saving custom food timeout'
        );

        return result;
    }, null, true);

    if (!savedFood) {
        if (window.Sounds) Sounds.playError();
        return;
    }

    savedFood.type = 'custom';
    savedFood.ingredients = JSON.stringify([sanitizedName]);

    customFoods.push(savedFood);

    // Re-render
    window.renderCategorizedFoodPalette();
    window.renderCustomFoodsList();

    window.closeAddCustomFoodForm();
    await Modal.success(`Added ${sanitizedName} to your palette!`);
    if (window.Sounds) Sounds.playSuccess();
}

// ==========================================
// IMPROVED: Delete Custom Food with Confirmation
// ==========================================

/**
 * Delete custom food with confirmation
 * REPLACES: async function deleteCustomFood(foodId) in app.js (line 2064)
 */
async function deleteCustomFood_IMPROVED(foodId) {
    const food = customFoods.find(f => f.id === foodId);
    if (!food) {
        await Modal.error('Food item not found');
        return;
    }

    const confirmed = await Modal.confirm(
        `Are you sure you want to delete "${food.name}"? This will remove it from your food palette.`,
        'Delete Custom Food',
        {
            icon: '🗑️',
            confirmText: 'Yes, Delete',
            cancelText: 'Cancel',
            confirmClass: 'bg-red-500 hover:bg-red-600 text-white'
        }
    );

    if (!confirmed) {
        return;
    }

    const success = await ErrorHandler.handleAsync(async () => {
        await ErrorHandler.withTimeout(
            FirebaseAPI.deleteCustomFood(foodId),
            10000,
            'Delete operation timeout'
        );
        return true;
    }, false, true);

    if (!success) {
        if (window.Sounds) Sounds.playError();
        return;
    }

    customFoods = customFoods.filter(f => f.id !== foodId);

    // Re-render
    window.renderCategorizedFoodPalette();
    window.renderCustomFoodsList();

    window.showMessage('🗑️ Custom food deleted!', 'info');
    if (window.Sounds) Sounds.playClick();
}

// ==========================================
// IMPROVED: Load User from Storage with Validation
// ==========================================

/**
 * Load user from localStorage with validation
 * REPLACES: function loadUserFromStorage() in app.js (line 207)
 */
function loadUserFromStorage_IMPROVED() {
    const savedUser = localStorage.getItem('mealPlannerUser');
    if (!savedUser) {
        return;
    }

    ErrorHandler.handleSync(() => {
        // Safe JSON parse
        const user = safeJSONParse(savedUser, null);

        if (!user) {
            throw new Error('Invalid user data format');
        }

        // Validate user data
        const validation = validateSchema(user, ValidationSchemas.user);

        if (!validation.valid) {
            console.warn('Invalid user data in localStorage:', validation.message);
            localStorage.removeItem('mealPlannerUser');
            return;
        }

        // Sanitize user data
        user.name = Security.sanitizeInput(user.name);

        currentUser = user;
        window.updateUserDisplay();
    }, null, false);
}

// ==========================================
// IMPROVED: Parent Settings Access
// ==========================================

/**
 * Show parent settings with authentication
 * REPLACES: function showParentSettings() in app.js (line 1381)
 */
async function showParentSettings_IMPROVED() {
    const authorized = await Auth.requireParentAuth();

    if (!authorized) {
        return;
    }

    const modal = document.getElementById('parentSettingsModal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');

    // Load current settings
    window.loadParentSettingsUI();

    if (window.Sounds) Sounds.playClick();
}

// ==========================================
// INTEGRATION HELPER
// ==========================================

/**
 * Replace old functions with improved versions
 * Call this after DOM is loaded to apply improvements
 */
function applyImprovements() {
    // Replace global functions
    window.saveProfile = saveProfile_IMPROVED;
    window.switchTab = switchTab_IMPROVED;
    window.clearWeek = clearWeek_IMPROVED;
    window.saveCustomFood = saveCustomFood_IMPROVED;
    window.deleteCustomFood = deleteCustomFood_IMPROVED;
    window.loadUserFromStorage = loadUserFromStorage_IMPROVED;
    window.showParentSettings = showParentSettings_IMPROVED;

    // Initialize Auth system
    Auth.init();

    console.log('✅ App improvements applied');
}

// Auto-apply improvements when loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyImprovements);
} else {
    applyImprovements();
}

console.log('✅ App improvements module loaded');
