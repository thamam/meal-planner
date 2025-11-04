// ==========================================
// 🍱 Kids' Meal Planner - Enhanced Version
// ==========================================

// ==========================================
// Global State
// ==========================================

let currentUser = null;
let foodItems = [];
let compositeItems = [];
let customFoods = [];
let userRules = {};
let weeklyMeals = {
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: []
};
let selectedAvatar = '😊';

// Auto-save & Undo System
let historyStack = [];
let maxHistorySize = 5;
let autoSaveTimer = null;
let isLoadingState = false;

// Sound System
let sounds = {
    bgMusic: null,
    click: null,
    success: null,
    error: null,
    fanfare: null,
    drop: null
};
let soundEnabled = true;
let musicEnabled = false;

// Guidance System
let guidanceEnabled = true;
let lastSuggestionTime = 0;
let suggestionCooldown = 10000; // 10 seconds

// Days configuration
const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
const dayLabels = {
    monday: 'Monday 🌟',
    tuesday: 'Tuesday 🌈',
    wednesday: 'Wednesday 🦋',
    thursday: 'Thursday 🚀',
    friday: 'Friday 🎉'
};

// Category information
const categoryInfo = {
    protein: { icon: '🍗', name: 'Proteins', color: '#f87171' },
    veggie: { icon: '🥦', name: 'Vegetables', color: '#4ade80' },
    fruit: { icon: '🍎', name: 'Fruits', color: '#fb923c' },
    grain: { icon: '🍞', name: 'Grains', color: '#fbbf24' },
    dairy: { icon: '🧀', name: 'Dairy', color: '#60a5fa' }
};

// ==========================================
// Initialization
// ==========================================

document.addEventListener('DOMContentLoaded', async () => {
    console.log('🍱 Initializing Kids Meal Planner Enhanced...');
    
    // Load user from localStorage
    loadUserFromStorage();
    
    // Initialize sound system
    initSounds();
    
    // Load food items from database
    await loadFoodItems();
    await loadCompositeItems();
    await loadCustomFoods();
    
    // Load user rules if user exists
    if (currentUser) {
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
        saveToHistory();
    } else {
        // Show welcome screen for first-time users
        showWelcomeScreen();
    }
    
    // Setup keyboard shortcuts
    setupKeyboardShortcuts();
    
    console.log('✅ App initialized with enhanced features!');
});

// ==========================================
// Sound System
// ==========================================

function initSounds() {
    // Initialize sound objects (will use Web Audio API or simple Audio elements)
    // For now, we'll create placeholder audio elements that can be replaced with actual sound files
    
    sounds.bgMusic = createSound('sounds/background-music.mp3', true, 0.3);
    sounds.click = createSound('sounds/click.mp3', false, 0.5);
    sounds.success = createSound('sounds/success.mp3', false, 0.7);
    sounds.error = createSound('sounds/error.mp3', false, 0.6);
    sounds.fanfare = createSound('sounds/fanfare.mp3', false, 0.8);
    sounds.drop = createSound('sounds/drop.mp3', false, 0.4);
    
    // Load sound preferences from user
    if (currentUser && currentUser.preferences) {
        try {
            const prefs = JSON.parse(currentUser.preferences);
            soundEnabled = prefs.soundEnabled !== false;
            musicEnabled = prefs.musicEnabled === true;
        } catch (e) {
            console.log('Using default sound settings');
        }
    }
    
    // Start background music if enabled
    if (musicEnabled && sounds.bgMusic) {
        playSound('bgMusic');
    }
}

function createSound(src, loop = false, volume = 1.0) {
    try {
        const audio = new Audio();
        audio.src = src;
        audio.loop = loop;
        audio.volume = volume;
        audio.preload = 'auto';
        
        // Catch loading errors silently (sounds are optional)
        audio.addEventListener('error', () => {
            console.log(`Sound file not found: ${src} (optional)`);
        });
        
        return audio;
    } catch (e) {
        console.log(`Could not create sound: ${src}`);
        return null;
    }
}

function playSound(soundName) {
    if (!soundEnabled && soundName !== 'bgMusic') return;
    if (!musicEnabled && soundName === 'bgMusic') return;
    
    const sound = sounds[soundName];
    if (sound) {
        try {
            sound.currentTime = 0;
            sound.play().catch(e => {
                // Silent fail - browser may block autoplay
                console.log('Sound play blocked:', soundName);
            });
        } catch (e) {
            console.log('Error playing sound:', soundName);
        }
    }
}

function toggleSound() {
    soundEnabled = !soundEnabled;
    updateSoundPreferences();
    showMessage(soundEnabled ? '🔊 Sounds On' : '🔇 Sounds Off', 'info');
}

