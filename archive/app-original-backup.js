// ==========================================
// 🍱 Kids' Meal Planner - Main Application
// ==========================================

// Global State
let currentUser = null;
let foodItems = [];
let weeklyMeals = {
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: []
};
let selectedAvatar = '😊';

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
    console.log('🍱 Initializing Kids Meal Planner...');
    
    // Load user from localStorage
    loadUserFromStorage();
    
    // Load food items from database
    await loadFoodItems();
    
    // Render food palette
    renderFoodPalette();
    
    // Render weekly plan grid
    renderWeeklyPlan();
    
    // Check if there's a saved meal plan to load
    if (currentUser) {
        await autoLoadMealPlan();
    } else {
        // Show welcome screen for first-time users
        showWelcomeScreen();
    }
    
    console.log('✅ App initialized!');
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
    
    // Show profile modal
    setTimeout(() => {
        showProfileModal();
    }, 500);
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
}

function closeProfileModal() {
    const modal = document.getElementById('profileModal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

function selectAvatar(emoji) {
    selectedAvatar = emoji;
    document.querySelectorAll('.avatar-option').forEach(btn => {
        btn.style.background = '';
    });
    event.target.style.background = '#e9d5ff';
}

async function saveProfile() {
    const name = document.getElementById('profileName').value.trim();
    const age = document.getElementById('profileAge').value;
    
    if (!name || !age) {
        alert('Please enter your name and age!');
        return;
    }
    
    // Create or update user
    currentUser = {
        name: name,
        age: parseInt(age),
        avatar: selectedAvatar,
        preferences: JSON.stringify({})
    };
    
    try {
        // Save to database
        const response = await fetch('tables/users', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(currentUser)
        });
        
        const savedUser = await response.json();
        currentUser.id = savedUser.id;
        
        // Save to localStorage
        localStorage.setItem('mealPlannerUser', JSON.stringify(currentUser));
        
        updateUserDisplay();
        closeProfileModal();
        
        showMessage('👤 Profile saved! Welcome, ' + name + '!', 'success');
    } catch (error) {
        console.error('Error saving profile:', error);
        showMessage('❌ Error saving profile. Please try again.', 'error');
    }
}

// ==========================================
// Food Items Management
// ==========================================

async function loadFoodItems() {
    try {
        const response = await fetch('tables/food_items?limit=100');
        const data = await response.json();
        foodItems = data.data;
        console.log(`✅ Loaded ${foodItems.length} food items`);
    } catch (error) {
        console.error('Error loading food items:', error);
        showMessage('❌ Error loading food items', 'error');
    }
}

function renderFoodPalette() {
    const palette = document.getElementById('foodPalette');
    palette.innerHTML = '';
    
    foodItems.forEach(item => {
        const foodCard = document.createElement('div');
        foodCard.className = 'food-item bg-white rounded-2xl p-4 shadow-lg text-center cursor-grab';
        foodCard.draggable = true;
        foodCard.dataset.foodId = item.id;
        foodCard.dataset.foodName = item.name;
        foodCard.dataset.foodIcon = item.icon;
        foodCard.dataset.foodCategory = item.category;
        foodCard.dataset.ingredients = item.ingredients;
        
        foodCard.innerHTML = `
            <div class="text-5xl mb-2">${item.icon}</div>
            <div class="text-sm font-semibold text-gray-700">${item.name}</div>
            <div class="text-xs text-gray-500 capitalize">${item.category}</div>
        `;
        
        // Drag events
        foodCard.addEventListener('dragstart', handleDragStart);
        foodCard.addEventListener('dragend', handleDragEnd);
        
        palette.appendChild(foodCard);
    });
}

// ==========================================
// Weekly Plan Grid
// ==========================================

function renderWeeklyPlan() {
    const planContainer = document.getElementById('weeklyPlan');
    planContainer.innerHTML = '';
    
    days.forEach(day => {
        const dayCard = document.createElement('div');
        dayCard.className = 'bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-4';
        
        dayCard.innerHTML = `
            <h3 class="text-xl font-bold text-purple-700 mb-3 text-center">${dayLabels[day]}</h3>
            <div class="meal-slot bg-white rounded-xl p-3 border-2 border-dashed border-purple-300 min-h-[120px]" 
                 data-day="${day}"
                 ondrop="handleDrop(event)"
                 ondragover="handleDragOver(event)"
                 ondragleave="handleDragLeave(event)">
                <div class="text-center text-gray-400 text-sm meal-placeholder">
                    Drag food here!
                </div>
            </div>
        `;
        
        planContainer.appendChild(dayCard);
    });
    
    // Restore any existing meals
    updateWeeklyPlanDisplay();
}

function updateWeeklyPlanDisplay() {
    days.forEach(day => {
        const slot = document.querySelector(`[data-day="${day}"]`);
        const meals = weeklyMeals[day];
        
        if (meals.length === 0) {
            slot.innerHTML = '<div class="text-center text-gray-400 text-sm meal-placeholder">Drag food here!</div>';
        } else {
            slot.innerHTML = meals.map(meal => `
                <div class="flex items-center gap-2 bg-purple-50 rounded-lg p-2 mb-2 relative group">
                    <div class="text-3xl">${meal.icon}</div>
                    <div class="flex-1">
                        <div class="font-semibold text-sm text-gray-800">${meal.name}</div>
                        <div class="text-xs text-gray-500 capitalize">${meal.category}</div>
                    </div>
                    <button onclick="removeMeal('${day}', '${meal.id}')" 
                            class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 text-xs opacity-0 group-hover:opacity-100 transition">
                        ✕
                    </button>
                </div>
            `).join('');
        }
    });
    
    // Update health meter
    updateHealthMeter();
}

// ==========================================
// Drag and Drop Handlers
// ==========================================

let draggedElement = null;

function handleDragStart(e) {
    draggedElement = e.target;
    e.target.style.opacity = '0.5';
    e.dataTransfer.effectAllowed = 'copy';
}

function handleDragEnd(e) {
    e.target.style.opacity = '1';
}

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
    
    if (draggedElement) {
        const day = slot.dataset.day;
        const meal = {
            id: draggedElement.dataset.foodId,
            name: draggedElement.dataset.foodName,
            icon: draggedElement.dataset.foodIcon,
            category: draggedElement.dataset.foodCategory,
            ingredients: draggedElement.dataset.ingredients
        };
        
        // Add meal to the day
        weeklyMeals[day].push(meal);
        updateWeeklyPlanDisplay();
        
        // Animate avatar
        animateAvatar('happy');
        
        // Play success sound (visual feedback)
        showMessage('✨ Added ' + meal.name + ' to ' + dayLabels[day], 'success');
    }
}

