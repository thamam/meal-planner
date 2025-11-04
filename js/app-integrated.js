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
let selectedAvatar = '😊';
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
    
    // Load user from localStorage
    loadUserFromStorage();
    
    // Initialize sound system
    if (window.Sounds) {
        Sounds.initSounds();
        if (currentUser) {
            Sounds.loadSoundPreferences(currentUser);
        }
    }
    
    // Load data from database
    await loadFoodItems();
    await loadCompositeItems();
    
    if (currentUser) {
        await loadCustomFoods();
        await loadUserRules();
    }
    
    // Render food palette with categories
    renderCategorizedFoodPalette();
    
    // Render weekly plan grid
    renderWeeklyPlan();
    
    // Check if there's a saved meal plan to load
    if (currentUser) {
        await autoLoadMealPlan();
        // Initialize history with current state
        if (window.AutoSave) {
            AutoSave.saveToHistory(weeklyMeals);
        }
    } else {
        // Show welcome screen for first-time users
        showWelcomeScreen();
    }
    
    // Setup keyboard shortcuts
    setupKeyboardShortcuts();
    
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
        currentUser = JSON.parse(savedUser);
        updateUserDisplay();
    }
}

function updateUserDisplay() {
    if (currentUser) {
        document.getElementById('userName').textContent = currentUser.name;
        document.getElementById('userAge').textContent = currentUser.age;
        document.getElementById('avatarDisplay').textContent = currentUser.avatar;
        document.getElementById('userInfo').classList.remove('hidden');
    }
}

function showProfileModal() {
    const modal = document.getElementById('profileModal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    
    // Pre-fill if user exists
    if (currentUser) {
        document.getElementById('profileName').value = currentUser.name || '';
        document.getElementById('profileAge').value = currentUser.age || '';
        selectedAvatar = currentUser.avatar || '😊';
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
    if (window.Sounds) {
        preferences = Sounds.saveSoundPreferences(currentUser) || '{}';
    }
    
    // Create or update user
    const userData = {
        name: name,
        age: parseInt(age),
        avatar: selectedAvatar,
        preferences: preferences
    };
    
    try {
        let savedUser;
        
        if (currentUser && currentUser.id) {
            // Update existing user
            const response = await fetch(`tables/users/${currentUser.id}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(userData)
            });
            savedUser = await response.json();
        } else {
            // Create new user
            const response = await fetch('tables/users', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(userData)
            });
            savedUser = await response.json();
        }
        
        currentUser = { ...userData, id: savedUser.id };
        
        // Save to localStorage
        localStorage.setItem('mealPlannerUser', JSON.stringify(currentUser));
        
        // Load user-specific data
        await loadCustomFoods();
        await loadUserRules();
        renderCategorizedFoodPalette();
        
        updateUserDisplay();
        closeProfileModal();
        
        showMessage('👤 Profile saved! Welcome, ' + name + '!', 'success');
        if (window.Sounds) Sounds.playSuccess();
    } catch (error) {
        console.error('Error saving profile:', error);
        showMessage('❌ Error saving profile. Please try again.', 'error');
        if (window.Sounds) Sounds.playError();
    }
}

// ==========================================
// Food Items Management
// ==========================================

async function loadFoodItems() {
    try {
        const response = await fetch('tables/food_items?limit=100');
        const data = await response.json();
        foodItems = (data.data || []).map(item => ({
            ...item,
            is_sweet: ['Mini Pizza', 'Pasta'].includes(item.name),
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
        const response = await fetch('tables/composite_items?limit=100');
        const data = await response.json();
        compositeItems = data.data || [];
        console.log(`✅ Loaded ${compositeItems.length} composite items`);
    } catch (error) {
        console.error('Error loading composite items:', error);
    }
}

async function loadCustomFoods() {
    if (!currentUser) return;
    
    try {
        const response = await fetch(`tables/custom_foods?search=${currentUser.id}`);
        const data = await response.json();
        customFoods = (data.data || []).filter(food => food.user_id === currentUser.id).map(food => ({
            ...food,
            type: 'custom'
        }));
        console.log(`✅ Loaded ${customFoods.length} custom foods`);
    } catch (error) {
        console.error('Error loading custom foods:', error);
    }
}

async function loadUserRules() {
    if (!currentUser || !window.Rules) return;
    
    await Rules.loadUserRules(currentUser);
}

function renderCategorizedFoodPalette() {
    if (!window.CategorizedView) return;
    
    CategorizedView.renderCategorizedFoodPalette(foodItems, compositeItems, customFoods);
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
        slot.addEventListener('drop', handleDrop);
        slot.addEventListener('dragover', handleDragOver);
        slot.addEventListener('dragleave', handleDragLeave);
        
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
            slot.innerHTML = meals.map((meal, index) => `
                <div class="flex items-center gap-2 bg-purple-50 rounded-lg p-2 mb-2 relative group">
                    <div class="text-3xl">${meal.icon}</div>
                    <div class="flex-1">
                        <div class="font-semibold text-sm text-gray-800">${meal.name}</div>
                        <div class="text-xs text-gray-500 capitalize">${meal.category}</div>
                    </div>
                    <button onclick="removeMeal('${day}', ${index})" 
                            class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 text-xs opacity-0 group-hover:opacity-100 transition">
                        ✕
                    </button>
                </div>
            `).join('');
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

// Continue in next part...
