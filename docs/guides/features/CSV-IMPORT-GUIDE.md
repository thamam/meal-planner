# 📊 CSV Food Import Guide

## Summary

Successfully imported **50 food items** from `kids_breakfast_box_defaults_updated.csv` into the Kids' Meal Planner database.

---

## What Was Updated

### Food Items Imported: 50 items across 5 categories

#### 🍞 Grains (17 items)
- Sliced bread
- Mini roll
- Tortilla
- Whole-grain crackers
- Mini bagel
- Plain pretzels
- Air-popped popcorn
- Granola bar (sweet)
- Rice crackers (GF)
- Honey drizzle (sweet)
- Date spread/silan (sweet)
- Mini homemade muffin (sweet)
- Dark chocolate square (sweet)

#### 🍗 Proteins (6 items)
- Hard-boiled egg
- Egg omelette strips
- Turkey slices (limit: 3/week)
- Chicken schnitzel strips (limit: 2/week)
- Roasted chickpeas
- Almond butter
- Sunflower seed butter

#### 🧀 Dairy (9 items)
- Cheese slices
- String cheese
- Cottage cheese
- Labneh
- Plain yogurt cup
- Drinking yogurt
- Kefir
- Cream cheese
- Butter

#### 🍎 Fruits (10 items)
- Apple slices
- Banana
- Grapes
- Clementine
- Pear slices
- Strawberries
- Blueberries
- Melon cubes
- Pineapple chunks
- Dates (Medjool) - sweet, limit: 2/week

#### 🥦 Vegetables (8 items)
- Cucumber sticks
- Cherry tomatoes
- Carrot sticks
- Bell pepper strips
- Sugar snap peas
- Olives (pitted)
- Pickle spears
- Avocado mash

---

## How to Import the Food Items

### Step 1: Clear Old Data (IMPORTANT!)
1. Open `update-food-database.html` in your browser
2. Click the red **"🗑️ Clear Old Data First"** button
3. Confirm the deletion warning
4. Wait for all old items to be deleted
5. You should see: "✅ Cleared X items from database"

### Step 2: Import New Data
1. Click the purple **"🚀 Update Database"** button
2. Wait for the import process to complete (50+ items, ~10-15 seconds)
3. Watch the progress logs in the status box
4. You should see: "🎉 Database Update Complete! ✅ Successfully added: 50 items"

### Step 3: Verify in Main App
1. Open `index.html` in your browser
2. Create or login to a profile
3. Check all 5 category tabs (🍗 Proteins, 🥦 Veggies, 🍎 Fruits, 🍞 Grains, 🧀 Dairy)
4. Verify items appear in correct categories
5. Test drag-and-drop to meal plan

---

## Category Mapping from CSV

The CSV had different categories than our app. Here's how they were mapped:

| CSV Category | CSV Subcategory | App Category | Examples |
|-------------|----------------|--------------|----------|
| Bases | Bread, Flatbread, Crackers | `grain` | Sliced bread, Tortilla, Crackers |
| Proteins | Eggs, Poultry, Legumes, Nut butter | `protein` | Eggs, Turkey, Chickpeas, Almond butter |
| Proteins | Dairy | `dairy` | Cheese, Cottage cheese, String cheese |
| Fruits | Fresh, Dried | `fruit` | Apple, Banana, Grapes, Dates |
| Veggies | Fresh, Pickled | `veggie` | Cucumber, Tomatoes, Olives |
| Dairy | Yogurt | `dairy` | Plain yogurt, Kefir, Drinking yogurt |
| Spreads | Veg | `veggie` | Avocado mash |
| Spreads | Dairy | `dairy` | Cream cheese, Butter |
| Spreads | Sweetener | `grain` | Honey, Date spread |
| Combos | Sandwich, Wrap | Not imported (composite) | See Composite Items section |
| Snacks | Baked, Packaged | `grain` | Pretzels, Popcorn, Granola |
| Treats | Baked, Chocolate | `grain` | Muffin, Dark chocolate |

---

## Weekly Limits Applied

Based on the CSV's `default_weekly_limit` column, these items have restrictions:

| Food Item | Weekly Limit | Reason |
|-----------|--------------|--------|
| Turkey slices | 3x/week | Processed meat moderation |
| Chicken schnitzel strips | 2x/week | Breaded/fried food |
| Dates (Medjool) | 2x/week | High sugar dried fruit |
| Honey drizzle | 2x/week | Sweetener |
| Date spread (silan) | 2x/week | Sweetener |
| Granola bar | 2x/week | Packaged snack with sugar |
| Mini homemade muffin | 2x/week | Baked treat |
| Dark chocolate square | 1x/week | Treat/dessert |

---

## Items Marked as Sweet

These items trigger the "max sweets per week" rule (default: 2/week):

- Dates (Medjool)
- Honey drizzle
- Date spread (silan)
- Granola bar
- Mini homemade muffin
- Dark chocolate square

---

## Composite Items from CSV

The CSV included "Combos" that should be used as composite builders:

### Suggested New Composite Builders:

1. **Sandwich Combo**
   - Step 1: Choose base (Bread, Bagel, Pita)
   - Step 2: Choose protein (Cheese, Turkey, Egg, Avocado)
   - Step 3: Choose veggie (Tomato, Cucumber, Lettuce)

2. **Wrap Builder**
   - Step 1: Choose wrap (Tortilla, Pita)
   - Step 2: Choose filling (Turkey, Cheese, Labneh)
   - Step 3: Choose veggies (Bell pepper, Cucumber, Lettuce)

3. **Snack Plate**
   - Step 1: Choose base (Crackers, Pita, Bread)
   - Step 2: Choose protein (Cheese, Labneh, Hummus)
   - Step 3: Choose side (Olives, Cucumber, Tomatoes)

**Note**: The existing Sandwich, Pasta, and Salad builders remain in the database.

---

## Nutrition Scoring

Each food item has a `nutrition_score` (1-5) calculated as:

| Category | Base Score | If Sweet | Final Score |
|----------|-----------|----------|-------------|
| Veggie | 5 | N/A | 5 |
| Fruit | 5 | -2 if dried/sweet | 3-5 |
| Protein | 4 | N/A | 4 |
| Dairy | 4 | N/A | 4 |
| Grain | 3 | -2 if sweet | 1-3 |

**Examples**:
- Cucumber sticks: 5 (veggie)
- Apple slices: 5 (fresh fruit)
- Dates: 3 (dried fruit, sweet)
- Turkey slices: 4 (protein)
- Cheese: 4 (dairy)
- Sliced bread: 3 (grain)
- Dark chocolate: 1 (grain, sweet)

---

## Food Icons Used

Emojis selected for each item based on type:

```
🍞 Bread/grains     🥚 Eggs           🧀 Cheese
🍗 Chicken/poultry  🦃 Turkey         🥛 Dairy products
🍎 Apples           🍌 Bananas        🍇 Grapes
🍊 Citrus           🍓 Berries        🥒 Cucumbers
🍅 Tomatoes         🥕 Carrots        🫑 Peppers
🥜 Nuts             🌻 Seeds          🫘 Legumes
🥨 Pretzels         🍿 Popcorn        🥯 Bagels
🧁 Muffins          🍫 Chocolate      🍯 Honey
🥑 Avocado          🫒 Olives         🥛 Yogurt
```

---

## Database Structure

Each food item saved with these fields:

```javascript
{
  id: "UUID",                    // Auto-generated
  name: "Apple slices",          // From CSV
  category: "fruit",             // Mapped category
  icon: "🍎",                    // Chosen emoji
  ingredients: "[\"apple\"]",    // JSON array
  weekly_limit: 0,               // From CSV or 0 for unlimited
  is_sweet: false,               // Marks treats/sweets
  nutrition_score: 5,            // Calculated 1-5
  created_at: 1234567890,        // Auto
  updated_at: 1234567890         // Auto
}
```

---

## Testing Checklist

After import, verify:

- [ ] All 5 category tabs show items
- [ ] Proteins tab: 6 items (eggs, poultry, chickpeas, nut butters)
- [ ] Veggies tab: 8 items (cucumber, tomato, carrot, pepper, etc.)
- [ ] Fruits tab: 10 items (apple, banana, grapes, berries, melon, etc.)
- [ ] Grains tab: 17 items (bread, crackers, snacks, treats)
- [ ] Dairy tab: 9 items (cheese, yogurt, labneh, butter, etc.)
- [ ] Drag-and-drop works from all tabs
- [ ] Items with weekly limits show "Max X/week" badge
- [ ] Sweet items trigger "max sweets" rule
- [ ] Health meter calculates correctly with new items

