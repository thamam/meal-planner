// ==========================================
// 🍱 Kids' Meal Planner - Integrated Enhanced Version
// ==========================================

// ==========================================
// Global State
// ==========================================

let currentUser = null;
let foodItems = [];
let compositeItems = [];
let customFoods = [];
let weeklyMeals = {
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: []
};
let isLoadingMealPlan = false; // Prevent race conditions
let selectedAvatar = '😊';
window.selectedAvatar = '😊'; // CRITICAL: Also expose on window for app-improvements.js
let currentCompositeItem = null;
let compositeSelections = {};

// Days configuration
const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
const dayLabels = {
    monday: 'Monday 🌟',
    tuesday: 'Tuesday 🌈',
    wednesday: 'Wednesday 🦋',
    thursday: 'Thursday 🚀',
    friday: 'Friday 🎉'
};

// ==========================================
// Initialization
// ==========================================

document.addEventListener('DOMContentLoaded', async () => {
    console.log('🍱 Initializing Kids Meal Planner Enhanced...');
    
    // Wait for Firebase to be ready with timeout
    if (!window.FirebaseAPI) {
        console.warn('⏳ Waiting for FirebaseAPI to load...');
        try {
            await new Promise((resolve, reject) => {
                let checkInterval = null;

                const timeout = setTimeout(() => {
                    if (checkInterval) clearInterval(checkInterval);
                    reject(new Error('Firebase initialization timeout after 10 seconds'));
                }, 10000); // 10 second timeout

                checkInterval = setInterval(() => {
                    if (window.FirebaseAPI) {
                        clearInterval(checkInterval);
                        clearTimeout(timeout);
                        console.log('✅ FirebaseAPI is ready');
                        resolve();
                    }
                }, 100);
            });
        } catch (error) {
            console.error('❌ Firebase initialization failed:', error);
            showMessage('⚠️ Unable to connect to database. App running in offline mode.', 'warning');
            // Continue with app initialization but in offline mode
        }
    }
    
    // Initialize language (FIRST - before any UI)
    if (window.i18n) {
        i18n.initLanguage();
    }
    
    // Load user from localStorage
    loadUserFromStorage();
    
    // Initialize sound system
    if (window.Sounds) {
        Sounds.initSounds();
        if (currentUser) {
            Sounds.loadSoundPreferences(currentUser);
        }
    }
    
    // Load data from database with error handling
    try {
        await loadFoodItems();
        await loadCompositeItems();

        if (currentUser) {
            await loadCustomFoods();
            await loadUserRules();
        }
    } catch (error) {
        console.error('❌ Error loading initial data:', error);
        showMessage('⚠️ Some data failed to load. App may have limited functionality.', 'warning');
    }

    // Render food palette with categories
    try {
        renderCategorizedFoodPalette();
    } catch (error) {
        console.error('❌ Error rendering food palette:', error);
        showMessage('⚠️ Error displaying food items', 'error');
    }

    // Render weekly plan grid
    try {
        renderWeeklyPlan();
    } catch (error) {
        console.error('❌ Error rendering weekly plan:', error);
        showMessage('⚠️ Error displaying weekly plan', 'error');
    }

    // Check if there's a saved meal plan to load
    if (currentUser) {
        try {
            await autoLoadMealPlan();
            // Initialize history with current state
            if (window.AutoSave) {
                AutoSave.saveToHistory(weeklyMeals);
            }
        } catch (error) {
            console.error('❌ Error auto-loading meal plan:', error);
            // Continue with empty meal plan
        }
    } else {
        // Show welcome screen for first-time users
        try {
            showWelcomeScreen();
        } catch (error) {
            console.error('❌ Error showing welcome screen:', error);
        }
    }

    // Setup keyboard shortcuts
    try {
        setupKeyboardShortcuts();
    } catch (error) {
        console.error('❌ Error setting up keyboard shortcuts:', error);
    }

    // Update UI with current language
    if (window.updateLanguageUI) {
        try {
            updateLanguageUI();
        } catch (error) {
            console.error('❌ Error updating language UI:', error);
        }
    }

    console.log('✅ App initialized with enhanced features!');
});

// ==========================================
// Welcome Screen
// ==========================================

function showWelcomeScreen() {
    const hasVisited = localStorage.getItem('hasVisited');
    if (!hasVisited) {
        const welcomeScreen = document.getElementById('welcomeScreen');
        welcomeScreen.classList.remove('hidden');
        welcomeScreen.classList.add('flex');
    }
}

function startPlanning() {
    localStorage.setItem('hasVisited', 'true');
    const welcomeScreen = document.getElementById('welcomeScreen');
    welcomeScreen.classList.add('hidden');
    welcomeScreen.classList.remove('flex');
    
    if (window.Sounds) Sounds.playClick();
    
    // Show profile modal
    setTimeout(() => {
        showProfileModal();
    }, 500);
}

// ==========================================
// Keyboard Shortcuts
// ==========================================

function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + Z = Undo
        if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
            e.preventDefault();
            undo();
        }
        
        // Ctrl/Cmd + S = Manual Save
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            saveMealPlan();
        }
    });
}

// ==========================================
// User Profile Management
// ==========================================

function loadUserFromStorage() {
    const savedUser = localStorage.getItem('mealPlannerUser');
    if (savedUser) {
        try {
            const user = JSON.parse(savedUser);
            // Validate required fields
            if (!user.id || !user.name || !user.age || !user.avatar) {
                console.warn('Invalid user data in localStorage');
                localStorage.removeItem('mealPlannerUser');
                return;
            }
            currentUser = user;
            updateUserDisplay();
        } catch (error) {
            console.error('Error parsing user data from localStorage:', error);
            localStorage.removeItem('mealPlannerUser');
            currentUser = null;
        }
    }
}

function updateUserDisplay() {
    // Use either local or window currentUser (for app-improvements.js compatibility)
    const user = currentUser || window.currentUser;
    if (user) {
        const userName = document.getElementById('userName');
        const userAge = document.getElementById('userAge');
        const avatarDisplay = document.getElementById('avatarDisplay');
        const userInfo = document.getElementById('userInfo');

        if (userName) userName.textContent = user.name;
        if (userAge) userAge.textContent = user.age;
        if (avatarDisplay) avatarDisplay.textContent = user.avatar;
        if (userInfo) userInfo.classList.remove('hidden');
    }
}

function showProfileModal() {
    const modal = document.getElementById('profileModal');
    if (!modal) {
        console.error('❌ Profile modal not found');
        return;
    }
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    
    // Pre-fill if user exists
    if (currentUser) {
        document.getElementById('profileName').value = currentUser.name || '';
        document.getElementById('profileAge').value = currentUser.age || '';
        selectedAvatar = currentUser.avatar || '😊';
        window.selectedAvatar = selectedAvatar; // CRITICAL: Also set on window
    }
    
    if (window.Sounds) Sounds.playClick();
}

function closeProfileModal() {
    const modal = document.getElementById('profileModal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    
    if (window.Sounds) Sounds.playClick();
}

function selectAvatar(emoji) {
    selectedAvatar = emoji;
    window.selectedAvatar = emoji;  // CRITICAL: Also set on window for app-improvements.js
    document.querySelectorAll('.avatar-option').forEach(btn => {
        btn.style.background = '';
    });
    event.target.style.background = '#e9d5ff';

    if (window.Sounds) Sounds.playClick();
}

async function saveProfile() {
    const name = document.getElementById('profileName').value.trim();
    const age = document.getElementById('profileAge').value;
    
    if (!name || !age) {
        alert('Please enter your name and age!');
        if (window.Sounds) Sounds.playError();
        return;
    }
    
    // Save sound preferences
    let preferences = '{}';
    if (window.Sounds && typeof Sounds.saveSoundPreferences === 'function') {
        try {
            preferences = Sounds.saveSoundPreferences(currentUser) || '{}';
        } catch (e) {
            console.warn('Could not save sound preferences:', e);
        }
    }
    
    // Create or update user
    const userData = {
        name: name,
        age: parseInt(age),
        avatar: selectedAvatar,
        preferences: preferences
    };
    
    try {
        console.log('Attempting to save user:', userData);
        let savedUser;

        // Check if FirebaseAPI is available
        if (window.FirebaseAPI) {
            if (currentUser && currentUser.id) {
                // Update existing user
                console.log('Updating existing user:', currentUser.id);
                savedUser = await FirebaseAPI.updateUser(currentUser.id, userData);
            } else {
                // Create new user
                console.log('Creating new user');
                savedUser = await FirebaseAPI.createUser(userData);
            }

            console.log('User saved successfully:', savedUser);
            currentUser = { ...userData, id: savedUser.id };
        } else {
            // Fallback: Save locally without Firebase
            console.log('FirebaseAPI not available, saving locally');
            const localId = currentUser?.id || 'local-user-' + Date.now();
            currentUser = { ...userData, id: localId };
        }

        // Save to localStorage (both keys for compatibility)
        localStorage.setItem('mealPlannerUser', JSON.stringify(currentUser));
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        // Close modal and show success - this happens regardless of other loads
        updateUserDisplay();
        closeProfileModal();
        showMessage('👤 Profile saved! Welcome, ' + name + '!', 'success');
        if (window.Sounds) Sounds.playSuccess();

        // Load user-specific data (may fail without Firebase, but profile is saved)
        try {
            if (window.FirebaseAPI) {
                await loadCustomFoods();
                await loadUserRules();
            }
            renderCategorizedFoodPalette();
        } catch (loadError) {
            console.warn('Could not load user data:', loadError);
        }
    } catch (error) {
        console.error('Error saving profile:', error);
        console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            code: error.code
        });
        showMessage('❌ Error saving profile: ' + error.message, 'error');
        if (window.Sounds) Sounds.playError();
    }
}

