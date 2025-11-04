// ==========================================
// Internationalization (i18n) Module
// ==========================================

let currentLanguage = 'he'; // Default to Hebrew

const translations = {
    he: {
        // App Title
        appTitle: 'תכנון תפריט ילדים',
        appSubtitle: 'תכנן את השבוע הטעים שלך!',
        
        // Navigation Tabs
        tabMealPlanner: '📅 תכנון ארוחות',
        tabParentView: '👨‍👩‍👧 תצוגת הורים',
        
        // Control Buttons
        btnUndo: '↩️ בטל',
        btnSoundToggle: '🔊',
        btnMusicToggle: '🎵',
        btnGuidanceToggle: '💡',
        btnProfile: '👤 פרופיל',
        
        // Food Palette
        foodPaletteTitle: '🎨 לוח מזון - גרור לתכנון!',
        
        // Category Names
        categoryProteins: 'חלבונים',
        categoryVegetables: 'ירקות',
        categoryFruits: 'פירות',
        categoryGrains: 'דגנים',
        categoryDairy: 'חלבי',
        categorySnacks: 'חטיפים',
        
        // Weekly Plan
        weeklyPlanTitle: '📅 התכנית השבועית שלך',
        btnSave: '💾 שמור',
        btnLoad: '📂 טען',
        btnClear: '🗑️ נקה',
        
        // Days of the week
        monday: 'יום שני',
        tuesday: 'יום שלישי',
        wednesday: 'יום רביעי',
        thursday: 'יום חמישי',
        friday: 'יום שישי',
        
        // Health Meter
        healthMeterTitle: '💚 מד בריאות',
        healthMeterExcellent: 'מצוין!',
        healthMeterGood: 'טוב!',
        healthMeterNeedsWork: 'צריך עבודה',
        
        // Avatar
        avatarTitle: '🦸 הדמות שלך',
        
        // Parent View
        parentDashboard: '👨‍👩‍👧 לוח בקרת הורים',
        btnParentSettings: '⚙️ הגדרות הורים',
        weeklySummaryTitle: '📊 סיכום שבועי',
        shoppingListTitle: '🛒 רשימת קניות',
        btnGenerateList: '✨ צור רשימה',
        btnPrint: '🖨️ הדפס',
        nutritionalInsightsTitle: '💡 תובנות תזונתיות',
        
        // Parent Settings Modal
        parentSettingsTitle: '⚙️ הגדרות הורים',
        btnClose: '✖️ סגור',
        btnSaveSettings: '💾 שמור הגדרות',
        
        // Rules Tab
        rulesTabTitle: '📋 כללים',
        ruleNoDuplicates: 'ללא מזון כפול ביום',
        ruleMaxItems: 'מספר פריטים מקסימלי ביום',
        ruleMaxSweets: 'מספר ממתקים מקסימלי בשבוע',
        
        // Custom Foods Tab
        customFoodsTabTitle: '🍎 מזון מותאם',
        btnAddCustomFood: '➕ הוסף מזון מותאם',
        noCustomFoods: 'אין מזון מותאם עדיין.',
        
        // Food Limits Tab
        foodLimitsTabTitle: '📊 הגבלות מזון',
        maxPerWeek: 'מקסימום בשבוע',
        maxWeekly: 'מקסימום {limit}/שבוע',
        unlimited: 'ללא הגבלה',
        
        // Profile Modal
        profileTitle: '👤 הפרופיל שלי',
        profileName: 'שם:',
        profileAge: 'גיל:',
        profileAvatar: 'דמות:',
        btnSaveProfile: '💾 שמור פרופיל',
        
        // Composite Builder Modal
        compositeBuilderTitle: '🏗️ בונה ארוחות',
        selectOptionsPrompt: 'בחר אפשרויות לכל שלב...',
        btnAddToDay: 'הוסף ל',
        
        // Custom Food Form
        addCustomFoodTitle: '➕ הוסף מזון מותאם',
        foodName: 'שם המזון:',
        foodCategory: 'קטגוריה:',
        foodIcon: 'אייקון (אימוג\'י):',
        foodWeeklyLimit: 'הגבלה שבועית:',
        foodIsSweet: 'ממתק?',
        btnSaveFood: '💾 שמור מזון',
        btnCancel: 'ביטול',
        
        // Messages
        msgSaved: '💾 נשמר!',
        msgLoaded: '📂 נטען!',
        msgCleared: '🗑️ נוקה!',
        msgProfileSaved: '✅ הפרופיל נשמר!',
        msgSettingsSaved: '💾 ההגדרות נשמרו!',
        msgRuleUpdated: '✅ הכלל עודכן!',
        msgFoodAdded: '✅ המזון נוסף!',
        msgFoodDeleted: '🗑️ המזון נמחק!',
        msgError: '❌ שגיאה',
        msgWarning: '⚠️ אזהרה',
        
        // Validation Messages
        validationDuplicate: 'כבר יש לך את זה היום! 🤔',
        validationMaxItems: 'מקסימום {limit} פריטים ביום! זה מספיק 😊',
        validationMaxSweets: 'מקסימום {limit} ממתקים בשבוע! שמור מקום למזון בריא 🌟',
        validationWeeklyLimit: 'מקסימום {limit} {food} בשבוע! נסה משהו אחר 🎨',
        
        // Guidance Messages
        guidanceStart: 'בוא נתחיל לתכנן! נסה להוסיף את המזון האהוב עליך 🌟',
        guidanceAddVeggies: 'מה עם להוסיף ירקות? הם עושים אותך חזק! 🥦💪',
        guidanceAddProtein: 'אל תשכח חלבון! זה עוזר לך לגדול! 🍗🌟',
        guidanceAddFruit: 'פירות טעימים ובריאים! נסה אחד! 🍎🍌',
        guidanceAddGrains: 'דגנים נותנים לך אנרגיה לשחק! 🍞⚡',
        guidanceAddDairy: 'חלבי עוזר לבנות עצמות חזקות! 🧀🦴',
        guidanceHealthyChoice: 'בחירה מעולה! 🌟',
        guidanceBalancedWeek: '🎉 שבוע מושלם! אתה כוכב תכנון ארוחות! 🌟',
        guidanceOn: '✨ ההדרכה מופעלת! אני אעזור לך לעשות בחירות בריאות!',
        
        // Sound Messages
        soundsOn: '🔊 צלילים מופעלים (הוסף קבצי צליל לתיקיית sounds/)',
        soundsOff: '🔇 צלילים כבויים',
        musicOn: '🎵 מוזיקה מופעלת (הוסף קבצי צליל לתיקיית sounds/)',
        musicOff: '🎵 מוזיקה כבויה',
        guidanceOnMsg: '💡 הדרכה מופעלת',
        guidanceOffMsg: '💡 הדרכה כבויה',
        
        // Password
        passwordPrompt: '🔒 נדרשת סיסמת הורים:\n\nהכנס סיסמה לגישה לתצוגת הורים:',
        passwordIncorrect: '❌ סיסמה שגויה!',
        
        // Tooltips
        tooltipUndo: 'בטל פעולה (Ctrl+Z)',
        tooltipSounds: 'הפעל/כבה צלילים',
        tooltipMusic: 'הפעל/כבה מוזיקת רקע',
        tooltipGuidance: 'הפעל/כבה הדרכה חכמה',
        
        // Shopping List
        shoppingListEmpty: 'צור רשימת קניות מתכנית הארוחות שלך!',
        shoppingListGenerated: '✅ רשימת קניות נוצרה!',
        weeklySummaryEmpty: 'תכנן ארוחות לשבוע כדי לראות את הסיכום כאן!',
        
        // Nutritional Insights
        insightsBalanced: 'תכנית מאוזנת מצוינת!',
        insightsNeedMoreVeggies: 'הוסף עוד ירקות לשבוע',
        insightsNeedMoreProtein: 'הוסף עוד חלבון',
        insightsNeedMoreFruit: 'הוסף עוד פירות',
        insightsNeedMoreGrains: 'הוסף עוד דגנים',
        insightsNeedMoreDairy: 'הוסף עוד חלבי',
        insightsEmpty: 'השלם את תכנית הארוחות כדי לראות תובנות',
        
        // Language Switcher
        languageLabel: 'שפה:',
        languageHebrew: '🇮🇱 עברית',
        languageEnglish: '🇺🇸 English',
    },
    
    en: {
        // App Title
        appTitle: 'Kids\' Meal Planner',
        appSubtitle: 'Plan Your Yummy Week!',
        
        // Navigation Tabs
        tabMealPlanner: '📅 Meal Planner',
        tabParentView: '👨‍👩‍👧 Parent View',
        
        // Control Buttons
        btnUndo: '↩️ Undo',
        btnSoundToggle: '🔊',
        btnMusicToggle: '🎵',
        btnGuidanceToggle: '💡',
        btnProfile: '👤 Profile',
        
        // Food Palette
        foodPaletteTitle: '🎨 Food Palette - Drag to Plan!',
        
        // Category Names
        categoryProteins: 'Proteins',
        categoryVegetables: 'Vegetables',
        categoryFruits: 'Fruits',
        categoryGrains: 'Grains',
        categoryDairy: 'Dairy',
        categorySnacks: 'Snacks',
        
        // Weekly Plan
        weeklyPlanTitle: '📅 Your Weekly Plan',
        btnSave: '💾 Save',
        btnLoad: '📂 Load',
        btnClear: '🗑️ Clear',
        
        // Days of the week
        monday: 'Monday',
        tuesday: 'Tuesday',
        wednesday: 'Wednesday',
        thursday: 'Thursday',
        friday: 'Friday',
        
        // Health Meter
        healthMeterTitle: '💚 Health Meter',
        healthMeterExcellent: 'Excellent!',
        healthMeterGood: 'Good!',
        healthMeterNeedsWork: 'Needs Work',
        
        // Avatar
        avatarTitle: '🦸 Your Character',
        
        // Parent View
        parentDashboard: '👨‍👩‍👧 Parent Dashboard',
        btnParentSettings: '⚙️ Parent Settings',
        weeklySummaryTitle: '📊 Weekly Summary',
        shoppingListTitle: '🛒 Shopping List',
        btnGenerateList: '✨ Generate List',
        btnPrint: '🖨️ Print',
        nutritionalInsightsTitle: '💡 Nutritional Insights',
        
        // Parent Settings Modal
        parentSettingsTitle: '⚙️ Parent Settings',
        btnClose: '✖️ Close',
        btnSaveSettings: '💾 Save Settings',
        
        // Rules Tab
        rulesTabTitle: '📋 Rules',
        ruleNoDuplicates: 'No duplicate foods per day',
        ruleMaxItems: 'Maximum items per day',
        ruleMaxSweets: 'Maximum treats per week',
        
        // Custom Foods Tab
        customFoodsTabTitle: '🍎 Custom Foods',
        btnAddCustomFood: '➕ Add Custom Food',
        noCustomFoods: 'No custom foods added yet.',
        
        // Food Limits Tab
        foodLimitsTabTitle: '📊 Food Limits',
        maxPerWeek: 'Max per week',
        maxWeekly: 'Max {limit}/week',
        unlimited: 'Unlimited',
        
        // Profile Modal
        profileTitle: '👤 My Profile',
        profileName: 'Name:',
        profileAge: 'Age:',
        profileAvatar: 'Avatar:',
        btnSaveProfile: '💾 Save Profile',
        
        // Composite Builder Modal
        compositeBuilderTitle: '🏗️ Meal Builder',
        selectOptionsPrompt: 'Select options for each step...',
        btnAddToDay: 'Add to',
        
        // Custom Food Form
        addCustomFoodTitle: '➕ Add Custom Food',
        foodName: 'Food Name:',
        foodCategory: 'Category:',
        foodIcon: 'Icon (Emoji):',
        foodWeeklyLimit: 'Weekly Limit:',
        foodIsSweet: 'Is Sweet?',
        btnSaveFood: '💾 Save Food',
        btnCancel: 'Cancel',
        
        // Messages
        msgSaved: '💾 Saved!',
        msgLoaded: '📂 Loaded!',
        msgCleared: '🗑️ Cleared!',
        msgProfileSaved: '✅ Profile saved!',
        msgSettingsSaved: '💾 Settings saved!',
        msgRuleUpdated: '✅ Rule updated!',
        msgFoodAdded: '✅ Food added!',
        msgFoodDeleted: '🗑️ Food deleted!',
        msgError: '❌ Error',
        msgWarning: '⚠️ Warning',
        
        // Validation Messages
        validationDuplicate: 'You already have that today! 🤔',
        validationMaxItems: 'Maximum {limit} items per day! That\'s enough 😊',
        validationMaxSweets: 'Maximum {limit} treats per week! Save room for healthy foods 🌟',
        validationWeeklyLimit: 'Maximum {limit} {food} per week! Try something different 🎨',
        
        // Guidance Messages
        guidanceStart: 'Let\'s start planning! Try adding your favorite food 🌟',
        guidanceAddVeggies: 'How about adding some veggies? They make you strong! 🥦💪',
        guidanceAddProtein: 'Don\'t forget protein! It helps you grow! 🍗🌟',
        guidanceAddFruit: 'Fruits are yummy and healthy! Try one! 🍎🍌',
        guidanceAddGrains: 'Grains give you energy to play! 🍞⚡',
        guidanceAddDairy: 'Dairy helps build strong bones! 🧀🦴',
        guidanceHealthyChoice: 'Great choice! 🌟',
        guidanceBalancedWeek: '🎉 Perfect week! You\'re a meal planning superstar! 🌟',
        guidanceOn: '✨ Guidance is ON! I\'ll help you make healthy choices!',
        
        // Sound Messages
        soundsOn: '🔊 Sounds On (add sound files to sounds/ folder)',
        soundsOff: '🔇 Sounds Off',
        musicOn: '🎵 Music On (add sound files to sounds/ folder)',
        musicOff: '🎵 Music Off',
        guidanceOnMsg: '💡 Guidance On',
        guidanceOffMsg: '💡 Guidance Off',
        
        // Password
        passwordPrompt: '🔒 Parent Password Required:\n\nEnter the password to access Parent View:',
        passwordIncorrect: '❌ Incorrect password!',
        
        // Tooltips
        tooltipUndo: 'Undo (Ctrl+Z)',
        tooltipSounds: 'Toggle Sounds',
        tooltipMusic: 'Toggle Background Music',
        tooltipGuidance: 'Toggle Smart Guidance',
        
        // Shopping List
        shoppingListEmpty: 'Generate shopping list from your meal plan!',
        shoppingListGenerated: '✅ Shopping list generated!',
        weeklySummaryEmpty: 'Plan meals for the week to see the summary here!',
        
        // Nutritional Insights
        insightsBalanced: 'Great balanced plan!',
        insightsNeedMoreVeggies: 'Add more vegetables to the week',
        insightsNeedMoreProtein: 'Add more protein',
        insightsNeedMoreFruit: 'Add more fruits',
        insightsNeedMoreGrains: 'Add more grains',
        insightsNeedMoreDairy: 'Add more dairy',
        insightsEmpty: 'Complete the meal plan to see insights',
        
        // Language Switcher
        languageLabel: 'Language:',
        languageHebrew: '🇮🇱 עברית',
        languageEnglish: '🇺🇸 English',
    }
};