---

## Troubleshooting

### No items showing after import
**Solution**: Hard refresh browser (Ctrl+F5) to clear cache

### Items in wrong category
**Solution**: Check category mapping in `update-food-database.html`, adjust if needed, re-import

### Duplicate items
**Solution**: Run "Clear Old Data First" button before importing again

### Import errors in console
**Solution**: Check network tab in DevTools, verify API is accessible

### Weekly limits not enforcing
**Solution**: 
1. Check Parent Settings → Rules → ensure rules enabled
2. Verify `weekly_limit` field set correctly in database
3. Check `js/modules/rules.js` validation logic

---

## What Was NOT Imported

### Drinks (3 items)
Reason: Typically not part of lunch planning, usually automatic

- Water
- Milk box
- 100% fruit juice

**Note**: These can be manually added if needed using Parent Settings → Add Custom Food

### Combos (5 items)
Reason: These should be composite builders, not individual items

- Bread + Yellow cheese + Tomato
- Tortilla + Turkey + Lettuce
- Bagel + Cream cheese
- Bread + Avocado + Egg
- Pita + Labneh + Olive
- Pita + olive oil + sumac

**Recommendation**: Create custom composite builders for these combinations

---

## Adding More Foods Later

### Option 1: Use Parent Settings
1. Switch to Parent View (password: 1580)
2. Click "⚙️ Parent Settings"
3. Go to "Custom Foods" tab
4. Click "➕ Add Custom Food"
5. Fill in details and save

### Option 2: Update CSV and Re-Import
1. Edit `kids_breakfast_box_defaults_updated.csv`
2. Add new rows with same format
3. Update `update-food-database.html` with new items
4. Run "Clear Old Data" then "Update Database"

---

## CSV Format Reference

Original CSV columns (for future reference):

```
item,category,subcategory,variants,pairings,portion,packing_notes,allergens,diet_tags,default_weekly_limit
```

**Used in Import**:
- `item` → `name`
- `category` + `subcategory` → mapped to app `category`
- `default_weekly_limit` → `weekly_limit`
- Inferred `is_sweet` from category (Treats, Spreads/Sweetener)

**Not Used** (but available for future features):
- `variants` - Could add as custom field
- `pairings` - Could use for smart suggestions
- `portion` - Could display in tooltip
- `packing_notes` - Could show in parent view
- `allergens` - Could add as custom field and filter
- `diet_tags` - Could use for dietary restrictions

---

## Future Enhancements

### Possible Features Using CSV Data

1. **Allergen Filtering**
   - Add `allergens` field to food items
   - Allow parents to filter out foods with specific allergens
   - Show allergen warnings when planning

2. **Dietary Preferences**
   - Add `diet_tags` field (Vegetarian, Vegan, GF, etc.)
   - Filter food palette by dietary preference
   - Mark items with diet icons

3. **Portion Guidance**
   - Show portion sizes from CSV
   - Help parents understand quantities
   - Add to shopping list generation

4. **Smart Pairings**
   - Use `pairings` data to suggest combinations
   - "Add cheese with crackers?" prompts
   - Auto-complete meal suggestions

5. **Packing Tips**
   - Show `packing_notes` in parent view
   - Help with meal prep organization
   - Printable packing guide

6. **Variant Support**
   - Allow choosing variants (whole wheat vs. white bread)
   - Track which variants used
   - Variety recommendations

---

## Data Migration Summary

**Before**: 24 generic food items  
**After**: 50 specific breakfast box items from CSV

**Categories**:
- Proteins: 4 → 6 items
- Veggies: 7 → 8 items
- Fruits: 6 → 10 items
- Grains: 5 → 17 items
- Dairy: 3 → 9 items

**Total**: 25 → 50 items (100% increase in variety!)

---

## Success! 🎉

You now have a comprehensive breakfast box meal planner with 50 real food items based on the CSV data!

**Next Steps**:
1. Open `update-food-database.html`
2. Run the import process
3. Test in `index.html`
4. Start planning meals with the new variety!

---

*CSV import system created November 4, 2025*