// ==========================================
// Food Items Management
// ==========================================

async function loadFoodItems() {
    try {
        const data = await FirebaseAPI.getFoodItems(100);
        foodItems = (data.data || []).map(item => ({
            ...item,
            is_sweet: item.is_sweet || false,
            weekly_limit: item.weekly_limit || 0,
            type: 'regular'
        }));
        console.log(`✅ Loaded ${foodItems.length} food items`);
    } catch (error) {
        console.error('Error loading food items:', error);
        showMessage('❌ Error loading food items', 'error');
    }
}

async function loadCompositeItems() {
    try {
        const data = await FirebaseAPI.getCompositeItems(100);
        compositeItems = data.data || [];
        console.log(`✅ Loaded ${compositeItems.length} composite items`);
    } catch (error) {
        console.error('Error loading composite items:', error);
        showMessage('❌ Error loading composite items', 'error');
    }
}

async function loadCustomFoods() {
    if (!currentUser) return;

    try {
        const data = await FirebaseAPI.getCustomFoods(currentUser.id);
        customFoods = (data.data || []).filter(food => food.user_id === currentUser.id).map(food => ({
            ...food,
            type: 'custom'
        }));
        console.log(`✅ Loaded ${customFoods.length} custom foods`);
    } catch (error) {
        console.error('Error loading custom foods:', error);
        showMessage('❌ Error loading your custom foods', 'error');
    }
}

async function loadUserRules() {
    if (!currentUser || !window.Rules) return;
    
    await Rules.loadUserRules(currentUser);
}

function renderCategorizedFoodPalette() {
    if (!window.CategorizedView) return;
    
    // Filter to only show enabled foods (default is enabled)
    const enabledFoods = foodItems.filter(f => f.is_enabled !== false);
    
    CategorizedView.renderCategorizedFoodPalette(enabledFoods, compositeItems, customFoods);
}

// ==========================================
// Weekly Plan Grid
// ==========================================

function renderWeeklyPlan() {
    const planContainer = document.getElementById('weeklyPlan');
    if (!planContainer) return;
    
    planContainer.innerHTML = '';
    
    days.forEach(day => {
        const dayCard = document.createElement('div');
        dayCard.className = 'bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-4';
        
        dayCard.innerHTML = `
            <h3 class="text-xl font-bold text-purple-700 mb-3 text-center">${dayLabels[day]}</h3>
            <div class="meal-slot bg-white rounded-xl p-3 border-2 border-dashed border-purple-300 min-h-[120px]" 
                 data-day="${day}">
                <div class="text-center text-gray-400 text-sm meal-placeholder">
                    Drag food here!
                </div>
            </div>
        `;
        
        // Add drop event listeners
        const slot = dayCard.querySelector('.meal-slot');
        if (slot) {
            slot.addEventListener('drop', handleDrop);
            slot.addEventListener('dragover', handleDragOver);
            slot.addEventListener('dragleave', handleDragLeave);
        } else {
            console.error('❌ Meal slot not found for day:', day);
        }

        planContainer.appendChild(dayCard);
    });
    
    // Restore any existing meals
    updateWeeklyPlanDisplay();
}

function updateWeeklyPlanDisplay() {
    days.forEach(day => {
        const slot = document.querySelector(`[data-day="${day}"]`);
        if (!slot) return;
        
        const meals = weeklyMeals[day];
        
        if (meals.length === 0) {
            slot.innerHTML = '<div class="text-center text-gray-400 text-sm meal-placeholder">Drag food here!</div>';
        } else {
            // Get current language
            const currentLang = window.i18n ? window.i18n.getCurrentLanguage() : 'en';
            
            slot.innerHTML = meals.map((meal, index) => {
                // Use Hebrew name if available and language is Hebrew
                const displayName = (currentLang === 'he' && meal.name_he) ? meal.name_he : meal.name;
                
                return `
                <div class="flex items-center gap-2 bg-purple-50 rounded-lg p-2 mb-2 relative group"
                     data-food-name="${meal.name}"
                     data-food-name-he="${meal.name_he || ''}">
                    <div class="text-3xl">${meal.icon}</div>
                    <div class="flex-1">
                        <div class="font-semibold text-sm text-gray-800 meal-name-display">${displayName}</div>
                        <div class="text-xs text-gray-500 capitalize">${meal.category}</div>
                    </div>
                    <button onclick="removeMeal('${day}', ${index})" 
                            class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 text-xs opacity-0 group-hover:opacity-100 transition">
                        ✕
                    </button>
                </div>
            `;
            }).join('');
        }
    });
    
    // Update health meter
    updateHealthMeter();
    
    // Provide guidance
    if (window.Guidance) {
        Guidance.provideSuggestion(weeklyMeals);
    }
}

// ==========================================
// Drag and Drop Handlers
// ==========================================

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    
    const slot = e.currentTarget;
    if (slot.classList.contains('meal-slot')) {
        slot.classList.add('drag-over');
    }
}

function handleDragLeave(e) {
    const slot = e.currentTarget;
    if (slot.classList.contains('meal-slot')) {
        slot.classList.remove('drag-over');
    }
}

function handleDrop(e) {
    e.preventDefault();
    const slot = e.currentTarget;
    slot.classList.remove('drag-over');
    
    const draggedElement = window.CategorizedView ? CategorizedView.getDraggedElement() : null;
    
    if (draggedElement) {
        const day = slot.dataset.day;
        const foodType = draggedElement.dataset.foodType;
        
        // Handle composite items differently
        if (foodType === 'composite') {
            const compositeId = draggedElement.dataset.foodId;
            const composite = compositeItems.find(item => item.id === compositeId);
            if (composite) {
                openCompositeBuilder(composite, day);
            }
            return;
        }
        
        const meal = {
            id: draggedElement.dataset.foodId,
            name: draggedElement.dataset.foodName,
            name_he: draggedElement.dataset.foodNameHe || '',
            icon: draggedElement.dataset.foodIcon,
            category: draggedElement.dataset.foodCategory,
            ingredients: draggedElement.dataset.ingredients,
            is_sweet: draggedElement.dataset.isSweet === 'true',
            weekly_limit: parseInt(draggedElement.dataset.weeklyLimit) || 0,
            type: foodType
        };
        
        // Validate with rule engine
        if (window.Rules) {
            const validation = Rules.validateMealDrop(meal, day, weeklyMeals);
            if (!validation.valid) {
                showMessage(validation.message, 'warning');
                if (window.Sounds) Sounds.playError();
                animateAvatar('sad');
                return;
            }
        }
        
        // Add meal to the day
        weeklyMeals[day].push(meal);
        updateWeeklyPlanDisplay();
        
        // Trigger auto-save
        if (window.AutoSave) {
            AutoSave.triggerAutoSave(saveMealPlan, currentUser);
        }
        
        // Celebrate healthy choice
        if (window.Guidance) {
            Guidance.celebrateHealthyChoice(meal);
        }
        
        // Animate avatar
        animateAvatar('happy');
        
        // Play sound
        if (window.Sounds) Sounds.playDrop();
        
        // Visual feedback
        showMessage('✨ Added ' + meal.name + ' to ' + dayLabels[day], 'success');
    }
}

function removeMeal(day, index) {
    // Save to history before removing
    if (window.AutoSave) {
        AutoSave.saveToHistory(weeklyMeals);
    }
    
    weeklyMeals[day].splice(index, 1);
    updateWeeklyPlanDisplay();
    
    // Trigger auto-save
    if (window.AutoSave) {
        AutoSave.triggerAutoSave(saveMealPlan, currentUser);
    }
    
    showMessage('🗑️ Meal removed!', 'info');
    if (window.Sounds) Sounds.playRemove();
}

