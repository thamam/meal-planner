// ==========================================
// Categorized View Module
// ==========================================

const categoryInfo = {
    protein: { icon: '🍗', name: 'Proteins', color: 'purple', bgColor: 'bg-purple-50', borderColor: 'border-purple-200' },
    veggie: { icon: '🥦', name: 'Vegetables', color: 'green', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
    fruit: { icon: '🍎', name: 'Fruits', color: 'red', bgColor: 'bg-red-50', borderColor: 'border-red-200' },
    grain: { icon: '🍞', name: 'Grains', color: 'yellow', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' },
    dairy: { icon: '🧀', name: 'Dairy', color: 'blue', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
    snack: { icon: '🍿', name: 'Snacks', color: 'orange', bgColor: 'bg-orange-50', borderColor: 'border-orange-200' }
};

// ==========================================
// Render Categorized Food Palette
// ==========================================

function renderCategorizedFoodPalette(foodItems, compositeItems = [], customFoods = []) {
    const palette = document.getElementById('foodPalette');
    if (!palette) return;
    
    // Group foods by category
    const groupedFoods = groupFoodsByCategory(foodItems, compositeItems, customFoods);
    
    // Create tab navigation
    let tabsHTML = '<div class="flex gap-2 mb-4 overflow-x-auto">';
    Object.keys(categoryInfo).forEach((category, index) => {
        const foods = groupedFoods[category] || [];
        if (foods.length === 0) return;
        
        const info = categoryInfo[category];
        const activeClass = index === 0 ? 'bg-white border-2 border-purple-500' : 'bg-gray-100 border-2 border-gray-300';
        
        tabsHTML += `
            <button onclick="switchFoodCategory('${category}')" 
                    id="tab-${category}"
                    class="category-tab flex items-center gap-2 px-4 py-3 rounded-xl font-semibold transition whitespace-nowrap ${activeClass}">
                <span class="text-2xl">${info.icon}</span>
                <span>${info.name}</span>
                <span class="text-sm text-gray-500">(${foods.length})</span>
            </button>
        `;
    });
    tabsHTML += '</div>';
    
    // Create content panels
    let contentHTML = '<div class="relative min-h-[300px]">';
    Object.keys(categoryInfo).forEach((category, index) => {
        const foods = groupedFoods[category] || [];
        if (foods.length === 0) return;
        
        const displayClass = index === 0 ? '' : 'hidden';
        
        contentHTML += `
            <div id="content-${category}" class="category-content ${displayClass}">
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        `;
        
        foods.forEach(food => {
            contentHTML += createFoodCardHTML(food);
        });
        
        contentHTML += `
                </div>
            </div>
        `;
    });
    contentHTML += '</div>';
    
    palette.innerHTML = tabsHTML + contentHTML;
    
    // Attach drag events
    attachDragEvents();
}

function createFoodCardHTML(food) {
    const compositeIndicator = food.type === 'composite' ? 
        '<div class="absolute top-1 right-1 text-xs bg-purple-500 text-white rounded-full px-2">🔨</div>' : '';
    
    const customIndicator = food.type === 'custom' ? 
        '<div class="absolute top-1 left-1 text-xs bg-green-500 text-white rounded-full px-2">⭐</div>' : '';
    
    // Get appropriate name based on current language
    const currentLang = window.i18n ? window.i18n.getCurrentLanguage() : 'en';
    const displayName = (currentLang === 'he' && food.name_he) ? food.name_he : food.name;
    
    // Get translated "Max X/week" text
    const weeklyLimitText = window.i18n ? window.i18n.t('maxWeekly', {limit: food.weekly_limit}) : `Max ${food.weekly_limit}/week`;
    
    return `
        <div class="food-item bg-white rounded-xl p-3 shadow-md hover:shadow-xl text-center cursor-grab transition-all"
             draggable="true"
             data-food-id="${food.id}"
             data-food-name="${food.name}"
             data-food-name-he="${food.name_he || ''}"
             data-food-icon="${food.icon}"
             data-food-category="${food.category}"
             data-ingredients="${food.ingredients || '[]'}"
             data-food-type="${food.type || 'regular'}"
             data-is-sweet="${food.is_sweet || false}"
             data-weekly-limit="${food.weekly_limit || 0}">
            <div class="relative">
                ${compositeIndicator}
                ${customIndicator}
                <div class="text-4xl mb-2">${food.icon}</div>
                <div class="text-sm font-semibold text-gray-700 food-name-display">${displayName}</div>
                ${food.weekly_limit > 0 ? `<div class="text-xs text-gray-400 food-weekly-limit">${weeklyLimitText}</div>` : ''}
            </div>
        </div>
    `;
}

function attachDragEvents() {
    document.querySelectorAll('.food-item').forEach(card => {
        card.addEventListener('dragstart', handleDragStart);
        card.addEventListener('dragend', handleDragEnd);
        
        // Click event for composite items
        if (card.dataset.foodType === 'composite') {
            card.addEventListener('click', () => {
                if (window.openCompositeBuilder) {
                    const compositeId = card.dataset.foodId;
                    const compositeItems = window.compositeItems || [];
                    const composite = compositeItems.find(item => item.id === compositeId);
                    if (composite) {
                        openCompositeBuilder(composite);
                    }
                }
            });
            card.style.cursor = 'pointer';
        }
    });
}

window.switchFoodCategory = function(category) {
    // Update tabs
    document.querySelectorAll('.category-tab').forEach(tab => {
        tab.classList.remove('bg-white', 'border-purple-500');
        tab.classList.add('bg-gray-100', 'border-gray-300');
    });
    
    const activeTab = document.getElementById(`tab-${category}`);
    if (activeTab) {
        activeTab.classList.remove('bg-gray-100', 'border-gray-300');
        activeTab.classList.add('bg-white', 'border-purple-500');
    }
    
    // Update content
    document.querySelectorAll('.category-content').forEach(content => {
        content.classList.add('hidden');
    });
    
    const activeContent = document.getElementById(`content-${category}`);
    if (activeContent) {
        activeContent.classList.remove('hidden');
    }
    
    if (window.Sounds) {
        window.Sounds.playClick();
    }
};

function groupFoodsByCategory(foodItems, compositeItems, customFoods) {
    const grouped = {
        protein: [],
        veggie: [],
        fruit: [],
        grain: [],
        dairy: [],
        snack: []
    };
    
    // Add regular food items
    foodItems.forEach(item => {
        if (grouped[item.category]) {
            grouped[item.category].push({ ...item, type: 'regular' });
        }
    });
    
    // Add composite items
    compositeItems.forEach(item => {
        if (grouped[item.category]) {
            grouped[item.category].push({ ...item, type: 'composite' });
        }
    });
    
    // Add custom foods
    customFoods.forEach(item => {
        if (grouped[item.category]) {
            grouped[item.category].push({ ...item, type: 'custom' });
        }
    });
    
    return grouped;
}

// Old functions removed - replaced with tab-based system above

// ==========================================
// Shopping List Categorization
// ==========================================

function generateCategorizedShoppingList(weeklyMeals) {
    const foodItemsByCategory = {
        protein: {},
        veggie: {},
        fruit: {},
        grain: {},
        dairy: {},
        snack: {},
        other: {}
    };
    
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    
    // Collect all food items by category (not ingredients)
    days.forEach(day => {
        weeklyMeals[day].forEach(meal => {
            try {
                const category = meal.category || 'other';
                
                // Get the display name based on current language
                const currentLang = window.i18n ? window.i18n.getCurrentLanguage() : 'en';
                const displayName = (currentLang === 'he' && meal.name_he) ? meal.name_he : meal.name;
                
                if (!foodItemsByCategory[category]) {
                    foodItemsByCategory[category] = {};
                }
                
                // Count each food item
                foodItemsByCategory[category][displayName] = 
                    (foodItemsByCategory[category][displayName] || 0) + 1;
            } catch (e) {
                console.error('Error processing meal:', e);
            }
        });
    });
    
    return foodItemsByCategory;
}

function renderCategorizedShoppingList(foodItemsByCategory) {
    const shoppingListDiv = document.getElementById('shoppingList');
    if (!shoppingListDiv) return;
    
    let hasItems = false;
    let html = '';
    
    // Get translated category names
    const getCategoryName = (category) => {
        if (!window.i18n) return categoryInfo[category].name;
        const t = window.i18n.t;
        const categoryMap = {
            protein: t('categoryProteins'),
            veggie: t('categoryVegetables'),
            fruit: t('categoryFruits'),
            grain: t('categoryGrains'),
            dairy: t('categoryDairy'),
            snack: t('categorySnacks')
        };
        return categoryMap[category] || categoryInfo[category].name;
    };
    
    // Render each category
    Object.keys(categoryInfo).forEach(category => {
        const foodItems = foodItemsByCategory[category];
        if (!foodItems || Object.keys(foodItems).length === 0) return;
        
        hasItems = true;
        const info = categoryInfo[category];
        const categoryName = getCategoryName(category);
        
        html += `
            <div class="mb-6">
                <h3 class="text-lg font-bold text-gray-800 flex items-center gap-2 mb-3">
                    <span class="text-2xl">${info.icon}</span>
                    <span>${categoryName}</span>
                </h3>
                <div class="space-y-2 pl-6">
        `;
        
        Object.entries(foodItems).forEach(([foodName, count]) => {
            html += `
                <div class="flex items-center gap-3 bg-white rounded-lg p-3 border-2 ${info.borderColor}">
                    <input type="checkbox" class="w-5 h-5 text-${info.color}-600 rounded">
                    <span class="flex-1 text-gray-700">${foodName}</span>
                    <span class="text-${info.color}-600 font-semibold">× ${count}</span>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
    });
    
    if (!hasItems) {
        const emptyMsg = window.i18n ? window.i18n.t('shoppingListEmpty') : 'Add meals to your plan to generate a shopping list!';
        html = `<p class="text-gray-600">${emptyMsg}</p>`;
    }
    
    shoppingListDiv.innerHTML = html;
}

// ==========================================
// Drag and Drop Handlers
// ==========================================

let draggedElement = null;

function handleDragStart(e) {
    draggedElement = e.target.closest('.food-item');
    if (draggedElement) {
        draggedElement.style.opacity = '0.5';
        e.dataTransfer.effectAllowed = 'copy';
        
        if (window.Sounds) {
            window.Sounds.playClick();
        }
    }
}

function handleDragEnd(e) {
    if (draggedElement) {
        draggedElement.style.opacity = '1';
        draggedElement = null;
    }
}

function getDraggedElement() {
    return draggedElement;
}

// Export functions
if (typeof window !== 'undefined') {
    window.CategorizedView = {
        renderCategorizedFoodPalette,
        groupFoodsByCategory,
        createFoodCardHTML,
        attachDragEvents,
        generateCategorizedShoppingList,
        renderCategorizedShoppingList,
        handleDragStart,
        handleDragEnd,
        getDraggedElement,
        categoryInfo
    };
}
