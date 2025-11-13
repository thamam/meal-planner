# 🎮 Control Buttons Quick Reference

## Main Control Panel Buttons

### 👤 Profile Button
**Location**: Top right corner  
**Function**: Create or edit child profile  
**What it does**:
- Enter child's name
- Set age (4-8)
- Choose avatar emoji
- Saves to database automatically

---

### 💾 Save Button
**Location**: Top right corner  
**Function**: Manual save (mostly automatic now)  
**What it does**:
- Saves current week's meal plan to database
- Shows confirmation message
- **Note**: Auto-save runs every 2 seconds, so this is rarely needed

---

### ↩️ Undo Button
**Location**: Top control bar  
**Function**: Reverse recent actions  
**What it does**:
- Undoes last action (up to 5 steps)
- Disables when no history available (opacity 0.5)
- Each click goes back one step
- **Shortcut**: You can also use Ctrl+Z (keyboard)

**Visual States**:
- ✅ Enabled: Full opacity, clickable
- ⚪ Disabled: 50% opacity, grayed out

---

### 🔊 Sound Toggle
**Location**: Top control bar  
**Function**: Turn sound effects on/off  
**What it does**:
- Controls all sound effects (click, success, error, drop, remove, fanfare)
- Does NOT affect background music (separate control)
- Shows toast message when toggled
- Preference saves to user profile

**Visual States**:
- 🔊 ON: Green background, full opacity, "Sounds On (audio files optional)"
- 🔇 OFF: Gray background, 50% opacity, "Sounds Off"

**Note**: Sound files are optional. App works perfectly without them.

---

### 🎵 Music Toggle
**Location**: Top control bar  
**Function**: Turn background music on/off  
**What it does**:
- Starts/stops ambient background music loop
- Independent from sound effects
- Music plays at 30% volume
- Shows toast message when toggled

**Visual States**:
- 🎵 ON: Blue background, full opacity, "Music On"
- 🎵 OFF: Gray background, 50% opacity, "Music Off"

**Note**: Browser autoplay policy may require user click to start. Music file is optional.

---

### 💡 Guidance Toggle
**Location**: Top control bar  
**Function**: Enable/disable smart suggestions  
**What it does**:
- Turns AI-powered meal suggestions on/off
- Shows demo message when enabled
- Hides guidance box when disabled
- Suggestions appear every 10 seconds during planning

**Visual States**:
- 💡 ON: Yellow background, full opacity, "Guidance On - Get smart suggestions!"
- 💡 OFF: Gray background, 50% opacity, "Guidance Off"

**When Enabled Shows**:
- Context-aware suggestions (e.g., "Add more veggies!")
- Positive reinforcement for healthy choices
- Celebration messages for balanced weeks
- Category highlighting for recommended foods

---

### ⚙️ Parent Settings Button
**Location**: Top control bar (meal planner mode)  
**Function**: Opens parent control panel  
**What it does**:
- Opens comprehensive settings modal
- Access all customization features
- Configure rules and limits
- Manage custom foods

**Settings Sections**:

#### 📋 Rules Tab
Configure validation rules:
- ☑️ **No Duplicates Per Day**: Prevents same food twice on one day (checkbox)
- 🔢 **Max Items Per Day**: Limit total meals per day (number, default: 5)
- 🍰 **Max Sweets Per Week**: Control dessert frequency (number, default: 2)

#### 🍎 Custom Foods Tab
Manage custom food items:
- **Add Custom Food**: Create new food with icon, category, limits
- **Delete Custom Food**: Remove foods you added
- Shows all custom foods with delete buttons

#### 📊 Food Limits Tab
Set per-item weekly maximums:
- Lists all 24+ food items
- Number input next to each (0-7)
- 0 = unlimited
- 1-7 = maximum times per week
- Updates save immediately

**Save Button**: Click "💾 Save Settings" to persist all changes to database

---

