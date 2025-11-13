// Part 3 of integrated app - Composite Builder & Parent Settings

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
        console.error('Error parsing steps:', e);
        return;
    }
    
    // Parse ingredients map
    let ingredientsMap = {};
    try {
        ingredientsMap = JSON.parse(compositeItem.ingredients_map);
    } catch (e) {
        console.error('Error parsing ingredients map:', e);
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
        
        const response = await fetch('tables/custom_foods', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(customFood)
        });
        
        const savedFood = await response.json();
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
        await fetch(`tables/custom_foods/${foodId}`, {
            method: 'DELETE'
        });
        
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

console.log('✅ Composite Builder & Parent Settings loaded!');