function toggleMusic() {
    musicEnabled = !musicEnabled;
    
    if (musicEnabled && sounds.bgMusic) {
        playSound('bgMusic');
    } else if (sounds.bgMusic) {
        sounds.bgMusic.pause();
    }
    
    updateSoundPreferences();
    showMessage(musicEnabled ? '🎵 Music On' : '🎵 Music Off', 'info');
}

function updateSoundPreferences() {
    if (!currentUser) return;
    
    try {
        const prefs = JSON.parse(currentUser.preferences || '{}');
        prefs.soundEnabled = soundEnabled;
        prefs.musicEnabled = musicEnabled;
        currentUser.preferences = JSON.stringify(prefs);
        localStorage.setItem('mealPlannerUser', JSON.stringify(currentUser));
    } catch (e) {
        console.error('Error updating sound preferences:', e);
    }
}

// ==========================================
// Auto-save System
// ==========================================

function triggerAutoSave() {
    if (isLoadingState) return; // Don't auto-save while loading
    if (!currentUser) return; // Need user to save
    
    // Save to history before the change
    saveToHistory();
    
    // Debounce auto-save
    clearTimeout(autoSaveTimer);
    autoSaveTimer = setTimeout(async () => {
        await saveMealPlan(true); // Silent save
    }, 2000); // Save 2 seconds after last change
}

function saveToHistory() {
    if (isLoadingState) return;
    
    // Deep clone current state
    const currentState = JSON.parse(JSON.stringify(weeklyMeals));
    
    // Add to history stack
    historyStack.push(currentState);
    
    // Limit history size
    if (historyStack.length > maxHistorySize) {
        historyStack.shift(); // Remove oldest
    }
    
    // Update UI
    updateUndoButton();
}

function undo() {
    if (historyStack.length === 0) {
        showMessage('⚠️ Nothing to undo!', 'warning');
        playSound('error');
        return;
    }
    
    // Get previous state
    const previousState = historyStack.pop();
    
    // Flag to prevent auto-save during restore
    isLoadingState = true;
    
    // Restore state
    weeklyMeals = JSON.parse(JSON.stringify(previousState));
    updateWeeklyPlanDisplay();
    
    // Re-enable auto-save
    setTimeout(() => {
        isLoadingState = false;
    }, 100);
    
    showMessage('↩️ Undone!', 'info');
    playSound('click');
    updateUndoButton();
    
    // Trigger auto-save with new state
    triggerAutoSave();
}

function updateUndoButton() {
    const undoBtn = document.getElementById('undoButton');
    if (undoBtn) {
        undoBtn.disabled = historyStack.length === 0;
        undoBtn.style.opacity = historyStack.length === 0 ? '0.5' : '1';
    }
}

// ==========================================
// Rule Engine
// ==========================================

async function loadUserRules() {
    if (!currentUser) return;
    
    try {
        const response = await fetch(`tables/rules?search=${currentUser.id}`);
        const data = await response.json();
        
        // Build rules object
        userRules = {
            noDuplicatesPerDay: true,
            maxItemsPerDay: 5,
            maxSweetsPerWeek: 2,
            requireProteinDaily: false,
            requireVeggieDaily: false
        };
        
        // Override with user's custom rules
        data.data.forEach(rule => {
            if (rule.user_id === currentUser.id && rule.enabled) {
                try {
                    userRules[rule.rule_name] = JSON.parse(rule.rule_value);
                } catch (e) {
                    userRules[rule.rule_name] = rule.rule_value;
                }
            }
        });
        
        console.log('✅ Loaded user rules:', userRules);
    } catch (error) {
        console.log('Using default rules');
    }
}

function validateMealDrop(food, day) {
    const dayMeals = weeklyMeals[day];
    
    // Rule 1: No duplicates per day
    if (userRules.noDuplicatesPerDay) {
        const hasDuplicate = dayMeals.some(meal => meal.id === food.id);
        if (hasDuplicate) {
            return {
                valid: false,
                message: `You already have ${food.name} on ${dayLabels[day]}! 🤔`
            };
        }
    }
    
    // Rule 2: Max items per day
    if (userRules.maxItemsPerDay && dayMeals.length >= userRules.maxItemsPerDay) {
        return {
            valid: false,
            message: `Maximum ${userRules.maxItemsPerDay} items per day! That's enough for ${dayLabels[day]} 😊`
        };
    }
    
    // Rule 3: Max sweets per week
    if (food.is_sweet && userRules.maxSweetsPerWeek) {
        const currentSweets = countWeeklySweets();
        if (currentSweets >= userRules.maxSweetsPerWeek) {
            return {
                valid: false,
                message: `Maximum ${userRules.maxSweetsPerWeek} treats per week! Save room for healthy foods 🌟`
            };
        }
    }
    
    // Rule 4: Check weekly limits for specific items
    if (food.weekly_limit && food.weekly_limit > 0) {
        const currentCount = countFoodInWeek(food.id);
        if (currentCount >= food.weekly_limit) {
            return {
                valid: false,
                message: `Maximum ${food.weekly_limit} ${food.name} per week! Try something different 🎨`
            };
        }
    }
    
    return { valid: true };
}