function removeMeal(day, mealId) {
    weeklyMeals[day] = weeklyMeals[day].filter(meal => meal.id !== mealId);
    updateWeeklyPlanDisplay();
    showMessage('🗑️ Meal removed!', 'info');
}

// ==========================================
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
            categories[meal.category]++;
            totalMeals++;
        });
    });
    
    // Update category counts
    document.getElementById('proteinCount').textContent = categories.protein;
    document.getElementById('veggieCount').textContent = categories.veggie;
    document.getElementById('fruitCount').textContent = categories.fruit;
    document.getElementById('grainCount').textContent = categories.grain;
    document.getElementById('dairyCount').textContent = categories.dairy;
    
    // Calculate balance score
    let score = 0;
    if (totalMeals > 0) {
        // Ideal: at least 1 of each category per week (5 total)
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
    
    healthFill.style.width = score + '%';
    healthScore.textContent = Math.round(score) + '%';
    
    // Color coding
    if (score < 40) {
        healthFill.className = 'health-fill bg-red-400';
        animateAvatar('sad');
    } else if (score < 70) {
        healthFill.className = 'health-fill bg-yellow-400';
    } else {
        healthFill.className = 'health-fill bg-green-400';
        if (score === 100) {
            animateAvatar('happy');
        }
    }
}

// ==========================================
// Avatar Animation
// ==========================================

