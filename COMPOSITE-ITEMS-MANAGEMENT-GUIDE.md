# 🏗️ Composite Items Management - User Guide

## Date: November 4, 2025

## Overview

You can now easily manage the options available in composite food builders (Sandwich Builder, Pasta Builder, Salad Builder) directly from the Parent Settings interface! No need to edit the backend database.

---

## What Are Composite Items?

Composite items are multi-step food builders that let kids create custom meals:

1. **🥪 Sandwich Builder**
   - Step 1: Choose Bread (White bread, Whole wheat, Bagel, etc.)
   - Step 2: Choose Filling (Turkey, Cheese, Peanut butter, etc.)
   - Step 3: Choose Veggies (Lettuce, Tomato, Cucumber, etc.)

2. **🍝 Pasta Builder**
   - Step 1: Choose Pasta (Spaghetti, Penne, Macaroni, etc.)
   - Step 2: Choose Sauce (Marinara, Alfredo, Butter & garlic, etc.)
   - Step 3: Choose Toppings (Parmesan, Meatballs, Veggies, etc.)

3. **🥗 Salad Builder**
   - Step 1: Choose Base (Lettuce, Spinach, Mixed greens, etc.)
   - Step 2: Choose Protein (Chicken, Tuna, Eggs, Chickpeas, etc.)
   - Step 3: Choose Dressing (Ranch, Italian, Balsamic, etc.)

---

## How to Access Composite Management

### Step 1: Open Parent Settings
1. Click "⚙️ Parent Settings" button in the meal planner
2. Enter parent password if prompted (`1580`)

### Step 2: Find Composite Section
1. Scroll down to "🏗️ Composite Food Builders" section
2. You'll see all available composite builders listed

### Step 3: Edit a Builder
1. Click "✏️ Edit Options" button on any builder
2. A modal will open showing all steps and their options

---

## Managing Options

### View Current Options

Each composite builder shows:
- **Builder name and icon** (e.g., 🥪 Sandwich Builder)
- **Number of steps** (e.g., 3 steps)
- **Step badges** showing what each step is for

Example:
```
🥪 Sandwich Builder
3 steps
[1. Bread] [2. Filling] [3. Veggies]
```

---

### Add New Options

#### For Each Step:
1. Find the step you want to edit (e.g., "Step 1: Bread")
2. See current options listed with icons
3. At the bottom of each step:
   - Enter **option name** (e.g., "Sourdough bread")
   - Enter **icon** (emoji, e.g., 🍞)
   - Click "➕ Add" button

#### Example: Adding a New Bread Type
```
Step 1: Bread
Current options:
  🍞 White bread
  🍞 Whole wheat
  🥯 Bagel

Add new:
[Option name: Sourdough bread] [Icon: 🥖] [➕ Add]
```

---

### Remove Options

#### To Remove an Option:
1. Find the option in the list
2. Click the red "✕" button next to it
3. Option is removed immediately

#### Example: Removing Peanut Butter
```
Step 2: Filling
  🦃 Turkey [✕]
  🧀 Cheese [✕]
  🥜 Peanut butter [✕] ← Click here to remove
```

---

### Save Changes

1. After adding/removing options, click "💾 Save Changes"
2. Changes are saved to database
3. Modal closes automatically
4. Composite builders now use your updated options

**Important**: Changes take effect immediately for all users!

---

## Example Workflows

### Example 1: Add Hummus Spread to Sandwich Builder

1. Open Parent Settings
2. Find "🥪 Sandwich Builder"
3. Click "✏️ Edit Options"
4. Find "Step 2: Filling"
5. Enter:
   - Name: `Hummus`
   - Icon: `🫘`
6. Click "➕ Add"
7. Click "💾 Save Changes"

✅ Result: Kids can now select Hummus as a sandwich filling!

---

### Example 2: Remove Peanut Butter (School Allergy Policy)

1. Open Parent Settings
2. Find "🥪 Sandwich Builder"
3. Click "✏️ Edit Options"
4. Find "Step 2: Filling"
5. Locate "🥜 Peanut butter"
6. Click red "✕" button
7. Click "💾 Save Changes"

✅ Result: Peanut butter no longer appears in sandwich builder!

---

### Example 3: Add New Pasta Sauce

1. Open Parent Settings
2. Find "🍝 Pasta Builder"
3. Click "✏️ Edit Options"
4. Find "Step 2: Sauce"
5. Enter:
   - Name: `Pesto sauce`
   - Icon: `🌿`
6. Click "➕ Add"
7. Click "💾 Save Changes"

✅ Result: Pesto is now available as a pasta sauce option!

---

### Example 4: Customize Salad Dressings

**Remove:**
1. Ranch dressing (too high calorie)
2. Caesar dressing

**Add:**
1. Lemon juice (healthy option)
2. Olive oil & vinegar

**Steps:**
1. Open "🥗 Salad Builder" → "✏️ Edit Options"
2. Go to "Step 3: Dressing"
3. Click "✕" next to Ranch and Caesar
4. Add "Lemon juice" with icon 🍋
5. Add "Olive oil & vinegar" with icon 🫒
6. Click "💾 Save Changes"

✅ Result: Healthier dressing options available!

---

## Features

### ✅ What You Can Do

1. **View All Builders**: See Sandwich, Pasta, and Salad builders
2. **See All Steps**: View each step and its purpose
3. **List Options**: See all current options with icons and names
4. **Add Options**: Add unlimited new options to any step
5. **Remove Options**: Delete options you don't want available
6. **Save to Database**: Changes persist across sessions
7. **Instant Updates**: Kids see changes immediately