function countWeeklySweets() {
    let count = 0;
    days.forEach(day => {
        weeklyMeals[day].forEach(meal => {
            if (meal.is_sweet) count++;
        });
    });
    return count;
}

function countFoodInWeek(foodId) {
    let count = 0;
    days.forEach(day => {
        weeklyMeals[day].forEach(meal => {
            if (meal.id === foodId) count++;
        });
    });
    return count;
}

// ==========================================
// Guidance System
// ==========================================

function provideSuggestion() {
    if (!guidanceEnabled) return;
    
    const now = Date.now();
    if (now - lastSuggestionTime < suggestionCooldown) return; // Cooldown
    
    const categories = getCategoryCounts();
    const totalMeals = Object.values(categories).reduce((a, b) => a + b, 0);
    
    if (totalMeals === 0) {
        showGuidanceMessage("Let's start planning! Try adding your favorite food 🌟");
        return;
    }
    
    // Suggest based on what's missing
    if (categories.veggie < 2) {
        showGuidanceMessage("How about adding some veggies? They make you strong! 🥦💪", "veggie");
    } else if (categories.protein < 2) {
        showGuidanceMessage("Don't forget protein! It helps you grow! 🍗🌟", "protein");
    } else if (categories.fruit < 2) {
        showGuidanceMessage("Fruits are yummy and healthy! Try one! 🍎🍌", "fruit");
    } else if (categories.grain < 2) {
        showGuidanceMessage("Grains give you energy to play! 🍞⚡", "grain");
    } else if (categories.dairy < 1) {
        showGuidanceMessage("Dairy helps build strong bones! 🧀🦴", "dairy");
    }
    
    lastSuggestionTime = now;
}

function showGuidanceMessage(message, highlightCategory = null) {
    const guidanceBox = document.getElementById('guidanceBox');
    if (!guidanceBox) return;
    
    guidanceBox.textContent = message;
    guidanceBox.classList.remove('hidden');
    guidanceBox.classList.add('animate-bounce');
    
    // Highlight suggested category
    if (highlightCategory) {
        highlightCategorySection(highlightCategory);
    }
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        guidanceBox.classList.add('hidden');
        guidanceBox.classList.remove('animate-bounce');
    }, 5000);
}

function highlightCategorySection(category) {
    // Remove existing highlights
    document.querySelectorAll('.category-section').forEach(section => {
        section.classList.remove('ring-4', 'ring-yellow-400');
    });
    
    // Highlight target category
    const categorySection = document.querySelector(`[data-category="${category}"]`);
    if (categorySection) {
        categorySection.classList.add('ring-4', 'ring-yellow-400');
        setTimeout(() => {
            categorySection.classList.remove('ring-4', 'ring-yellow-400');
        }, 3000);
    }
}

function celebrateHealthyChoice(food) {
    // Positive reinforcement for good choices
    const healthyCategories = ['veggie', 'fruit', 'protein'];
    
    if (healthyCategories.includes(food.category)) {
        const messages = [
            "Great choice! 🌟",
            "Awesome! You're so healthy! 💪",
            "Yes! That's perfect! ⭐",
            "Love it! Keep going! 🎉",
            "Super healthy! 🦸‍♀️"
        ];
        
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        showGuidanceMessage(randomMessage);
        playSound('success');
        animateAvatar('happy');
    }
}

function getCategoryCounts() {
    const categories = {
        protein: 0,
        veggie: 0,
        fruit: 0,
        grain: 0,
        dairy: 0
    };
    
    days.forEach(day => {
        weeklyMeals[day].forEach(meal => {
            if (categories.hasOwnProperty(meal.category)) {
                categories[meal.category]++;
            }
        });
    });
    
    return categories;
}

// ==========================================
// Keyboard Shortcuts
// ==========================================

function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + Z = Undo
        if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
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
// Food Items Management
// ==========================================

async function loadFoodItems() {
    try {
        const response = await fetch('tables/food_items?limit=100');
        const data = await response.json();
        foodItems = data.data || [];
        
        // Add is_sweet flag based on food type (for now, pizza and pasta are treats)
        foodItems = foodItems.map(item => ({
            ...item,
            is_sweet: ['Mini Pizza', 'Pasta'].includes(item.name),
            weekly_limit: 0 // 0 = unlimited by default
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
        customFoods = data.data.filter(food => food.user_id === currentUser.id) || [];
        console.log(`✅ Loaded ${customFoods.length} custom foods`);
    } catch (error) {
        console.error('Error loading custom foods:', error);
    }
}

// Continue in next part...