### 👨‍👩‍👧 Parent View Tab
**Location**: Top of page (tab switch)  
**Function**: Switch to parent dashboard  
**What it does**:
- Shows weekly meal summary
- Displays nutritional insights
- Generate categorized shopping list
- Print functionality

**Parent View Features**:
- **✨ Generate List**: Creates shopping list grouped by category
- **🖨️ Print**: Print shopping list for grocery store
- **📊 Insights**: Nutritional recommendations
- **Week Summary**: All meals displayed in table format

---

### 🧒 Meal Planner Tab
**Location**: Top of page (tab switch)  
**Function**: Switch to child planning interface  
**What it does**:
- Returns to main drag-and-drop interface
- Shows food palette and weekly grid
- All control buttons visible

---

## Food Palette Controls

### Category Tabs
**Location**: Top of food palette  
**Function**: Switch between food categories  
**Categories**:
- 🍗 **Proteins** (8 items)
- 🥦 **Veggies** (7 items)
- 🍎 **Fruits** (6 items)
- 🍞 **Grains** (5 items)
- 🧀 **Dairy** (3 items)

**Visual States**:
- Active: White background, purple border
- Inactive: Gray background, gray border

---

## Composite Builder Controls

### 🏗️ Composite Items
**Location**: In food palette (marked with 🏗️ icon)  
**Items Available**:
- 🥪 Sandwich Builder
- 🍝 Pasta Builder
- 🥗 Salad Builder

**How to Use**:
1. Click composite item in palette
2. Modal opens with 3 steps
3. Select option for each step
4. Preview updates in real-time
5. Click "Add to [Day]" when complete

**Builder Steps Example (Sandwich)**:
1. **Step 1: Bread** - Choose bread type
2. **Step 2: Filling** - Choose protein
3. **Step 3: Veggies** - Choose toppings

---

## Weekly Planner Controls

### Drag-and-Drop
**Function**: Add meals to days  
**How to Use**:
1. Click and hold food item
2. Drag over target day column
3. Drop when day highlights
4. Release mouse/finger

**Visual Feedback**:
- Drag: Item follows cursor
- Valid Drop: Day column highlights blue
- Invalid Drop: Red shake animation
- Success: Green checkmark animation

### Remove Meals
**Function**: Delete meal from day  
**How to Use**:
- Click "❌" button on any meal card
- Meal removed immediately
- Undo available if needed

---

## Visual Feedback Legend

### Button States
- ✅ **Enabled**: Full color, full opacity, clickable
- ⚪ **Disabled**: Gray, 50% opacity, not clickable
- 🟢 **Active/On**: Colored background (green/blue/yellow)
- ⚫ **Inactive/Off**: Gray background

### Toast Messages
Appear at bottom of screen for 3 seconds:
- 🟢 **Success**: Green background (e.g., "✅ Saved!")
- 🔴 **Error**: Red background (e.g., "❌ Already have that!")
- 🟡 **Warning**: Yellow background (e.g., "⚠️ Too many items")
- 🔵 **Info**: Blue background (e.g., "💡 Guidance On")

### Health Meter States
- 🔴 **Red (0-39%)**: Needs more variety
- 🟡 **Yellow (40-69%)**: Good progress
- 🟢 **Green (70-100%)**: Excellent balance!

---

## Keyboard Shortcuts (if implemented)

- **Ctrl+Z / Cmd+Z**: Undo last action
- **Ctrl+S / Cmd+S**: Manual save (auto-save is default)
- **Escape**: Close any open modal

---

## Tips for Best Experience

1. **Enable Guidance** (💡) when learning - it provides helpful suggestions
2. **Use Category Tabs** for faster food browsing
3. **Try Composite Builders** (🏗️) for more variety
4. **Check Parent Settings** (⚙️) to customize rules
5. **Watch the Health Meter** for nutritional balance
6. **Let Auto-Save Work** - no need to click save constantly
7. **Use Undo** (↩️) freely - mistakes are reversible!

---

*All controls designed to be intuitive for ages 4-8 with parent oversight!* 🎉