// Expose undo globally for button
function undo() {
    if (!window.AutoSave) return;
    
    const previousState = AutoSave.undo();
    if (previousState) {
        AutoSave.setLoadingState(true);
        weeklyMeals = previousState;
        updateWeeklyPlanDisplay();
        setTimeout(() => {
            AutoSave.setLoadingState(false);
            AutoSave.triggerAutoSave(saveMealPlan, currentUser);
        }, 100);
    }
}

// ===========================================
// Health Meter
// ==========================================

function updateHealthMeter() {
    const categories = {
        protein: 0,
        veggie: 0,
        fruit: 0,
        grain: 0,
        dairy: 0
    };
    
    let totalMeals = 0;
    
    // Count meals by category
    days.forEach(day => {
        weeklyMeals[day].forEach(meal => {
            if (categories.hasOwnProperty(meal.category)) {
                categories[meal.category]++;
                totalMeals++;
            }
        });
    });
    
    // Update category counts with null checks
    const proteinCount = document.getElementById('proteinCount');
    const veggieCount = document.getElementById('veggieCount');
    const fruitCount = document.getElementById('fruitCount');
    const grainCount = document.getElementById('grainCount');
    const dairyCount = document.getElementById('dairyCount');

    if (proteinCount) proteinCount.textContent = categories.protein;
    if (veggieCount) veggieCount.textContent = categories.veggie;
    if (fruitCount) fruitCount.textContent = categories.fruit;
    if (grainCount) grainCount.textContent = categories.grain;
    if (dairyCount) dairyCount.textContent = categories.dairy;
    
    // Calculate balance score
    let score = 0;
    if (totalMeals > 0) {
        const hasProtein = categories.protein >= 3 ? 20 : (categories.protein * 6.67);
        const hasVeggie = categories.veggie >= 5 ? 20 : (categories.veggie * 4);
        const hasFruit = categories.fruit >= 5 ? 20 : (categories.fruit * 4);
        const hasGrain = categories.grain >= 3 ? 20 : (categories.grain * 6.67);
        const hasDairy = categories.dairy >= 3 ? 20 : (categories.dairy * 6.67);
        
        score = Math.min(100, hasProtein + hasVeggie + hasFruit + hasGrain + hasDairy);
    }
    
    // Update health meter
    const healthFill = document.getElementById('healthFill');
    const healthScore = document.getElementById('healthScore');
    
    if (healthFill && healthScore) {
        healthFill.style.width = score + '%';
        healthScore.textContent = Math.round(score) + '%';
        
        // Color coding
        if (score < 40) {
            healthFill.className = 'health-fill bg-red-400';
        } else if (score < 70) {
            healthFill.className = 'health-fill bg-yellow-400';
        } else {
            healthFill.className = 'health-fill bg-green-400';
            if (score === 100 && window.Sounds) {
                Sounds.playCelebration();
            }
        }
    }
    
    // Celebrate balanced week
    if (window.Guidance) {
        Guidance.celebrateBalancedWeek(score);
    }
}

// ==========================================
// Avatar Animation
// ==========================================

function animateAvatar(emotion) {
    const avatar = document.getElementById('avatarDisplay');
    if (!avatar) return;
    
    avatar.classList.remove('happy', 'sad');
    
    if (emotion) {
        avatar.classList.add(emotion);
        setTimeout(() => {
            avatar.classList.remove(emotion);
        }, 500);
    }
}

// ==========================================
// Save/Load Meal Plans
// ==========================================

async function saveMealPlan(silent = false) {
    if (!currentUser) {
        showMessage('⚠️ Please create a profile first!', 'warning');
        showProfileModal();
        return;
    }

    try {
        // Show loading state
        if (!silent) {
            const saveBtn = document.getElementById('btnSave');
            if (saveBtn) {
                saveBtn.disabled = true;
                saveBtn.style.opacity = '0.5';
                saveBtn.textContent = '💾 Saving...';
            }
        }

        const today = new Date();
        const weekStart = getMonday(today);
        const weekStartStr = weekStart.toISOString().split('T')[0];

        // Get existing plans
        const plansData = await FirebaseAPI.getMealPlans(currentUser.id);
        if (!plansData) {
            throw new Error('Failed to fetch existing meal plans');
        }

        const existingPlan = plansData.data ? plansData.data.find(p =>
            p.user_id === currentUser.id && p.week_start === weekStartStr
        ) : null;

        const mealPlanData = {
            user_id: currentUser.id,
            week_start: weekStartStr,
            meals: JSON.stringify(weeklyMeals)
        };

        // Perform save
        let result;
        if (existingPlan) {
            result = await FirebaseAPI.updateMealPlan(existingPlan.id, mealPlanData);
        } else {
            result = await FirebaseAPI.createMealPlan(mealPlanData);
        }

        // Verify save was successful
        if (!result || !result.id) {
            throw new Error('Save operation did not return valid result');
        }

        // Verify data was persisted by fetching it back
        const verification = await FirebaseAPI.getMealPlan(result.id);
        if (!verification) {
            throw new Error('Could not verify saved meal plan');
        }

        if (!silent) {
            showMessage('💾 Meal plan saved successfully!', 'success');
            if (window.Sounds) Sounds.playSuccess();
        } else {
            console.log('💾 Auto-saved meal plan at', new Date().toLocaleTimeString());
        }

    } catch (error) {
        console.error('Error saving meal plan:', error);
        showMessage('❌ Error saving meal plan: ' + (error.message || 'Unknown error'), 'error');
        if (window.Sounds) Sounds.playError();
    } finally {
        // Restore button state
        if (!silent) {
            const saveBtn = document.getElementById('btnSave');
            if (saveBtn) {
                saveBtn.disabled = false;
                saveBtn.style.opacity = '1';
                saveBtn.textContent = '💾 Save';
            }
        }
    }
}

async function loadMealPlan() {
    if (!currentUser) {
        showMessage('⚠️ Please create a profile first!', 'warning');
        showProfileModal();
        return;
    }

    // Prevent race condition
    if (isLoadingMealPlan) {
        console.log('⚠️ Meal plan already loading, skipping duplicate request');
        return;
    }

    isLoadingMealPlan = true;

    // Show loading state
    const loadBtn = document.getElementById('btnLoad');
    if (loadBtn) {
        loadBtn.disabled = true;
        loadBtn.style.opacity = '0.5';
        loadBtn.textContent = '📂 Loading...';
    }

    const today = new Date();
    const weekStart = getMonday(today);
    const weekStartStr = weekStart.toISOString().split('T')[0];

    try {
        const data = await FirebaseAPI.getMealPlans(currentUser.id);
        
        const plan = data.data ? data.data.find(p => 
            p.user_id === currentUser.id && p.week_start === weekStartStr
        ) : null;
        
        if (plan) {
            if (window.AutoSave) {
                AutoSave.setLoadingState(true);
            }

            try {
                weeklyMeals = JSON.parse(plan.meals);
            } catch (error) {
                console.error('Error parsing meal plan data:', error);
                showMessage('Error: Corrupted meal plan data. Starting fresh.', 'error');
                weeklyMeals = {
                    monday: [],
                    tuesday: [],
                    wednesday: [],
                    thursday: [],
                    friday: []
                };
            }
            updateWeeklyPlanDisplay();

            if (window.AutoSave) {
                AutoSave.clearHistory();
                AutoSave.saveToHistory(weeklyMeals);
                setTimeout(() => AutoSave.setLoadingState(false), 100);
            }
            
            showMessage('📂 Meal plan loaded!', 'success');
            if (window.Sounds) Sounds.playSuccess();
        } else {
            showMessage('ℹ️ No saved plan for this week', 'info');
        }
    } catch (error) {
        console.error('Error loading meal plan:', error);
        showMessage('❌ Error loading meal plan', 'error');
        if (window.Sounds) Sounds.playError();
    } finally {
        isLoadingMealPlan = false;
        // Restore button state
        const loadBtn = document.getElementById('btnLoad');
        if (loadBtn) {
            loadBtn.disabled = false;
            loadBtn.style.opacity = '1';
            loadBtn.textContent = '📂 Load';
        }
    }
}

async function autoLoadMealPlan() {
    if (!currentUser) return;

    // Prevent race condition
    if (isLoadingMealPlan) {
        console.log('⚠️ Meal plan already loading, skipping auto-load');
        return;
    }

    isLoadingMealPlan = true;

    const today = new Date();
    const weekStart = getMonday(today);
    const weekStartStr = weekStart.toISOString().split('T')[0];

    try {
        const data = await FirebaseAPI.getMealPlans(currentUser.id);
        
        const plan = data.data ? data.data.find(p => 
            p.user_id === currentUser.id && p.week_start === weekStartStr
        ) : null;
        
        if (plan) {
            if (window.AutoSave) {
                AutoSave.setLoadingState(true);
            }

            try {
                weeklyMeals = JSON.parse(plan.meals);
            } catch (error) {
                console.error('Error parsing meal plan data:', error);
                weeklyMeals = {
                    monday: [],
                    tuesday: [],
                    wednesday: [],
                    thursday: [],
                    friday: []
                };
            }
            updateWeeklyPlanDisplay();

            if (window.AutoSave) {
                setTimeout(() => AutoSave.setLoadingState(false), 100);
            }

            console.log('✅ Auto-loaded meal plan');
        }
    } catch (error) {
        console.error('Error auto-loading meal plan:', error);
    } finally {
        isLoadingMealPlan = false;
    }
}

