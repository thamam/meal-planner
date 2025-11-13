# 🌍 Bilingual Food Names Implementation Guide

## Overview

This guide documents the implementation of bilingual (Hebrew + English) food item names in the Kids' Meal Planner application. Food items now display in Hebrew when Hebrew language is selected, and in English when English is selected.

## Files Modified

### 1. **update-food-database-bilingual.html** (NEW FILE)
- Created new database import tool with bilingual support
- Parses 57 food items from `kids_breakfast_box_defaults_bilingual.csv`
- Each food item includes both `name` (English) and `name_he` (Hebrew) fields
- Includes all 6 categories: Proteins, Vegetables, Fruits, Grains, Dairy, Snacks

### 2. **js/modules/categorized-view.js**
- Updated `createFoodCardHTML()` function to:
  - Detect current language using `window.i18n.getCurrentLanguage()`
  - Display Hebrew name (`name_he`) when language is Hebrew
  - Display English name (`name`) when language is English
  - Add `data-food-name-he` attribute to food cards
  - Add CSS class `food-name-display` for easy updates
  - Translate "Max X/week" text using i18n

### 3. **js/modules/i18n.js**
- Added new translation key: `maxWeekly` for both languages
  - Hebrew: `'מקסימום {limit}/שבוע'`
  - English: `'Max {limit}/week'`

### 4. **js/app.js**
- Updated `updateWeeklyPlanDisplay()` to:
  - Display food names in current language in weekly plan
  - Add `data-food-name` and `data-food-name-he` attributes to meal items
  - Add CSS class `meal-name-display` for easy updates
  
- Updated `handleDrop()` to:
  - Capture Hebrew name (`name_he`) when food is dropped
  - Store both English and Hebrew names in meal object
  
- Added new `updateFoodItemNames()` function:
  - Updates all food item names in palette when language changes
  - Updates all food item names in weekly plan when language changes
  - Updates weekly limit text in current language
  
- Modified `updateLanguageUI()` to:
  - Call `updateFoodItemNames()` when language switches
  - Ensures all food names update immediately

## Database Schema

The `food_items` table now includes:

```javascript
{
    name: "Apple slices",        // English name (required)
    name_he: "פלחי תפוח",        // Hebrew name (optional)
    category: "fruit",
    icon: "🍎",
    weekly_limit: 0,
    is_sweet: false,
    nutrition_score: 5
}
```

## How It Works

### 1. **Data Import**
1. Open `update-food-database-bilingual.html` in browser
2. Click "Clear Old Data First" to remove existing items
3. Click "Update Database with Bilingual Data"
4. 57 food items imported with both English and Hebrew names

### 2. **Language Switching**
1. User clicks language switcher (🇮🇱 עברית / 🇺🇸 EN)
2. `switchLanguage()` calls `i18n.setLanguage(lang)`
3. `setLanguage()` calls `updateLanguageUI()`
4. `updateLanguageUI()` calls `updateFoodItemNames()`
5. All food names update instantly without page reload

### 3. **Food Display Logic**
```javascript
// In createFoodCardHTML()
const currentLang = window.i18n ? window.i18n.getCurrentLanguage() : 'en';
const displayName = (currentLang === 'he' && food.name_he) ? food.name_he : food.name;
```

### 4. **Meal Planning**
- When user drags food to weekly plan, both names are stored
- When language switches, weekly plan shows appropriate name
- Meal data persists with both languages in localStorage

## CSV File Structure

The bilingual CSV file (`kids_breakfast_box_defaults_bilingual.csv`) contains:

```csv
item,item_he,category,category_he,subcategory,subcategory_he,...
Sliced bread,לחם פרוס,Bases,בסיסים,Bread,לחם,...
Mini roll,לחמנייה מיני,Bases,בסיסים,Bread,לחם,...
```

**Key Columns:**
- `item`: English food name
- `item_he`: Hebrew food name
- `category`: English category
- `category_he`: Hebrew category
- Additional metadata: allergens, portions, packing notes, etc.

## Testing Steps

1. **Import Database**:
   - Open `update-food-database-bilingual.html`
   - Clear old data
   - Import bilingual data
   - Verify 57 items imported successfully

2. **Test Food Palette**:
   - Open `index.html`
   - Default language: Hebrew (עברית)
   - Verify food names display in Hebrew
   - Click 🇺🇸 EN button
   - Verify food names switch to English

3. **Test Weekly Plan**:
   - Add foods to weekly plan in Hebrew
   - Switch to English
   - Verify food names in plan switch to English
   - Switch back to Hebrew
   - Verify names switch back to Hebrew

4. **Test Persistence**:
   - Add foods to plan
   - Switch language
   - Save plan
   - Reload page
   - Verify language preference persists
   - Verify food names display in saved language

## Language Coverage

### Fully Translated (57 items):
✅ All 57 food items have Hebrew translations
✅ UI elements (buttons, labels, messages)
✅ Category names
✅ Day names
✅ Validation messages
✅ Guidance messages

### Partially Translated:
- Some composite food names (e.g., "Turkey + Lettuce")
- Some specific ingredients in English

## Future Enhancements

1. **Complete Translation Coverage**:
   - Translate remaining composite food names
   - Translate ingredient lists
   - Add Hebrew variants and pairings

2. **Additional Languages**:
   - Arabic support
   - Russian support
   - Extend i18n module

3. **RTL Improvements**:
   - Fine-tune RTL layout for Hebrew
   - Adjust icon positions for RTL
   - Improve dropdown menus in RTL

4. **CSV Import Tool**:
   - Add UI for uploading custom CSV files
   - Support bulk editing of translations
   - Export current database to CSV

## Technical Notes

### Key Functions:

1. **`createFoodCardHTML(food)`** (categorized-view.js)
   - Creates food card with bilingual support
   - Detects current language
   - Returns appropriate name

2. **`updateFoodItemNames()`** (app.js)
   - Updates all visible food names
   - Called when language changes
   - Updates both palette and weekly plan

3. **`updateWeeklyPlanDisplay()`** (app.js)
   - Renders weekly plan with current language
   - Uses Hebrew name if available and selected
   - Falls back to English name

### Data Flow:

```
CSV File → update-food-database-bilingual.html
    ↓
Database (food_items table with name_he field)
    ↓
App loads food items with both names
    ↓
createFoodCardHTML() displays appropriate name
    ↓
User switches language
    ↓
updateFoodItemNames() updates all displays
    ↓
Both palette and plan show new language
```

## Troubleshooting

### Food names not updating when switching language:
- Check browser console for errors
- Verify `window.i18n` is loaded
- Verify food items have `data-food-name-he` attribute
- Check if `updateFoodItemNames()` is being called

### Hebrew names not displaying:
- Verify database import completed successfully
- Check if `name_he` field exists in database records
- Verify current language is set to 'he'
- Clear browser cache and reload

### Mixed languages showing:
- Verify all food items have Hebrew translations
- Check if fallback to English is working for missing translations
- Ensure `updateLanguageUI()` completes without errors

## Conclusion

The bilingual food names implementation provides seamless language switching for Hebrew and English users. The system automatically detects the current language and displays appropriate food names in both the food palette and weekly meal plan, creating a fully localized experience for young users and parents.

---

**Implementation Date**: November 4, 2025  
**Status**: ✅ Complete and functional  
**Total Food Items**: 57 with bilingual support  
**Languages Supported**: Hebrew (עברית), English
