// ==========================================
// Guidance System Module
// ==========================================

let guidanceEnabled = true;
let lastSuggestionTime = 0;
const suggestionCooldown = 10000; // 10 seconds

// ==========================================
// Smart Suggestions
// ==========================================

function provideSuggestion(weeklyMeals) {
    if (!guidanceEnabled) return;
    
    const now = Date.now();
    if (now - lastSuggestionTime < suggestionCooldown) return;
    
    const categories = getCategoryCounts(weeklyMeals);
    const totalMeals = Object.values(categories).reduce((a, b) => a + b, 0);
    
    if (totalMeals === 0) {
        showGuidanceMessage("Let's start planning! Try adding your favorite food 🌟");
        lastSuggestionTime = now;
        return;
    }
    
    // Suggest based on what's missing
    let suggestion = null;
    
    if (categories.veggie < 2) {
        suggestion = {
            message: "How about adding some veggies? They make you strong! 🥦💪",
            category: "veggie"
        };
    } else if (categories.protein < 2) {
        suggestion = {
            message: "Don't forget protein! It helps you grow! 🍗🌟",
            category: "protein"
        };
    } else if (categories.fruit < 2) {
        suggestion = {
            message: "Fruits are yummy and healthy! Try one! 🍎🍌",
            category: "fruit"
        };
    } else if (categories.grain < 2) {
        suggestion = {
            message: "Grains give you energy to play! 🍞⚡",
            category: "grain"
        };
    } else if (categories.dairy < 1) {
        suggestion = {
            message: "Dairy helps build strong bones! 🧀🦴",
            category: "dairy"
        };
    }
    
    if (suggestion) {
        showGuidanceMessage(suggestion.message, suggestion.category);
        lastSuggestionTime = now;
    }
}

function showGuidanceMessage(message, highlightCategory = null) {
    const guidanceBox = document.getElementById('guidanceBox');
    if (!guidanceBox) return;
    
    guidanceBox.textContent = message;
    guidanceBox.classList.remove('hidden');
    guidanceBox.classList.add('pulse');
    
    // Highlight suggested category
    if (highlightCategory) {
        highlightCategorySection(highlightCategory);
    }
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        guidanceBox.classList.add('hidden');
        guidanceBox.classList.remove('pulse');
    }, 5000);
}

function highlightCategorySection(category) {
    // Remove existing highlights
    document.querySelectorAll('.category-section').forEach(section => {
        section.classList.remove('ring-4', 'ring-yellow-400', 'ring-offset-2');
    });
    
    // Highlight target category
    const categorySection = document.querySelector(`[data-category="${category}"]`);
    if (categorySection) {
        categorySection.classList.add('ring-4', 'ring-yellow-400', 'ring-offset-2');
        categorySection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        setTimeout(() => {
            categorySection.classList.remove('ring-4', 'ring-yellow-400', 'ring-offset-2');
        }, 3000);
    }
}

// ==========================================
// Positive Reinforcement
// ==========================================

function celebrateHealthyChoice(food) {
    const healthyCategories = ['veggie', 'fruit', 'protein'];
    
    if (healthyCategories.includes(food.category)) {
        const messages = [
            "Great choice! 🌟",
            "Awesome! You're so healthy! 💪",
            "Yes! That's perfect! ⭐",
            "Love it! Keep going! 🎉",
            "Super healthy! 🦸‍♀️",
            "You're doing amazing! 🎊",
            "Fantastic pick! 🌈",
            "Way to go! 👏"
        ];
        
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        showGuidanceMessage(randomMessage);
        
        if (window.Sounds) {
            window.Sounds.playSuccess();
        }
        
        if (window.animateAvatar) {
            animateAvatar('happy');
        }
    }
}

function celebrateBalancedWeek(score) {
    if (score === 100) {
        const messages = [
            "🎉 Perfect week! You're a meal planning superstar! 🌟",
            "💯 Amazing! 100% balanced! You rock! 🎸",
            "🏆 Perfect score! You're the champion! 👑",
            "✨ Incredible! Perfect balance! You're awesome! 💪"
        ];
        
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        showGuidanceMessage(randomMessage);
        
        if (window.Sounds) {
            window.Sounds.playCelebration();
        }
    } else if (score >= 80) {
        showGuidanceMessage("🌟 Great job! Your week is looking really healthy! 💚");
    }
}

// ==========================================
// Helper Functions
// ==========================================

function getCategoryCounts(weeklyMeals) {
    const categories = {
        protein: 0,
        veggie: 0,
        fruit: 0,
        grain: 0,
        dairy: 0
    };
    
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    days.forEach(day => {
        if (weeklyMeals[day]) {
            weeklyMeals[day].forEach(meal => {
                if (categories.hasOwnProperty(meal.category)) {
                    categories[meal.category]++;
                }
            });
        }
    });
    
    return categories;
}

function toggleGuidance() {
    guidanceEnabled = !guidanceEnabled;
    const status = guidanceEnabled ? 'On' : 'Off';
    
    if (window.showMessage) {
        showMessage(`💡 Guidance ${status}`, 'info');
    }
    
    // Hide guidance box if disabled, show demo message if enabled
    const guidanceBox = document.getElementById('guidanceBox');
    if (!guidanceEnabled) {
        if (guidanceBox) {
            guidanceBox.classList.add('hidden');
        }
    } else {
        // Show a demo message when enabling guidance
        if (guidanceBox) {
            showGuidanceMessage("✨ Guidance is ON! I'll help you make healthy choices!");
        }
    }
    
    updateGuidanceButton();
    return guidanceEnabled;
}

function setGuidanceEnabled(enabled) {
    guidanceEnabled = enabled;
    updateGuidanceButton();
}

function isGuidanceEnabled() {
    return guidanceEnabled;
}

function updateGuidanceButton() {
    const guidanceBtn = document.getElementById('guidanceToggle');
    if (guidanceBtn) {
        guidanceBtn.textContent = guidanceEnabled ? '💡' : '💡';
        guidanceBtn.style.opacity = guidanceEnabled ? '1' : '0.5';
        guidanceBtn.title = guidanceEnabled ? 'Guidance On - Get smart suggestions!' : 'Guidance Off';
        
        // Visual indication
        if (guidanceEnabled) {
            guidanceBtn.classList.add('bg-yellow-100', 'border-yellow-400');
            guidanceBtn.classList.remove('bg-gray-100', 'border-gray-300');
        } else {
            guidanceBtn.classList.add('bg-gray-100', 'border-gray-300');
            guidanceBtn.classList.remove('bg-yellow-100', 'border-yellow-400');
        }
    }
}

// Export functions
if (typeof window !== 'undefined') {
    window.Guidance = {
        provideSuggestion,
        showGuidanceMessage,
        highlightCategorySection,
        celebrateHealthyChoice,
        celebrateBalancedWeek,
        getCategoryCounts,
        toggleGuidance,
        setGuidanceEnabled,
        isGuidanceEnabled,
        updateGuidanceButton
    };
}