// ==========================================
// Translation Functions
// ==========================================

function t(key, params = {}) {
    let text = translations[currentLanguage][key] || translations['en'][key] || key;
    
    // Replace parameters like {limit}, {food}, etc.
    Object.keys(params).forEach(param => {
        text = text.replace(`{${param}}`, params[param]);
    });
    
    return text;
}

function setLanguage(lang) {
    if (!translations[lang]) {
        console.error(`Language ${lang} not supported`);
        return;
    }
    
    currentLanguage = lang;
    
    // Update HTML direction
    document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    
    // Save to localStorage
    localStorage.setItem('preferredLanguage', lang);
    
    // Update all UI text
    updateAllUIText();
    
    console.log(`✅ Language changed to: ${lang}`);
}

function getCurrentLanguage() {
    return currentLanguage;
}

function initLanguage() {
    // Check localStorage for saved preference
    const saved = localStorage.getItem('preferredLanguage');
    if (saved && translations[saved]) {
        currentLanguage = saved;
    }
    
    // Set initial direction and lang
    document.documentElement.dir = currentLanguage === 'he' ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLanguage;
    
    console.log(`🌍 Language initialized: ${currentLanguage}`);
}

function updateAllUIText() {
    // This function will be called to update all visible text
    // It will be implemented in the main app to re-render text elements
    if (window.updateLanguageUI) {
        window.updateLanguageUI();
    }
}

// Export functions
if (typeof window !== 'undefined') {
    window.i18n = {
        t,
        setLanguage,
        getCurrentLanguage,
        initLanguage,
        updateAllUIText
    };
}