function clearWeek() {
    if (confirm('Are you sure you want to clear this week? This cannot be undone!')) {
        if (window.AutoSave) {
            AutoSave.saveToHistory(weeklyMeals);
        }
        
        weeklyMeals = {
            monday: [],
            tuesday: [],
            wednesday: [],
            thursday: [],
            friday: []
        };
        updateWeeklyPlanDisplay();
        
        if (window.AutoSave) {
            AutoSave.triggerAutoSave(saveMealPlan, currentUser);
        }
        
        showMessage('🗑️ Week cleared!', 'info');
        if (window.Sounds) Sounds.playClick();
    }
}

// ==========================================
// Tab Navigation
// ==========================================

async function switchTab(tab) {
    // Password protection for parent view - ENABLED
    if (tab === 'parent') {
        // Use Auth module for proper modal-based authentication
        if (window.Auth) {
            const authorized = await window.Auth.requireParentAuth();
            if (!authorized) {
                return; // Don't switch tabs
            }
        } else {
            // Fallback if Auth not loaded - check session
            const session = sessionStorage.getItem('meal_planner_session');
            if (!session) {
                showMessage('❌ Authentication required!', 'error');
                if (window.Sounds) Sounds.playError();
                return;
            }
        }
    }

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
        updateParentView();
    }

    if (window.Sounds) Sounds.playClick();
}

// ==========================================
// Parent View
// ==========================================

function updateParentView() {
    updateWeeklySummary();
    updateNutritionalInsights();
}

