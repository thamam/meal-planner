// ==========================================
// Rule Engine Module
// ==========================================

let userRules = {
    noDuplicatesPerDay: true,
    maxItemsPerDay: 5,
    maxSweetsPerWeek: 2,
    requireProteinDaily: false,
    requireVeggieDaily: false
};

// ==========================================
// Rule Loading
// ==========================================

async function loadUserRules(currentUser) {
    if (!currentUser) return userRules;
    
    try {
        const response = await fetch(`tables/rules?search=${currentUser.id}`);
        const data = await response.json();
        
        // Start with defaults
        const rules = { ...userRules };
        
        // Override with user's custom rules
        if (data.data) {
            data.data.forEach(rule => {
                if (rule.user_id === currentUser.id && rule.enabled) {
                    try {
                        rules[rule.rule_name] = JSON.parse(rule.rule_value);
                    } catch (e) {
                        rules[rule.rule_name] = rule.rule_value;
                    }
                }
            });
        }
        
        userRules = rules;
        console.log('✅ Loaded user rules:', userRules);
        return rules;
    } catch (error) {
        console.log('Using default rules');
        return userRules;
    }
}

async function saveUserRule(currentUser, ruleName, ruleValue, enabled = true) {
    if (!currentUser) return;
    
    try {
        await fetch('tables/rules', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                user_id: currentUser.id,
                rule_name: ruleName,
                rule_value: JSON.stringify(ruleValue),
                enabled: enabled
            })
        });
        
        userRules[ruleName] = ruleValue;
        console.log(`✅ Saved rule: ${ruleName} = ${ruleValue}`);
    } catch (error) {
        console.error('Error saving rule:', error);
    }
}

// ==========================================
// Rule Validation
// ==========================================

function validateMealDrop(food, day, weeklyMeals) {
    const dayMeals = weeklyMeals[day];
    
    // Rule 1: No duplicates per day
    if (userRules.noDuplicatesPerDay) {
        const hasDuplicate = dayMeals.some(meal => meal.id === food.id);
        if (hasDuplicate) {
            return {
                valid: false,
                message: `You already have ${food.name} today! 🤔`,
                icon: '⚠️'
            };
        }
    }
    
    // Rule 2: Max items per day
    if (userRules.maxItemsPerDay && dayMeals.length >= userRules.maxItemsPerDay) {
        return {
            valid: false,
            message: `Maximum ${userRules.maxItemsPerDay} items per day! That's enough 😊`,
            icon: '🛑'
        };
    }
    
    // Rule 3: Max sweets per week
    if (food.is_sweet && userRules.maxSweetsPerWeek) {
        const currentSweets = countWeeklySweets(weeklyMeals);
        if (currentSweets >= userRules.maxSweetsPerWeek) {
            return {
                valid: false,
                message: `Maximum ${userRules.maxSweetsPerWeek} treats per week! Save room for healthy foods 🌟`,
                icon: '🍭'
            };
        }
    }
    
    // Rule 4: Check weekly limits for specific items
    if (food.weekly_limit && food.weekly_limit > 0) {
        const currentCount = countFoodInWeek(food.id, weeklyMeals);
        if (currentCount >= food.weekly_limit) {
            return {
                valid: false,
                message: `Maximum ${food.weekly_limit} ${food.name} per week! Try something different 🎨`,
                icon: '📊'
            };
        }
    }
    
    return { valid: true };
}

// ==========================================
// Helper Functions
// ==========================================

function countWeeklySweets(weeklyMeals) {
    let count = 0;
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    days.forEach(day => {
        weeklyMeals[day].forEach(meal => {
            if (meal.is_sweet) count++;
        });
    });
    return count;
}

function countFoodInWeek(foodId, weeklyMeals) {
    let count = 0;
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    days.forEach(day => {
        weeklyMeals[day].forEach(meal => {
            if (meal.id === foodId) count++;
        });
    });
    return count;
}

function getRules() {
    return { ...userRules };
}

function updateRule(ruleName, value) {
    userRules[ruleName] = value;
}

// Export functions
if (typeof window !== 'undefined') {
    window.Rules = {
        loadUserRules,
        saveUserRule,
        validateMealDrop,
        countWeeklySweets,
        countFoodInWeek,
        getRules,
        updateRule
    };
}