### ✨ Benefits

1. **Control**: Full control over what kids can select
2. **Allergies**: Remove allergens (nuts, dairy, gluten, etc.)
3. **Preferences**: Add family favorites
4. **Healthy Choices**: Remove unhealthy options
5. **Cultural Foods**: Add culturally appropriate foods
6. **Seasonal**: Update based on what's in season
7. **Easy Management**: No technical knowledge needed

---

## Technical Details

### Data Structure

Each composite item stores:
```javascript
{
  id: "composite_001",
  name: "Sandwich Builder",
  icon: "🥪",
  category: "grain",
  steps: ["Bread", "Filling", "Veggies"],
  ingredients_map: {
    "Bread": [
      {name: "White bread", icon: "🍞"},
      {name: "Whole wheat", icon: "🍞"},
      {name: "Bagel", icon: "🥯"}
    ],
    "Filling": [...],
    "Veggies": [...]
  }
}
```

### Storage

- **Database Table**: `composite_items`
- **Method**: RESTful API (PUT request)
- **Persistence**: Changes saved permanently
- **Scope**: Global (affects all users)

### Files Modified

1. **index.html**:
   - Added "🏗️ Composite Food Builders" section
   - Added Edit Composite Modal

2. **js/app.js**:
   - Added `renderCompositeManagementList()`
   - Added `openEditComposite()`
   - Added `createCompositeStepEditor()`
   - Added `addCompositeOption()`
   - Added `removeCompositeOption()`
   - Added `saveCompositeChanges()`
   - Added `closeEditCompositeModal()`

---

## Validation Rules

### Option Name
- **Required**: Yes
- **Max length**: No limit
- **Examples**: "White bread", "Turkey slices", "Ranch dressing"

### Option Icon
- **Required**: Yes
- **Type**: Emoji
- **Max length**: 2 characters
- **Examples**: 🍞, 🦃, 🥗, 🧀

---

## Best Practices

### 1. Keep It Simple
- Don't add too many options (5-8 per step is ideal)
- Kids might get overwhelmed with too many choices

### 2. Use Clear Names
- "White bread" is better than just "White"
- "Turkey slices" is better than "Turkey"

### 3. Choose Good Icons
- Pick recognizable emojis
- Use consistent icon style
- Match icon to the food (🍞 for bread, 🧀 for cheese)

### 4. Think About Combinations
- Ensure options work well together
- Consider taste combinations
- Think about nutritional balance

### 5. Update Seasonally
- Add summer fruits in summer
- Add winter foods in winter
- Remove out-of-season items

### 6. Consider Allergies
- Remove allergens immediately
- Check school policies
- Mark allergen-free alternatives

---

## Troubleshooting

### Issue: Can't Add Option
**Solution**: 
- Check that both name and icon fields are filled
- Icon should be 1-2 characters (emoji)
- Try again after filling both fields

### Issue: Changes Not Saving
**Solution**:
- Check internet connection
- Click "💾 Save Changes" button
- Check browser console for errors
- Try refreshing page and editing again

### Issue: Option Still Appears After Deletion
**Solution**:
- Click "💾 Save Changes" after removing
- Refresh the page
- Check if it was re-added by accident

### Issue: Kids See Old Options
**Solution**:
- Refresh kids' browser window
- Clear browser cache
- Changes are instant but may need page reload

---

## FAQ

**Q: Can I add a new composite builder (e.g., Smoothie Builder)?**
A: Not yet - currently only Sandwich, Pasta, and Salad are supported. This could be added in future updates.

**Q: Can I rename the steps (e.g., change "Filling" to "Protein")?**
A: Not currently - step names are fixed. Only options within steps can be changed.

**Q: Do changes affect past meal plans?**
A: No - only new meals use updated options. Past plans remain unchanged.

**Q: Can I restore default options?**
A: Not automatically. You'd need to manually re-add default options or re-import from backup.

**Q: Can kids create composite meals without the builder?**
A: No - composite items require the builder interface.

---

## Examples: Popular Customizations

### Gluten-Free Sandwich
**Remove**: All regular breads
**Add**: 
- 🌾 Gluten-free bread
- 🥬 Lettuce wraps
- 🌯 Corn tortilla

### Vegetarian Pasta
**Remove**: Meat toppings
**Add**:
- 🍄 Mushrooms
- 🧀 Extra cheese
- 🥦 Broccoli

### Vegan Salad
**Remove**: Chicken, Tuna, Ranch dressing
**Add**:
- 🫘 Chickpeas
- 🥑 Avocado slices
- 🍋 Lemon juice dressing

### Nut-Free Options
**Remove**: All nut-based items
**Add**:
- 🌻 Sunflower seed butter
- 🫘 Hummus
- 🥜 Soy butter (nut-free)

---

## Summary

With Composite Items Management, you have **full control** over what options appear in the Sandwich, Pasta, and Salad builders. You can:

✅ Add new options easily
✅ Remove unwanted options
✅ Customize for allergies, preferences, and diets
✅ Update anytime without technical knowledge
✅ See changes take effect immediately

**Location**: Parent Settings → 🏗️ Composite Food Builders

**Access**: Click "✏️ Edit Options" on any builder

**Save**: Click "💾 Save Changes" when done

---

**Implementation Date**: November 4, 2025  
**Status**: ✅ Complete and functional  
**Ready for**: Production use

*Making meal planning flexible and family-friendly!* 🏗️✨
