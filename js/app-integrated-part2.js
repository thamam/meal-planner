// Part 2 of integrated app - continuation

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
            if (categories.hasOwnProperty(meal.category)) {
                categories[meal.category]++;
                totalMeals++;
            }
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
    
    const today = new Date();
    const weekStart = getMonday(today);
    const weekStartStr = weekStart.toISOString().split('T')[0];
    
    try {
        // Check if meal plan exists for this week
        const existingPlans = await fetch(`tables/meal_plans?search=${currentUser.id}`);
        const plansData = await existingPlans.json();
        
        const existingPlan = plansData.data ? plansData.data.find(p => 
            p.user_id === currentUser.id && p.week_start === weekStartStr
        ) : null;
        
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
        
        if (!silent) {
            showMessage('💾 Meal plan saved successfully!', 'success');
            if (window.Sounds) Sounds.playSuccess();
        } else {
            console.log('💾 Auto-saved meal plan');
        }
    } catch (error) {
        console.error('Error saving meal plan:', error);
        if (!silent) {
            showMessage('❌ Error saving meal plan', 'error');
            if (window.Sounds) Sounds.playError();
        }
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
        
        const plan = data.data ? data.data.find(p => 
            p.user_id === currentUser.id && p.week_start === weekStartStr
        ) : null;
        
        if (plan) {
            if (window.AutoSave) {
                AutoSave.setLoadingState(true);
            }
            
            weeklyMeals = JSON.parse(plan.meals);
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
    }
}

async function autoLoadMealPlan() {
    if (!currentUser) return;
    
    const today = new Date();
    const weekStart = getMonday(today);
    const weekStartStr = weekStart.toISOString().split('T')[0];
    
    try {
        const response = await fetch(`tables/meal_plans?search=${currentUser.id}`);
        const data = await response.json();
        
        const plan = data.data ? data.data.find(p => 
            p.user_id === currentUser.id && p.week_start === weekStartStr
        ) : null;
        
        if (plan) {
            if (window.AutoSave) {
                AutoSave.setLoadingState(true);
            }
            
            weeklyMeals = JSON.parse(plan.meals);
            updateWeeklyPlanDisplay();
            
            if (window.AutoSave) {
                setTimeout(() => AutoSave.setLoadingState(false), 100);
            }
            
            console.log('✅ Auto-loaded meal plan');
        }
    } catch (error) {
        console.error('Error auto-loading meal plan:', error);
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
                    items: JSON.stringify(ingredientsByCategory),
                    created_at_readable: new Date().toLocaleDateString()
                })
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

console.log('✅ Kids Meal Planner Enhanced loaded successfully!');