function updateWeeklySummary() {
    const summaryDiv = document.getElementById('weeklySummary');
    if (!summaryDiv) return;
    
    let html = '';
    let hasAnyMeals = false;
    
    days.forEach(day => {
        if (weeklyMeals[day].length > 0) {
            hasAnyMeals = true;
            html += `
                <div class="bg-purple-50 rounded-xl p-4">
                    <h3 class="font-bold text-purple-700 mb-2">${dayLabels[day]}</h3>
                    <div class="space-y-2">
                        ${weeklyMeals[day].map(meal => `
                            <div class="flex items-center gap-2">
                                <span class="text-2xl">${meal.icon}</span>
                                <span class="text-gray-700">${meal.name}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
    });
    
    if (!hasAnyMeals) {
        html = '<p class="text-gray-600">Plan meals for the week to see the summary here!</p>';
    }
    
    summaryDiv.innerHTML = html;
}

async function generateShoppingList() {
    if (!currentUser) {
        showMessage('⚠️ Please create a profile first!', 'warning');
        return;
    }
    
    if (window.CategorizedView) {
        const ingredientsByCategory = CategorizedView.generateCategorizedShoppingList(weeklyMeals);
        CategorizedView.renderCategorizedShoppingList(ingredientsByCategory);
        
        try {
            const today = new Date();
            const weekStart = getMonday(today);
            const weekStartStr = weekStart.toISOString().split('T')[0];
            
            await FirebaseAPI.createShoppingList({
                user_id: currentUser.id,
                week_start: weekStartStr,
                items: JSON.stringify(ingredientsByCategory),
                created_at_readable: new Date().toLocaleDateString()
            });
            
            showMessage('🛒 Shopping list generated!', 'success');
            if (window.Sounds) Sounds.playSuccess();
        } catch (error) {
            console.error('Error saving shopping list:', error);
        }
    }
}

function printShoppingList() {
    window.print();
    if (window.Sounds) Sounds.playClick();
}

function updateNutritionalInsights() {
    const insightsDiv = document.getElementById('nutritionalInsights');
    if (!insightsDiv) return;
    
    const categories = {
        protein: 0,
        veggie: 0,
        fruit: 0,
        grain: 0,
        dairy: 0
    };
    
    let totalMeals = 0;
    
    days.forEach(day => {
        weeklyMeals[day].forEach(meal => {
            if (categories.hasOwnProperty(meal.category)) {
                categories[meal.category]++;
                totalMeals++;
            }
        });
    });
    
    if (totalMeals === 0) {
        insightsDiv.innerHTML = '<p class="text-gray-600">Complete the meal plan to see insights!</p>';
        return;
    }
    
    let insights = [];
    
    if (categories.protein < 3) {
        insights.push({ icon: '⚠️', text: 'Add more protein! Try chicken, fish, or eggs.', color: 'text-orange-600' });
    } else {
        insights.push({ icon: '✅', text: 'Great protein intake!', color: 'text-green-600' });
    }
    
    if (categories.veggie < 5) {
        insights.push({ icon: '⚠️', text: 'Need more veggies! Add broccoli, carrots, or tomatoes.', color: 'text-orange-600' });
    } else {
        insights.push({ icon: '✅', text: 'Excellent veggie choices!', color: 'text-green-600' });
    }
    
    if (categories.fruit < 3) {
        insights.push({ icon: '⚠️', text: 'Add more fruits! Try apples, bananas, or berries.', color: 'text-orange-600' });
    } else {
        insights.push({ icon: '✅', text: 'Perfect fruit balance!', color: 'text-green-600' });
    }
    
    if (categories.grain < 3) {
        insights.push({ icon: '⚠️', text: 'Include more whole grains like brown rice or whole wheat bread.', color: 'text-orange-600' });
    }
    
    if (categories.dairy < 2) {
        insights.push({ icon: 'ℹ️', text: 'Consider adding dairy like yogurt or cheese for calcium.', color: 'text-blue-600' });
    }
    
    let html = '<div class="space-y-3">';
    insights.forEach(insight => {
        html += `
            <div class="flex items-start gap-3 bg-white rounded-lg p-4 border border-purple-200">
                <span class="text-2xl">${insight.icon}</span>
                <span class="${insight.color} font-semibold">${insight.text}</span>
            </div>
        `;
    });
    html += '</div>';
    
    insightsDiv.innerHTML = html;
}

// ==========================================
// Utility Functions
// ==========================================

function getMonday(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
}

function showMessage(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 px-6 py-4 rounded-full shadow-2xl text-white font-semibold z-50 animate-bounce`;

    const colors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        warning: 'bg-yellow-500',
        info: 'bg-blue-500'
    };

    toast.classList.add(colors[type] || colors.info);
    toast.textContent = message;

    document.body.appendChild(toast);

    // Longer duration for better readability (5s for important messages, 4s for others)
    const duration = (type === 'error' || type === 'warning') ? 5000 : 4000;

    setTimeout(() => {
        toast.remove();
    }, duration);
}

// ==========================================
// Composite Food Builder
// ==========================================

let pendingCompositeDay = null;

function openCompositeBuilder(compositeItem, targetDay = null) {
    currentCompositeItem = compositeItem;
    pendingCompositeDay = targetDay;
    compositeSelections = {};
    
    const modal = document.getElementById('compositeBuilderModal');
    const title = document.getElementById('builderTitle');
    const stepsContainer = document.getElementById('builderSteps');
    
    title.textContent = `${compositeItem.icon} ${compositeItem.name}`;
    
    // Parse steps
    let steps = [];
    try {
        steps = JSON.parse(compositeItem.steps);
    } catch (e) {
        console.error('Error parsing composite steps:', e);
        showMessage('❌ Error: Invalid composite builder format', 'error');
        return;
    }

    // Parse ingredients map
    let ingredientsMap = {};
    try {
        ingredientsMap = JSON.parse(compositeItem.ingredients_map);
    } catch (e) {
        console.error('Error parsing ingredients map:', e);
        showMessage('❌ Error: Invalid composite ingredients', 'error');
        return;
    }
    
    // Render steps
    stepsContainer.innerHTML = '';
    steps.forEach((stepName, index) => {
        const options = ingredientsMap[stepName] || [];
        const stepDiv = createStepSelector(stepName, options, index);
        stepsContainer.appendChild(stepDiv);
    });
    
    updateBuilderPreview();
    
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    
    if (window.Sounds) Sounds.playClick();
}

function createStepSelector(stepName, options, stepIndex) {
    const stepDiv = document.createElement('div');
    stepDiv.className = 'border-2 border-purple-200 rounded-xl p-4';
    
    let optionsHTML = '';
    options.forEach((option, optionIndex) => {
        optionsHTML += `
            <button onclick="selectCompositeOption('${stepName}', '${option.name}', '${option.icon}')" 
                    class="composite-option flex items-center gap-2 p-3 rounded-lg border-2 border-gray-200 hover:border-purple-400 transition"
                    data-step="${stepName}"
                    data-option="${option.name}">
                <span class="text-3xl">${option.icon}</span>
                <span class="font-semibold text-gray-700">${option.name}</span>
            </button>
        `;
    });
    
    stepDiv.innerHTML = `
        <h3 class="font-bold text-lg text-purple-700 mb-3">Step ${stepIndex + 1}: ${stepName}</h3>
        <div class="grid grid-cols-2 gap-2">
            ${optionsHTML}
        </div>
    `;
    
    return stepDiv;
}

function selectCompositeOption(stepName, optionName, optionIcon) {
    compositeSelections[stepName] = {
        name: optionName,
        icon: optionIcon
    };
    
    // Visual feedback - highlight selected option
    document.querySelectorAll(`[data-step="${stepName}"]`).forEach(btn => {
        btn.classList.remove('border-purple-600', 'bg-purple-50');
        btn.classList.add('border-gray-200');
    });
    
    const selectedBtn = document.querySelector(`[data-step="${stepName}"][data-option="${optionName}"]`);
    if (selectedBtn) {
        selectedBtn.classList.remove('border-gray-200');
        selectedBtn.classList.add('border-purple-600', 'bg-purple-50');
    }
    
    updateBuilderPreview();
    
    if (window.Sounds) Sounds.playClick();
}

function updateBuilderPreview() {
    const previewDiv = document.getElementById('builderPreview');
    const addButton = document.getElementById('addCompositeButton');
    
    if (!currentCompositeItem) return;
    
    let steps = [];
    try {
        steps = JSON.parse(currentCompositeItem.steps);
    } catch (e) {
        console.error('Error parsing composite steps:', e);
        showMessage('❌ Error: Invalid composite format', 'error');
        return;
    }
    
    const allStepsSelected = steps.every(step => compositeSelections[step]);
    
    if (allStepsSelected) {
        const selections = Object.values(compositeSelections);
        const icons = selections.map(s => s.icon).join(' ');
        const names = selections.map(s => s.name).join(' + ');
        
        previewDiv.innerHTML = `
            <div class="text-4xl mb-2">${icons}</div>
            <div class="font-bold text-lg">${names}</div>
        `;
        
        addButton.disabled = false;
        addButton.style.opacity = '1';
    } else {
        previewDiv.textContent = 'Select options for each step...';
        addButton.disabled = true;
        addButton.style.opacity = '0.5';
    }
}

function addCompositeToWeek() {
    if (!currentCompositeItem || !pendingCompositeDay) {
        showMessage('❌ Error: Missing day selection', 'error');
        return;
    }
    
    // Create composite meal
    const selections = Object.values(compositeSelections);
    const icons = selections.map(s => s.icon).join('');
    const names = selections.map(s => s.name).join(' + ');
    const ingredients = selections.map(s => s.name);
    
    const compositeMeal = {
        id: `composite_${currentCompositeItem.id}_${Date.now()}`,
        name: names,
        icon: icons,
        category: currentCompositeItem.category,
        ingredients: JSON.stringify(ingredients),
        is_sweet: false,
        weekly_limit: 0,
        type: 'composite'
    };
    
    // Validate with rule engine
    if (window.Rules) {
        const validation = Rules.validateMealDrop(compositeMeal, pendingCompositeDay, weeklyMeals);
        if (!validation.valid) {
            showMessage(validation.message, 'warning');
            if (window.Sounds) Sounds.playError();
            return;
        }
    }
    
    // Add to week
    weeklyMeals[pendingCompositeDay].push(compositeMeal);
    updateWeeklyPlanDisplay();
    
    // Trigger auto-save
    if (window.AutoSave) {
        AutoSave.triggerAutoSave(saveMealPlan, currentUser);
    }
    
    closeCompositeBuilder();
    
    showMessage(`✨ Added ${names} to ${dayLabels[pendingCompositeDay]}!`, 'success');
    if (window.Sounds) Sounds.playSuccess();
}

function closeCompositeBuilder() {
    const modal = document.getElementById('compositeBuilderModal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    
    currentCompositeItem = null;
    pendingCompositeDay = null;
    compositeSelections = {};
    
    if (window.Sounds) Sounds.playClick();
}

// ==========================================
// Parent Settings
// ==========================================

function showParentSettings() {
    const modal = document.getElementById('parentSettingsModal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    
    // Load current settings
    loadParentSettingsUI();
    
    if (window.Sounds) Sounds.playClick();
}

function closeParentSettings() {
    const modal = document.getElementById('parentSettingsModal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    
    if (window.Sounds) Sounds.playClick();
}

function loadParentSettingsUI() {
    // Load rules
    if (window.Rules) {
        const rules = Rules.getRules();
        document.getElementById('rule-noDuplicates').checked = rules.noDuplicatesPerDay;
        document.getElementById('rule-maxItems').value = rules.maxItemsPerDay;
        document.getElementById('rule-maxSweets').value = rules.maxSweetsPerWeek;
    }
    
    // Load custom foods list
    renderCustomFoodsList();
    
    // Load food management list
    renderFoodManagementList();
    
    // Load composite items management
    renderCompositeManagementList();
    
    // Load food limits
    renderFoodLimits();
}

function renderCustomFoodsList() {
    const listDiv = document.getElementById('customFoodsList');
    
    if (customFoods.length === 0) {
        listDiv.innerHTML = '<p class="text-gray-600">No custom foods added yet.</p>';
        return;
    }
    
    let html = '<div class="space-y-2">';
    customFoods.forEach(food => {
        html += `
            <div class="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                <div class="flex items-center gap-2">
                    <span class="text-3xl">${food.icon}</span>
                    <div>
                        <div class="font-semibold">${food.name}</div>
                        <div class="text-xs text-gray-600 capitalize">${food.category}</div>
                    </div>
                </div>
                <button onclick="deleteCustomFood('${food.id}')" class="bg-red-500 text-white px-3 py-1 rounded-full text-sm hover:bg-red-600">
                    Delete
                </button>
            </div>
        `;
    });
    html += '</div>';
    
    listDiv.innerHTML = html;
}

function renderFoodLimits() {
    const listDiv = document.getElementById('foodLimitsList');
    
    let html = '';
    foodItems.forEach(food => {
        html += `
            <div class="flex items-center justify-between p-3 bg-white rounded-lg border border-purple-200">
                <div class="flex items-center gap-2 flex-1">
                    <span class="text-2xl">${food.icon}</span>
                    <span class="font-semibold text-sm">${food.name}</span>
                </div>
                <input type="number" 
                       value="${food.weekly_limit || 0}" 
                       min="0" max="7" 
                       class="w-16 px-2 py-1 rounded border border-gray-300 text-center"
                       onchange="updateFoodLimit('${food.id}', parseInt(this.value))"
                       title="Max per week (0 = unlimited)">
            </div>
        `;
    });
    
    listDiv.innerHTML = html;
}

async function updateRule(ruleName, value) {
    if (window.Rules) {
        Rules.updateRule(ruleName, value);
        
        if (currentUser) {
            await Rules.saveUserRule(currentUser, ruleName, value, true);
        }
        
        showMessage(`✅ Rule updated!`, 'success');
    }
    
    if (window.Sounds) Sounds.playClick();
}

function updateFoodLimit(foodId, limit) {
    const food = foodItems.find(f => f.id === foodId);
    if (food) {
        food.weekly_limit = limit;
        showMessage(`✅ Limit updated for ${food.name}`, 'success');
    }
    
    if (window.Sounds) Sounds.playClick();
}

async function saveParentSettings() {
    if (!currentUser) {
        showMessage('⚠️ Please create a profile first!', 'warning');
        return;
    }
    
    // Save rules to database
    if (window.Rules) {
        const rules = Rules.getRules();
        for (const [ruleName, ruleValue] of Object.entries(rules)) {
            await Rules.saveUserRule(currentUser, ruleName, ruleValue, true);
        }
    }
    
    closeParentSettings();
    showMessage('💾 Settings saved!', 'success');
    if (window.Sounds) Sounds.playSuccess();
}

// ==========================================
// Food Management (Enable/Disable Foods)
// ==========================================

let currentFoodManagementCategory = 'all';

function renderFoodManagementList() {
    const listDiv = document.getElementById('foodManagementList');
    if (!listDiv) return;
    
    // Get current language
    const currentLang = window.i18n ? window.i18n.getCurrentLanguage() : 'en';
    
    // Filter foods by category
    let filteredFoods = foodItems;
    if (currentFoodManagementCategory !== 'all') {
        filteredFoods = foodItems.filter(f => f.category === currentFoodManagementCategory);
    }
    
    if (filteredFoods.length === 0) {
        listDiv.innerHTML = '<p class="text-gray-600">No foods in this category.</p>';
        return;
    }
    
    let html = '<div class="space-y-2">';
    filteredFoods.forEach(food => {
        const isEnabled = food.is_enabled !== false; // Default to enabled
        const displayName = (currentLang === 'he' && food.name_he) ? food.name_he : food.name;
        
        html += `
            <div class="flex items-center justify-between p-3 ${isEnabled ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-300'} rounded-lg border-2">
                <div class="flex items-center gap-3 flex-1">
                    <span class="text-2xl ${!isEnabled ? 'opacity-50' : ''}">${food.icon}</span>
                    <div>
                        <div class="font-semibold text-sm ${!isEnabled ? 'line-through text-gray-500' : ''}">${displayName}</div>
                        <div class="text-xs text-gray-600 capitalize">${food.category}</div>
                    </div>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" 
                           class="sr-only peer" 
                           ${isEnabled ? 'checked' : ''} 
                           onchange="toggleFood('${food.id}', this.checked)">
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
            </div>
        `;
    });
    html += '</div>';
    
    listDiv.innerHTML = html;
}

function showFoodManagementCategory(category) {
    currentFoodManagementCategory = category;
    
    // Update tab styles
    document.querySelectorAll('[id^="foodMgmt-tab-"]').forEach(tab => {
        tab.classList.remove('bg-orange-500', 'text-white');
        tab.classList.add('bg-gray-200', 'hover:bg-gray-300');
    });
    
    const activeTab = document.getElementById(`foodMgmt-tab-${category}`);
    if (activeTab) {
        activeTab.classList.remove('bg-gray-200', 'hover:bg-gray-300');
        activeTab.classList.add('bg-orange-500', 'text-white');
    }
    
    renderFoodManagementList();
    
    if (window.Sounds) Sounds.playClick();
}

function toggleFood(foodId, isEnabled) {
    const food = foodItems.find(f => f.id === foodId);
    if (food) {
        food.is_enabled = isEnabled;
        renderFoodManagementList();
        
        // Re-render food palette to show/hide disabled foods
        if (window.CategorizedView) {
            const enabledFoods = foodItems.filter(f => f.is_enabled !== false);
            CategorizedView.renderCategorizedFoodPalette(enabledFoods, compositeItems, customFoods);
        }
        
        const currentLang = window.i18n ? window.i18n.getCurrentLanguage() : 'en';
        const displayName = (currentLang === 'he' && food.name_he) ? food.name_he : food.name;
        
        showMessage(`${isEnabled ? '✅' : '❌'} ${displayName} ${isEnabled ? 'enabled' : 'disabled'}`, 'info');
    }
    
    if (window.Sounds) Sounds.playClick();
}

function toggleAllFoods(enable) {
    foodItems.forEach(food => {
        food.is_enabled = enable;
    });
    
    renderFoodManagementList();
    
    // Re-render food palette
    if (window.CategorizedView) {
        const enabledFoods = enable ? foodItems : [];
        CategorizedView.renderCategorizedFoodPalette(enabledFoods, compositeItems, customFoods);
    }
    
    showMessage(`${enable ? '✅ All foods enabled' : '❌ All foods disabled'}`, 'info');
    
    if (window.Sounds) Sounds.playClick();
}

// ==========================================
// Composite Items Management
// ==========================================

let currentEditingComposite = null;
let editingIngredientsMap = {};

function renderCompositeManagementList() {
    const listDiv = document.getElementById('compositeManagementList');
    if (!listDiv) return;
    
    if (compositeItems.length === 0) {
        listDiv.innerHTML = '<p class="text-gray-600">No composite builders available.</p>';
        return;
    }
    
    let html = '';
    compositeItems.forEach(composite => {
        let steps = [];
        try {
            steps = JSON.parse(composite.steps);
        } catch (e) {
            steps = [];
        }
        
        html += `
            <div class="border-2 border-pink-200 rounded-xl p-4">
                <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center gap-3">
                        <span class="text-3xl">${composite.icon}</span>
                        <div>
                            <div class="font-bold text-lg">${composite.name}</div>
                            <div class="text-sm text-gray-600">${steps.length} steps</div>
                        </div>
                    </div>
                    <button onclick="openEditComposite('${composite.id}')" 
                            class="bg-pink-500 text-white px-4 py-2 rounded-full font-semibold hover:bg-pink-600 transition">
                        ✏️ Edit Options
                    </button>
                </div>
                <div class="flex gap-2 flex-wrap">
                    ${steps.map((step, i) => `<span class="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full">${i + 1}. ${step}</span>`).join('')}
                </div>
            </div>
        `;
    });
    
    listDiv.innerHTML = html;
}

function openEditComposite(compositeId) {
    const composite = compositeItems.find(c => c.id === compositeId);
    if (!composite) return;
    
    currentEditingComposite = composite;
    
    // Parse data
    let steps = [];
    let ingredientsMap = {};
    
    try {
        steps = JSON.parse(composite.steps);
        ingredientsMap = JSON.parse(composite.ingredients_map);
    } catch (e) {
        console.error('Error parsing composite data:', e);
        showMessage('❌ Error: Invalid composite data format', 'error');
        return;
    }
    
    // Clone the ingredients map for editing
    editingIngredientsMap = JSON.parse(JSON.stringify(ingredientsMap));
    
    // Update modal
    const modal = document.getElementById('editCompositeModal');
    const title = document.getElementById('editCompositeTitle');
    const stepsContainer = document.getElementById('editCompositeSteps');
    
    title.textContent = `${composite.icon} ${composite.name}`;
    
    // Render each step with its options
    stepsContainer.innerHTML = '';
    steps.forEach((stepName, stepIndex) => {
        const options = editingIngredientsMap[stepName] || [];
        const stepHTML = createCompositeStepEditor(stepName, options, stepIndex);
        stepsContainer.innerHTML += stepHTML;
    });
    
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    
    if (window.Sounds) Sounds.playClick();
}

function createCompositeStepEditor(stepName, options, stepIndex) {
    // Create safe ID by removing spaces and special chars
    const safeStepId = stepName.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
    
    let optionsHTML = '';
    options.forEach((option, optionIndex) => {
        optionsHTML += `
            <div class="flex items-center justify-between p-2 bg-white rounded-lg border border-gray-200">
                <div class="flex items-center gap-2">
                    <span class="text-2xl">${option.icon}</span>
                    <span class="text-sm font-semibold">${option.name}</span>
                </div>
                <button onclick="removeCompositeOption('${stepName}', ${optionIndex})" 
                        class="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600">
                    ✕
                </button>
            </div>
        `;
    });
    
    return `
        <div class="border-2 border-pink-200 rounded-xl p-4">
            <h4 class="font-bold text-gray-800 mb-3">Step ${stepIndex + 1}: ${stepName}</h4>
            
            <div class="space-y-2 mb-3 max-h-48 overflow-y-auto">
                ${optionsHTML}
            </div>
            
            <div class="flex gap-2">
                <div class="flex-1">
                    <input type="text" 
                           id="newOption-${safeStepId}-name" 
                           data-step-name="${stepName}"
                           placeholder="Enter food name (icon will be auto-suggested)"
                           oninput="suggestIcon('${safeStepId}')"
                           class="w-full px-3 py-2 rounded-lg border-2 border-pink-200 text-sm">
                    <div id="iconSuggestion-${safeStepId}" class="text-xs text-gray-500 mt-1 flex items-center gap-2">
                        <span>Suggested icon will appear here</span>
                    </div>
                </div>
                <button onclick="addCompositeOptionAuto('${safeStepId}', '${stepName}')" 
                        class="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 text-sm whitespace-nowrap">
                    ➕ Add
                </button>
            </div>
        </div>
    `;
}

// Auto icon mapping based on food name keywords
function getAutoIcon(foodName) {
    const name = foodName.toLowerCase();
    
    // Bread & Grains
    if (name.includes('bread') || name.includes('toast')) return '🍞';
    if (name.includes('bagel')) return '🥯';
    if (name.includes('croissant')) return '🥐';
    if (name.includes('baguette') || name.includes('sourdough')) return '🥖';
    if (name.includes('tortilla') || name.includes('wrap')) return '🌯';
    if (name.includes('pita')) return '🫓';
    if (name.includes('roll')) return '🥖';
    
    // Pasta & Noodles
    if (name.includes('spaghetti') || name.includes('pasta')) return '🍝';
    if (name.includes('penne') || name.includes('macaroni')) return '🍝';
    if (name.includes('ramen') || name.includes('noodle')) return '🍜';
    
    // Proteins - Meat
    if (name.includes('chicken')) return '🍗';
    if (name.includes('turkey')) return '🦃';
    if (name.includes('beef') || name.includes('steak')) return '🥩';
    if (name.includes('bacon')) return '🥓';
    if (name.includes('ham')) return '🍖';
    if (name.includes('sausage')) return '🌭';
    if (name.includes('meatball')) return '🍖';
    
    // Proteins - Fish
    if (name.includes('tuna') || name.includes('salmon') || name.includes('fish')) return '🐟';
    if (name.includes('shrimp') || name.includes('prawn')) return '🍤';
    
    // Proteins - Eggs
    if (name.includes('egg')) return '🥚';
    
    // Proteins - Legumes
    if (name.includes('chickpea') || name.includes('hummus')) return '🫘';
    if (name.includes('bean')) return '🫘';
    if (name.includes('lentil')) return '🫘';
    if (name.includes('tofu')) return '🧊';
    
    // Dairy
    if (name.includes('cheese') && !name.includes('cream')) return '🧀';
    if (name.includes('cream cheese')) return '🧈';
    if (name.includes('butter')) return '🧈';
    if (name.includes('yogurt')) return '🥛';
    if (name.includes('milk')) return '🥛';
    
    // Nut Butters
    if (name.includes('peanut butter')) return '🥜';
    if (name.includes('almond butter')) return '🥜';
    if (name.includes('sunflower') && name.includes('butter')) return '🌻';
    
    // Vegetables
    if (name.includes('lettuce') || name.includes('salad') || name.includes('greens')) return '🥬';
    if (name.includes('tomato')) return '🍅';
    if (name.includes('cucumber')) return '🥒';
    if (name.includes('carrot')) return '🥕';
    if (name.includes('pepper') || name.includes('bell pepper')) return '🫑';
    if (name.includes('onion')) return '🧅';
    if (name.includes('broccoli')) return '🥦';
    if (name.includes('spinach')) return '🥬';
    if (name.includes('mushroom')) return '🍄';
    if (name.includes('avocado')) return '🥑';
    if (name.includes('olive')) return '🫒';
    if (name.includes('pickle')) return '🥒';
    if (name.includes('corn')) return '🌽';
    
    // Sauces & Condiments
    if (name.includes('marinara') || name.includes('tomato sauce')) return '🍅';
    if (name.includes('alfredo') || name.includes('cream sauce')) return '🥛';
    if (name.includes('pesto')) return '🌿';
    if (name.includes('garlic')) return '🧄';
    if (name.includes('mayo') || name.includes('mayonnaise')) return '🥚';
    if (name.includes('mustard')) return '🟡';
    if (name.includes('ketchup')) return '🍅';
    if (name.includes('ranch') || name.includes('dressing')) return '🥗';
    if (name.includes('vinegar') || name.includes('balsamic')) return '🫒';
    if (name.includes('oil') && name.includes('olive')) return '🫒';
    if (name.includes('tahini')) return '🫘';
    if (name.includes('soy sauce')) return '🍶';
    
    // Herbs & Spices
    if (name.includes('basil') || name.includes('herb')) return '🌿';
    if (name.includes('pepper') && (name.includes('black') || name.includes('seasoning'))) return '⚫';
    if (name.includes('salt')) return '🧂';
    if (name.includes('paprika') || name.includes('spice')) return '🌶️';
    
    // Cheese Varieties
    if (name.includes('parmesan') || name.includes('mozzarella') || name.includes('cheddar')) return '🧀';
    if (name.includes('feta')) return '🧀';
    
    // Fruits
    if (name.includes('apple')) return '🍎';
    if (name.includes('banana')) return '�banana';
    if (name.includes('orange') || name.includes('citrus')) return '🍊';
    if (name.includes('lemon')) return '🍋';
    if (name.includes('berry') || name.includes('berries')) return '🫐';
    
    // Default icons by category
    if (name.includes('sauce')) return '🍶';
    if (name.includes('spread')) return '🧈';
    if (name.includes('meat')) return '🍖';
    if (name.includes('seafood')) return '🐟';
    if (name.includes('grain')) return '🌾';
    
    // Default fallback
    return '🍽️';
}

function suggestIcon(safeStepId) {
    const nameInput = document.getElementById(`newOption-${safeStepId}-name`);
    const suggestionDiv = document.getElementById(`iconSuggestion-${safeStepId}`);
    
    if (!nameInput || !suggestionDiv) return;
    
    const name = nameInput.value.trim();
    
    if (name.length > 2) {
        const icon = getAutoIcon(name);
        suggestionDiv.innerHTML = `<span class="text-2xl">${icon}</span> <span>Suggested icon for "${name}"</span>`;
    } else {
        suggestionDiv.innerHTML = '<span>Suggested icon will appear here</span>';
    }
}

function addCompositeOptionAuto(safeStepId, stepName) {
    const nameInput = document.getElementById(`newOption-${safeStepId}-name`);
    
    if (!nameInput) {
        console.error('Input not found:', safeStepId);
        showMessage('❌ Error: Could not find input field', 'error');
        return;
    }
    
    const name = nameInput.value.trim();
    
    if (!name) {
        showMessage('❌ Please enter a food name', 'error');
        return;
    }
    
    // Get auto icon
    const icon = getAutoIcon(name);
    
    // Add to editing map
    if (!editingIngredientsMap[stepName]) {
        editingIngredientsMap[stepName] = [];
    }
    
    editingIngredientsMap[stepName].push({
        name: name,
        icon: icon
    });
    
    // Re-render
    openEditComposite(currentEditingComposite.id);
    
    showMessage(`✅ Added ${icon} ${name} to ${stepName}`, 'success');
    
    if (window.Sounds) Sounds.playClick();
}

function removeCompositeOption(stepName, optionIndex) {
    if (!editingIngredientsMap[stepName]) return;
    
    const removedOption = editingIngredientsMap[stepName][optionIndex];
    editingIngredientsMap[stepName].splice(optionIndex, 1);
    
    // Re-render
    openEditComposite(currentEditingComposite.id);
    
    showMessage(`🗑️ Removed ${removedOption.name}`, 'info');
    
    if (window.Sounds) Sounds.playClick();
}

async function saveCompositeChanges() {
    if (!currentEditingComposite) return;
    
    try {
        // Update the composite item
        const updatedComposite = {
            ...currentEditingComposite,
            ingredients_map: JSON.stringify(editingIngredientsMap)
        };
        
        await FirebaseAPI.updateCompositeItem(currentEditingComposite.id, updatedComposite);
        
        // Update local data
        const index = compositeItems.findIndex(c => c.id === currentEditingComposite.id);
        if (index !== -1) {
            compositeItems[index] = updatedComposite;
        }
        
        closeEditCompositeModal();
        renderCompositeManagementList();
        
        showMessage('💾 Composite builder updated!', 'success');
        if (window.Sounds) Sounds.playSuccess();
    } catch (error) {
        console.error('Error saving composite:', error);
        showMessage('❌ Error saving changes', 'error');
    }
}

function closeEditCompositeModal() {
    const modal = document.getElementById('editCompositeModal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    
    currentEditingComposite = null;
    editingIngredientsMap = {};
    
    if (window.Sounds) Sounds.playClick();
}

// ==========================================
// Custom Food Management
// ==========================================

function showAddCustomFoodForm() {
    const modal = document.getElementById('addCustomFoodForm');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    
    // Clear form
    document.getElementById('customFoodName').value = '';
    document.getElementById('customFoodCategory').value = 'protein';
    document.getElementById('customFoodIcon').value = '';
    document.getElementById('customFoodLimit').value = 0;
    document.getElementById('customFoodSweet').checked = false;
    
    if (window.Sounds) Sounds.playClick();
}

function closeAddCustomFoodForm() {
    const modal = document.getElementById('addCustomFoodForm');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    
    if (window.Sounds) Sounds.playClick();
}

async function saveCustomFood() {
    if (!currentUser) {
        showMessage('⚠️ Please create a profile first!', 'warning');
        return;
    }
    
    const name = document.getElementById('customFoodName').value.trim();
    const category = document.getElementById('customFoodCategory').value;
    const icon = document.getElementById('customFoodIcon').value.trim();
    const limit = parseInt(document.getElementById('customFoodLimit').value) || 0;
    const isSweet = document.getElementById('customFoodSweet').checked;
    
    if (!name || !icon) {
        showMessage('❌ Please fill in all fields!', 'error');
        return;
    }
    
    try {
        const customFood = {
            user_id: currentUser.id,
            name: name,
            category: category,
            icon: icon,
            weekly_limit: limit,
            is_sweet: isSweet
        };
        
        const savedFood = await FirebaseAPI.createCustomFood(customFood);
        customFood.id = savedFood.id;
        customFood.type = 'custom';
        customFood.ingredients = JSON.stringify([name]);
        
        customFoods.push(customFood);
        
        // Re-render food palette
        renderCategorizedFoodPalette();
        renderCustomFoodsList();
        
        closeAddCustomFoodForm();
        showMessage(`✅ Added ${name} to your palette!`, 'success');
        if (window.Sounds) Sounds.playSuccess();
    } catch (error) {
        console.error('Error saving custom food:', error);
        showMessage('❌ Error saving custom food', 'error');
        if (window.Sounds) Sounds.playError();
    }
}

async function deleteCustomFood(foodId) {
    if (!confirm('Are you sure you want to delete this custom food?')) {
        return;
    }
    
    try {
        await FirebaseAPI.deleteCustomFood(foodId);
        
        customFoods = customFoods.filter(f => f.id !== foodId);
        
        // Re-render
        renderCategorizedFoodPalette();
        renderCustomFoodsList();
        
        showMessage('🗑️ Custom food deleted!', 'info');
        if (window.Sounds) Sounds.playClick();
    } catch (error) {
        console.error('Error deleting custom food:', error);
        showMessage('❌ Error deleting custom food', 'error');
        if (window.Sounds) Sounds.playError();
    }
}

// ==========================================
// Language Switching
// ==========================================

function switchLanguage(lang) {
    if (!window.i18n) return;
    
    i18n.setLanguage(lang);
    
    // Update language button states
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('bg-purple-500', 'text-white');
        btn.classList.add('hover:bg-gray-200');
    });
    
    const activeBtn = document.getElementById(`langBtn-${lang}`);
    if (activeBtn) {
        activeBtn.classList.add('bg-purple-500', 'text-white');
        activeBtn.classList.remove('hover:bg-gray-200');
    }
    
    // Play sound
    if (window.Sounds) Sounds.playClick();
    
    showMessage(`🌍 ${lang === 'he' ? 'עברית' : 'English'}`, 'info');
}

window.updateLanguageUI = function() {
    if (!window.i18n) return;
    
    const t = i18n.t;
    
    // Update all elements with data-i18n attributes
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (key && t(key)) {
            // Check if element has placeholder
            if (element.hasAttribute('placeholder')) {
                element.placeholder = t(key);
            } else {
                element.textContent = t(key);
            }
        }
    });
    
    // Update header
    const h1 = document.querySelector('h1');
    if (h1) h1.textContent = t('appTitle');
    
    const subtitle = document.querySelector('h1')?.nextElementSibling;
    if (subtitle) subtitle.textContent = t('appSubtitle');
    
    // Update tabs
    const plannerTab = document.getElementById('tab-planner');
    if (plannerTab) plannerTab.innerHTML = t('tabMealPlanner');
    
    const parentTab = document.getElementById('tab-parent');
    if (parentTab) parentTab.innerHTML = t('tabParentView');
    
    // Update control buttons
    const undoBtn = document.getElementById('undoButton');
    if (undoBtn) undoBtn.innerHTML = t('btnUndo');
    
    const profileBtn = document.getElementById('btnProfile');
    if (profileBtn) profileBtn.innerHTML = `👤 ${t('btnProfile').replace('👤 ', '')}`;
    
    // Update page title
    document.title = `🍱 ${t('appTitle')} - ${t('appSubtitle')}`;
    
    // Update Parent View section titles
    const parentDashboardTitle = document.querySelector('#parentTab h2');
    if (parentDashboardTitle && parentDashboardTitle.textContent.includes('Parent Dashboard')) {
        parentDashboardTitle.textContent = t('parentDashboard');
    }
    
    // Update all h2 titles in parent view
    const parentViewTitles = document.querySelectorAll('#parentTab .text-2xl');
    parentViewTitles.forEach(title => {
        if (title.textContent.includes('Weekly Summary')) {
            title.textContent = t('weeklySummaryTitle');
        } else if (title.textContent.includes('Shopping List')) {
            title.textContent = t('shoppingListTitle');
        } else if (title.textContent.includes('Nutritional Insights')) {
            title.textContent = t('nutritionalInsightsTitle');
        }
    });
    
    // Update buttons in parent view
    document.querySelectorAll('#parentTab button').forEach(btn => {
        const text = btn.textContent.trim();
        if (text.includes('Parent Settings')) {
            btn.innerHTML = t('btnParentSettings');
        } else if (text.includes('Generate List')) {
            btn.innerHTML = t('btnGenerateList');
        } else if (text.includes('Print')) {
            btn.innerHTML = t('btnPrint');
        }
    });
    
    // Update planner view titles
    const foodPaletteTitle = document.querySelector('#plannerTab .text-2xl');
    if (foodPaletteTitle) {
        foodPaletteTitle.textContent = t('foodPaletteTitle');
    }
    
    // Update weekly plan title
    const weeklyPlanTitles = document.querySelectorAll('#plannerTab .text-2xl');
    weeklyPlanTitles.forEach(title => {
        if (title.textContent.includes('Weekly Plan')) {
            title.textContent = t('weeklyPlanTitle');
        }
    });
    
    // Update Save/Load/Clear buttons
    document.querySelectorAll('#plannerTab button').forEach(btn => {
        const text = btn.textContent.trim();
        if (text.includes('Save') && !text.includes('Settings')) {
            btn.innerHTML = t('btnSave');
        } else if (text.includes('Load')) {
            btn.innerHTML = t('btnLoad');
        } else if (text.includes('Clear')) {
            btn.innerHTML = t('btnClear');
        }
    });
    
    // Update day labels
    const updatedDayLabels = {
        monday: t('monday') + ' 🌟',
        tuesday: t('tuesday') + ' 🌈',
        wednesday: t('wednesday') + ' 🦋',
        thursday: t('thursday') + ' 🚀',
        friday: t('friday') + ' 🎉'
    };
    
    // Update global dayLabels
    Object.assign(dayLabels, updatedDayLabels);
    
    // Update category names in tabs
    const categoryMap = {
        protein: t('categoryProteins'),
        veggie: t('categoryVegetables'),
        fruit: t('categoryFruits'),
        grain: t('categoryGrains'),
        dairy: t('categoryDairy'),
        snack: t('categorySnacks')
    };
    
    document.querySelectorAll('.category-tab').forEach(tab => {
        const categoryMatch = tab.id.match(/tab-(\w+)/);
        if (categoryMatch) {
            const category = categoryMatch[1];
            const spans = tab.querySelectorAll('span');
            if (spans[1] && categoryMap[category]) {
                spans[1].textContent = categoryMap[category];
            }
        }
    });
    
    // Update empty state messages
    const weeklySummary = document.getElementById('weeklySummary');
    if (weeklySummary) {
        const emptyMsg = weeklySummary.querySelector('p.text-gray-600');
        if (emptyMsg && emptyMsg.textContent.includes('see the summary')) {
            emptyMsg.textContent = 'תכנן ארוחות לשבוע כדי לראות את הסיכום כאן!';
        }
    }
    
    const shoppingList = document.getElementById('shoppingList');
    if (shoppingList) {
        const emptyMsg = shoppingList.querySelector('p.text-gray-600');
        if (emptyMsg && emptyMsg.textContent.includes('Generate shopping')) {
            emptyMsg.textContent = t('shoppingListEmpty');
        }
    }
    
    // Update food item names in the palette
    updateFoodItemNames();
    
    // Re-render weekly plan with new day labels
    if (typeof renderWeeklyPlan === 'function') {
        renderWeeklyPlan();
    }
    
    console.log('✅ Language UI updated');
};

// Function to update food item names based on current language
function updateFoodItemNames() {
    if (!window.i18n) return;
    
    const currentLang = i18n.getCurrentLanguage();
    
    // Update food items in the palette
    document.querySelectorAll('.food-item').forEach(card => {
        const nameEn = card.dataset.foodName;
        const nameHe = card.dataset.foodNameHe;
        const weeklyLimit = parseInt(card.dataset.weeklyLimit || 0);
        
        const displayName = (currentLang === 'he' && nameHe) ? nameHe : nameEn;
        
        // Update the name display
        const nameDisplay = card.querySelector('.food-name-display');
        if (nameDisplay) {
            nameDisplay.textContent = displayName;
        }
        
        // Update weekly limit text if present
        if (weeklyLimit > 0) {
            const weeklyLimitDisplay = card.querySelector('.food-weekly-limit');
            if (weeklyLimitDisplay) {
                weeklyLimitDisplay.textContent = i18n.t('maxWeekly', {limit: weeklyLimit});
            }
        }
    });
    
    // Update food items in the weekly plan
    document.querySelectorAll('.meal-item').forEach(item => {
        const nameEn = item.dataset.foodName;
        const nameHe = item.dataset.foodNameHe;
        
        if (nameEn) {
            const displayName = (currentLang === 'he' && nameHe) ? nameHe : nameEn;
            
            // Find the text node that contains the food name
            const textSpan = item.querySelector('.meal-name-display');
            if (textSpan) {
                textSpan.textContent = displayName;
            }
        }
    });
    
    console.log('✅ Food item names updated for language:', currentLang);
}

console.log('✅ Kids Meal Planner Enhanced loaded successfully!');