function animateAvatar(emotion) {
    const avatar = document.getElementById('avatarDisplay');
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

async function saveMealPlan() {
    if (!currentUser) {
        showMessage('⚠️ Please create a profile first!', 'warning');
        showProfileModal();
        return;
    }
    
    // Get current week start date
    const today = new Date();
    const weekStart = getMonday(today);
    const weekStartStr = weekStart.toISOString().split('T')[0];
    
    try {
        // Check if meal plan exists for this week
        const existingPlans = await fetch(`tables/meal_plans?search=${currentUser.id}`);
        const plansData = await existingPlans.json();
        
        const existingPlan = plansData.data.find(p => 
            p.user_id === currentUser.id && p.week_start === weekStartStr
        );
        
        const mealPlanData = {
            user_id: currentUser.id,
            week_start: weekStartStr,
            meals: JSON.stringify(weeklyMeals)
        };
        
        if (existingPlan) {
            // Update existing plan
            await fetch(`tables/meal_plans/${existingPlan.id}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(mealPlanData)
            });
        } else {
            // Create new plan
            await fetch('tables/meal_plans', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(mealPlanData)
            });
        }
        
        showMessage('💾 Meal plan saved successfully!', 'success');
    } catch (error) {
        console.error('Error saving meal plan:', error);
        showMessage('❌ Error saving meal plan', 'error');
    }
}

async function loadMealPlan() {
    if (!currentUser) {
        showMessage('⚠️ Please create a profile first!', 'warning');
        showProfileModal();
        return;
    }
    
    const today = new Date();
    const weekStart = getMonday(today);
    const weekStartStr = weekStart.toISOString().split('T')[0];
    
    try {
        const response = await fetch(`tables/meal_plans?search=${currentUser.id}`);
        const data = await response.json();
        
        const plan = data.data.find(p => 
            p.user_id === currentUser.id && p.week_start === weekStartStr
        );
        
        if (plan) {
            weeklyMeals = JSON.parse(plan.meals);
            updateWeeklyPlanDisplay();
            showMessage('📂 Meal plan loaded!', 'success');
        } else {
            showMessage('ℹ️ No saved plan for this week', 'info');
        }
    } catch (error) {
        console.error('Error loading meal plan:', error);
        showMessage('❌ Error loading meal plan', 'error');
    }
}

async function autoLoadMealPlan() {
    const today = new Date();
    const weekStart = getMonday(today);
    const weekStartStr = weekStart.toISOString().split('T')[0];
    
    try {
        const response = await fetch(`tables/meal_plans?search=${currentUser.id}`);
        const data = await response.json();
        
        const plan = data.data.find(p => 
            p.user_id === currentUser.id && p.week_start === weekStartStr
        );
        
        if (plan) {
            weeklyMeals = JSON.parse(plan.meals);
            updateWeeklyPlanDisplay();
            console.log('✅ Auto-loaded meal plan');
        }
    } catch (error) {
        console.error('Error auto-loading meal plan:', error);
    }
}

function clearWeek() {
    if (confirm('Are you sure you want to clear this week? This cannot be undone!')) {
        weeklyMeals = {
            monday: [],
            tuesday: [],
            wednesday: [],
            thursday: [],
            friday: []
        };
        updateWeeklyPlanDisplay();
        showMessage('🗑️ Week cleared!', 'info');
    }
}

// ==========================================
// Tab Navigation
// ==========================================

function switchTab(tab) {
    // Update tab buttons
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
        
        // Update parent view
        updateParentView();
    }
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
    
    const ingredients = {};
    
    // Collect all ingredients
    days.forEach(day => {
        weeklyMeals[day].forEach(meal => {
            try {
                const mealIngredients = JSON.parse(meal.ingredients);
                mealIngredients.forEach(ingredient => {
                    ingredients[ingredient] = (ingredients[ingredient] || 0) + 1;
                });
            } catch (error) {
                console.error('Error parsing ingredients:', error);
            }
        });
    });
    
    // Display shopping list
    const shoppingListDiv = document.getElementById('shoppingList');
    
    if (Object.keys(ingredients).length === 0) {
        shoppingListDiv.innerHTML = '<p class="text-gray-600">Add meals to your plan first!</p>';
        return;
    }
    
    let html = '<div class="space-y-2">';
    Object.entries(ingredients).forEach(([ingredient, count]) => {
        html += `
            <div class="flex items-center gap-3 bg-white rounded-lg p-3 border border-purple-200">
                <input type="checkbox" class="w-5 h-5 text-purple-600 rounded">
                <span class="flex-1 text-gray-700 capitalize">${ingredient}</span>
                <span class="text-purple-600 font-semibold">× ${count}</span>
            </div>
        `;
    });
    html += '</div>';
    
    shoppingListDiv.innerHTML = html;
    
    // Save to database
    try {
        const today = new Date();
        const weekStart = getMonday(today);
        const weekStartStr = weekStart.toISOString().split('T')[0];
        
        await fetch('tables/shopping_lists', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                user_id: currentUser.id,
                week_start: weekStartStr,
                items: JSON.stringify(ingredients),
                created_at_readable: new Date().toLocaleDateString()
            })
        });
        
        showMessage('🛒 Shopping list generated!', 'success');
    } catch (error) {
        console.error('Error saving shopping list:', error);
    }
}

function printShoppingList() {
    window.print();
}

function updateNutritionalInsights() {
    const insightsDiv = document.getElementById('nutritionalInsights');
    
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
            categories[meal.category]++;
            totalMeals++;
        });
    });
    
    if (totalMeals === 0) {
        insightsDiv.innerHTML = '<p class="text-gray-600">Complete the meal plan to see insights!</p>';
        return;
    }
    
    let insights = [];
    
    // Generate insights
    if (categories.protein < 3) {
        insights.push({
            icon: '⚠️',
            text: 'Add more protein! Try chicken, fish, or eggs.',
            color: 'text-orange-600'
        });
    } else {
        insights.push({
            icon: '✅',
            text: 'Great protein intake!',
            color: 'text-green-600'
        });
    }
    
    if (categories.veggie < 5) {
        insights.push({
            icon: '⚠️',
            text: 'Need more veggies! Add broccoli, carrots, or tomatoes.',
            color: 'text-orange-600'
        });
    } else {
        insights.push({
            icon: '✅',
            text: 'Excellent veggie choices!',
            color: 'text-green-600'
        });
    }
    
    if (categories.fruit < 3) {
        insights.push({
            icon: '⚠️',
            text: 'Add more fruits! Try apples, bananas, or berries.',
            color: 'text-orange-600'
        });
    } else {
        insights.push({
            icon: '✅',
            text: 'Perfect fruit balance!',
            color: 'text-green-600'
        });
    }
    
    if (categories.grain < 3) {
        insights.push({
            icon: '⚠️',
            text: 'Include more whole grains like brown rice or whole wheat bread.',
            color: 'text-orange-600'
        });
    }
    
    if (categories.dairy < 2) {
        insights.push({
            icon: 'ℹ️',
            text: 'Consider adding dairy like yogurt or cheese for calcium.',
            color: 'text-blue-600'
        });
    }
    
    // Render insights
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
    // Create toast notification
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
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

console.log('✅ Kids Meal Planner loaded successfully!');
