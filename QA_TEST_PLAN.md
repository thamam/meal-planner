# 🧪 QA Test Plan - Kids' Meal Planner

## Document Information
- **Project**: Kids' Meal Planner - Enhanced Edition
- **Version**: 2.1
- **Created**: November 5, 2025
- **Test Scope**: Comprehensive functional, integration, and user experience testing
- **Target Audience**: QA Engineers, Developers, Product Managers

---

## Table of Contents
1. [Test Strategy](#test-strategy)
2. [Test Environment](#test-environment)
3. [Functional Test Cases](#functional-test-cases)
4. [Integration Test Cases](#integration-test-cases)
5. [User Experience Test Cases](#user-experience-test-cases)
6. [Performance Test Cases](#performance-test-cases)
7. [Security Test Cases](#security-test-cases)
8. [Accessibility Test Cases](#accessibility-test-cases)
9. [Cross-Browser Test Cases](#cross-browser-test-cases)
10. [Regression Test Cases](#regression-test-cases)
11. [Edge Cases & Boundary Testing](#edge-cases--boundary-testing)
12. [Test Data Requirements](#test-data-requirements)
13. [Acceptance Criteria](#acceptance-criteria)

---

## Test Strategy

### Testing Objectives
- ✅ Verify all 7 enhancement features work as designed
- ✅ Ensure data persistence across sessions
- ✅ Validate parent and child workflows
- ✅ Confirm bilingual support (English/Hebrew)
- ✅ Test drag-and-drop functionality across devices
- ✅ Verify rule engine enforcement
- ✅ Ensure graceful error handling

### Testing Approach
- **Manual Testing**: User workflows, UI/UX validation
- **Exploratory Testing**: Edge cases and boundary conditions
- **Regression Testing**: Verify existing features after changes
- **Cross-Browser Testing**: Chrome, Firefox, Safari, Edge
- **Mobile Testing**: iOS Safari, Android Chrome

### Test Prioritization
1. **P0 - Critical**: Core meal planning, data persistence, profile creation
2. **P1 - High**: Parent settings, rule engine, shopping list
3. **P2 - Medium**: Audio features, guidance system, undo
4. **P3 - Low**: Animations, tooltips, print functionality

---

## Test Environment

### Browser Requirements
- **Desktop**:
  - Chrome 120+ (Primary)
  - Firefox 121+
  - Safari 17+
  - Edge 120+
- **Mobile**:
  - iOS Safari 17+
  - Android Chrome 120+

### Device Requirements
- Desktop: 1920x1080 minimum
- Tablet: iPad (1024x768)
- Mobile: iPhone 12+ (390x844), Android (360x800)

### Test Data
- 3 test child profiles (ages 4, 6, 8)
- 57 default food items
- 5 custom food items
- Sample meal plans (empty, partial, complete)
- Custom rules configurations

---

## Functional Test Cases

### 1. Profile Management

#### TC-PM-001: Create New Child Profile
**Priority**: P0  
**Preconditions**: Application loaded  
**Steps**:
1. Click "Create New Profile" button
2. Enter child name: "Emma"
3. Select age: 6
4. Choose avatar: "girl-1"
5. Click "Create Profile"

**Expected Result**:
- Profile created successfully
- Toast notification: "Profile created!"
- Redirected to meal planner view
- Avatar displays selected image
- Welcome message shows child's name

**Acceptance Criteria**: Profile saved to database with correct user_id

---

#### TC-PM-002: Switch Between Profiles
**Priority**: P1  
**Preconditions**: Multiple profiles exist  
**Steps**:
1. Navigate to home screen
2. Click on profile "Emma"
3. Verify meal planner loads for Emma
4. Return to home
5. Click on profile "Lucas"
6. Verify meal planner loads for Lucas

**Expected Result**:
- Each profile loads its own meal plan
- Health meter resets per profile
- Custom foods specific to each profile
- Shopping list unique to each profile

---

#### TC-PM-003: Delete Profile
**Priority**: P1  
**Preconditions**: Profile "Test User" exists  
**Steps**:
1. Navigate to profile list
2. Click delete icon on "Test User"
3. Confirm deletion in modal

**Expected Result**:
- Profile removed from list
- Associated meal plans deleted
- Custom foods deleted
- Rules deleted
- Toast notification: "Profile deleted"

---

### 2. Meal Planning (Drag & Drop)

#### TC-MP-001: Drag Food to Valid Day
**Priority**: P0  
**Preconditions**: Meal planner loaded  
**Steps**:
1. Switch to "Proteins" tab
2. Drag "Chicken" food item
3. Drop on Monday column

**Expected Result**:
- Food item appears in Monday column
- Food emoji and name visible
- Health meter updates
- Avatar animation plays (happy)
- Auto-save triggers after 2 seconds
- Sound effect plays (if enabled)

**Acceptance Criteria**: Food item saved to database in meal_plans table

---

#### TC-MP-002: Drag Food to Multiple Days
**Priority**: P0  
**Preconditions**: Meal planner loaded  
**Steps**:
1. Switch to "Vegetables" tab
2. Drag "Broccoli" to Monday
3. Drag "Broccoli" to Tuesday
4. Drag "Broccoli" to Wednesday

**Expected Result**:
- Broccoli appears on all three days
- Health meter updates progressively
- Auto-save triggers after final drop
- No duplicate warning (rule not enabled by default)

---

#### TC-MP-003: Remove Food from Day
**Priority**: P0  
**Preconditions**: Monday has "Chicken" added  
**Steps**:
1. Hover over "Chicken" on Monday
2. Click "×" (remove button)

**Expected Result**:
- "Chicken" removed from Monday
- Health meter decreases
- Avatar animation may update
- Auto-save triggers after 2 seconds
- Undo button becomes enabled
- Remove sound plays (if enabled)

---

#### TC-MP-004: Drag Food to Invalid Target
**Priority**: P1  
**Preconditions**: Meal planner loaded  
**Steps**:
1. Drag "Apple" food item
2. Drop on invalid area (health meter, header)

**Expected Result**:
- Food item returns to palette
- No food added to meal plan
- No health meter change
- No error message displayed
- Smooth animation returning to origin

---

### 3. Tab-Based Food Categories

#### TC-CAT-001: Switch Between Category Tabs
**Priority**: P0  
**Preconditions**: Meal planner loaded  
**Steps**:
1. Verify "Proteins" tab is active (white bg, purple border)
2. Click "Vegetables" tab
3. Verify vegetables displayed
4. Click "Fruits" tab
5. Verify fruits displayed
6. Click "Grains" tab
7. Click "Dairy" tab
8. Click "Snacks" tab

**Expected Result**:
- Each tab shows only its category items
- Active tab highlighted (white background, purple border)
- Inactive tabs have subtle styling
- Item count displayed in each tab (e.g., "Proteins (12)")
- Tab click sound plays (if enabled)
- Smooth transition between categories

---

#### TC-CAT-002: Verify Item Counts in Tabs
**Priority**: P2  
**Preconditions**: Meal planner loaded, default foods loaded  
**Steps**:
1. Check count in each tab label

**Expected Result**:
- Proteins: 12 items
- Vegetables: 10 items
- Fruits: 8 items
- Grains: 9 items
- Dairy: 6 items
- Snacks: 12 items
- Total: 57 items

---

#### TC-CAT-003: Drag from Different Tabs
**Priority**: P0  
**Preconditions**: Meal planner loaded  
**Steps**:
1. From "Proteins" tab, drag "Fish" to Monday
2. From "Vegetables" tab, drag "Carrot" to Monday
3. From "Fruits" tab, drag "Apple" to Monday

**Expected Result**:
- All three items appear on Monday
- Items displayed in order added
- Health meter shows balanced score
- Each drag triggers success sound
- Auto-save triggers after last drop

---

### 4. Health Meter & Scoring

#### TC-HM-001: Empty Meal Plan Health Score
**Priority**: P1  
**Preconditions**: No meals planned  
**Steps**:
1. View health meter

**Expected Result**:
- Score: 0%
- Color: Red (#EF4444)
- Avatar: Neutral or sad expression
- Meter bar empty

---

#### TC-HM-002: Balanced Meal Plan Health Score
**Priority**: P1  
**Preconditions**: Week planned with variety  
**Steps**:
1. Add 2 proteins, 2 veggies, 2 fruits, 2 grains, 1 dairy per day for 5 days
2. Check health meter

**Expected Result**:
- Score: 90-100%
- Color: Green (#10B981)
- Avatar: Happy expression
- Meter bar nearly full
- Celebration message (if guidance enabled)

---

#### TC-HM-003: Unbalanced Meal Plan Health Score
**Priority**: P1  
**Preconditions**: Only snacks added  
**Steps**:
1. Add "Cookies" to all 5 days
2. Add "Ice Cream" to all 5 days
3. Check health meter

**Expected Result**:
- Score: 20-30%
- Color: Red (#EF4444)
- Avatar: Sad expression
- Meter bar mostly empty
- Guidance suggests adding variety (if enabled)

---

#### TC-HM-004: Health Score Updates Dynamically
**Priority**: P0  
**Preconditions**: Meal plan has some items  
**Steps**:
1. Note current health score (e.g., 60%)
2. Add "Broccoli" to Monday
3. Observe health meter

**Expected Result**:
- Score increases immediately (e.g., 60% → 65%)
- Meter bar animates smoothly
- Avatar may react positively
- Color may change if crossing threshold

---

### 5. Parent Settings - Rules Tab

#### TC-PS-001: Open Parent Settings Modal
**Priority**: P0  
**Preconditions**: Meal planner view loaded  
**Steps**:
1. Click "⚙️ Parent Settings" button in control panel

**Expected Result**:
- Modal opens with three tabs: Rules, Custom Foods, Food Limits
- "Rules" tab active by default
- Current rule settings loaded from database
- Close button (×) visible
- Modal overlay darkens background

---

#### TC-PS-002: Enable "No Duplicates Per Day" Rule
**Priority**: P1  
**Preconditions**: Parent Settings modal open, Rules tab active  
**Steps**:
1. Toggle "No Duplicates Per Day" to ON
2. Click "Save Settings"
3. Close modal
4. Drag "Chicken" to Monday
5. Attempt to drag "Chicken" to Monday again

**Expected Result**:
- Second drag of "Chicken" rejected
- Error toast: "Cannot add same food twice on one day"
- Error sound plays (if enabled)
- Avatar shows sad reaction
- Food returns to palette

---

#### TC-PS-003: Set Max Items Per Day Limit
**Priority**: P1  
**Preconditions**: Parent Settings modal open, Rules tab active  
**Steps**:
1. Set "Max Items Per Day" to 3
2. Click "Save Settings"
3. Close modal
4. Add "Chicken", "Broccoli", "Apple" to Monday
5. Attempt to add "Bread" to Monday

**Expected Result**:
- Fourth item rejected
- Error toast: "Cannot add more than 3 items per day"
- Error sound plays
- Monday still shows 3 items
- Guidance suggests balancing across other days

---

#### TC-PS-004: Set Max Sweets Per Week Limit
**Priority**: P1  
**Preconditions**: Parent Settings modal open, Rules tab active  
**Steps**:
1. Set "Max Sweets Per Week" to 2
2. Click "Save Settings"
3. Close modal
4. Add "Ice Cream" to Monday
5. Add "Cookies" to Tuesday
6. Attempt to add "Chocolate" to Wednesday

**Expected Result**:
- Third sweet rejected
- Error toast: "Cannot add more than 2 sweets this week"
- Total sweet count: 2
- Guidance suggests healthy alternatives

---

#### TC-PS-005: Disable All Rules
**Priority**: P2  
**Preconditions**: All rules enabled  
**Steps**:
1. Open Parent Settings
2. Toggle "No Duplicates Per Day" to OFF
3. Set "Max Items Per Day" to 0 (unlimited)
4. Set "Max Sweets Per Week" to 0 (unlimited)
5. Save and close
6. Test adding duplicates and many items

**Expected Result**:
- No validation errors
- Can add same food multiple times per day
- Can add unlimited items per day
- Can add unlimited sweets per week
- App functions without restrictions

---

### 6. Parent Settings - Custom Foods Tab

#### TC-CF-001: Add Custom Food Item
**Priority**: P1  
**Preconditions**: Parent Settings modal open, Custom Foods tab active  
**Steps**:
1. Click "Custom Foods" tab
2. Click "Add Custom Food" button
3. Enter name: "Quinoa Salad"
4. Select category: "Grains"
5. Select icon: "🥗"
6. Set weekly limit: 3
7. Click "Add Food"

**Expected Result**:
- Toast: "Custom food added!"
- "Quinoa Salad" appears in custom foods list
- Food saved to database
- Food appears in "Grains" tab in meal planner
- Weekly limit of 3 enforced

---

#### TC-CF-002: Remove Custom Food Item
**Priority**: P1  
**Preconditions**: Custom food "Quinoa Salad" exists  
**Steps**:
1. Open Parent Settings → Custom Foods tab
2. Click "Remove" button next to "Quinoa Salad"
3. Confirm deletion

**Expected Result**:
- Toast: "Custom food removed"
- "Quinoa Salad" removed from list
- Food deleted from database
- Food no longer appears in Grains tab
- Any meal plans with "Quinoa Salad" remain but marked as unavailable

---

#### TC-CF-003: Add Custom Food with Emoji Icon
**Priority**: P2  
**Preconditions**: Parent Settings → Custom Foods tab open  
**Steps**:
1. Click "Add Custom Food"
2. Enter name: "Mango Smoothie"
3. Category: "Dairy"
4. Icon: "🥤"
5. Weekly limit: 5
6. Add food

**Expected Result**:
- Food added successfully
- Emoji icon "🥤" displays in palette
- Appears in "Dairy" tab
- Draggable to meal plan

---

#### TC-CF-004: Custom Food Weekly Limit Enforcement
**Priority**: P1  
**Preconditions**: Custom food "Quinoa Salad" with limit 3 exists  
**Steps**:
1. Add "Quinoa Salad" to Monday
2. Add "Quinoa Salad" to Tuesday
3. Add "Quinoa Salad" to Wednesday
4. Attempt to add "Quinoa Salad" to Thursday

**Expected Result**:
- Fourth addition rejected
- Error toast: "Weekly limit reached for Quinoa Salad (max: 3)"
- Meal plan shows 3 occurrences only

---

### 7. Parent Settings - Food Limits Tab

#### TC-FL-001: Set Weekly Limit for Default Food
**Priority**: P1  
**Preconditions**: Parent Settings open, Food Limits tab active  
**Steps**:
1. Click "Food Limits" tab
2. Find "Ice Cream" in list
3. Set weekly limit: 2
4. Click "Save Settings"
5. Close modal
6. Add "Ice Cream" to Monday and Tuesday
7. Attempt to add "Ice Cream" to Wednesday

**Expected Result**:
- Third ice cream rejected
- Error toast: "Weekly limit reached for Ice Cream (max: 2)"
- Previous two ice creams remain in meal plan

---

#### TC-FL-002: Set Unlimited Weekly Limit (Zero)
**Priority**: P2  
**Preconditions**: "Broccoli" has limit of 5  
**Steps**:
1. Open Parent Settings → Food Limits
2. Find "Broccoli"
3. Set weekly limit: 0
4. Save and close
5. Add "Broccoli" to all 5 days multiple times

**Expected Result**:
- No limit enforced
- Can add "Broccoli" unlimited times
- No error messages

---

#### TC-FL-003: Filter Food Limits by Category
**Priority**: P2  
**Preconditions**: Food Limits tab open  
**Steps**:
1. Select category filter: "Proteins"
2. Verify only protein foods shown
3. Select "Vegetables"
4. Verify only vegetables shown

**Expected Result**:
- Category filter works correctly
- Item counts match filtered category
- Can still set limits on filtered items

---

### 8. Composite Food Builder

#### TC-CB-001: Build Custom Sandwich
**Priority**: P1  
**Preconditions**: Meal planner loaded  
**Steps**:
1. Click "Build Sandwich" button
2. Select bread: "Whole Wheat"
3. Select protein: "Turkey"
4. Select veggie: "Lettuce"
5. Select spread: "Mustard"
6. Click "Add to Meal Plan"
7. Select day: Monday

**Expected Result**:
- Sandwich builder modal closes
- Composite item "Turkey Sandwich" added to Monday
- Shows all 4 components
- Counts toward health meter (all categories)
- Rule validation applies to composite

---

#### TC-CB-002: Build Custom Pasta
**Priority**: P1  
**Preconditions**: Meal planner loaded  
**Steps**:
1. Click "Build Pasta" button
2. Select pasta: "Penne"
3. Select sauce: "Tomato"
4. Select protein: "Chicken"
5. Select veggie: "Broccoli"
6. Select topping: "Parmesan"
7. Add to Tuesday

**Expected Result**:
- Composite pasta added to Tuesday
- All 5 components visible
- Health meter reflects balanced meal
- Hover shows all ingredients

---

#### TC-CB-003: Build Custom Salad
**Priority**: P1  
**Preconditions**: Meal planner loaded  
**Steps**:
1. Click "Build Salad" button
2. Select greens: "Spinach"
3. Select veggies: "Cherry Tomatoes", "Cucumber"
4. Select protein: "Grilled Chicken"
5. Select dressing: "Balsamic"
6. Add to Wednesday

**Expected Result**:
- Custom salad added to Wednesday
- Multiple vegetables counted
- Protein included
- Dressing shown
- Composite counts as one "item" for max items rule

---

#### TC-CB-004: Close Builder Without Adding
**Priority**: P2  
**Preconditions**: Sandwich builder open  
**Steps**:
1. Open "Build Sandwich"
2. Select some options (not all)
3. Click "Close" or click outside modal

**Expected Result**:
- Modal closes
- No item added to meal plan
- No error message
- Can reopen builder cleanly

---

#### TC-CB-005: Builder Validation (All Steps Required)
**Priority**: P1  
**Preconditions**: Sandwich builder open  
**Steps**:
1. Select bread only
2. Attempt to click "Add to Meal Plan"

**Expected Result**:
- "Add" button disabled (grayed out)
- Tooltip: "Complete all steps"
- Cannot add incomplete sandwich

---

### 9. Auto-Save & Undo System

#### TC-AS-001: Auto-Save After Adding Food
**Priority**: P0  
**Preconditions**: Meal planner loaded  
**Steps**:
1. Add "Chicken" to Monday
2. Wait 2 seconds
3. Check browser console or network tab

**Expected Result**:
- Auto-save triggers after 2-second delay
- API call to save meal plan
- Toast notification: "Saved!" (brief)
- Data persists in database

---

#### TC-AS-002: Auto-Save After Removing Food
**Priority**: P0  
**Preconditions**: Monday has "Chicken"  
**Steps**:
1. Remove "Chicken" from Monday
2. Wait 2 seconds
3. Refresh page

**Expected Result**:
- Auto-save triggers
- Meal plan reloads without "Chicken"
- Change persisted to database

---

#### TC-AS-003: Auto-Save Debouncing
**Priority**: P1  
**Preconditions**: Meal planner loaded  
**Steps**:
1. Add "Chicken" to Monday (wait 1 second)
2. Add "Broccoli" to Monday (wait 1 second)
3. Add "Apple" to Monday (wait 3 seconds)

**Expected Result**:
- Only ONE auto-save call made (after 2 seconds of last action)
- All three items saved together
- No redundant API calls
- Efficient network usage

---

#### TC-AS-004: Undo Last Action
**Priority**: P1  
**Preconditions**: "Chicken" added to Monday  
**Steps**:
1. Verify "Undo" button enabled
2. Click "↩️ Undo" button

**Expected Result**:
- "Chicken" removed from Monday
- Health meter reverts to previous state
- Avatar resets
- Undo button may disable if no more history
- Toast: "Undo successful"

---

#### TC-AS-005: Undo Multiple Actions (Up to 5)
**Priority**: P1  
**Preconditions**: 5 foods added to various days  
**Steps**:
1. Add "Chicken", "Broccoli", "Apple", "Bread", "Milk"
2. Click "Undo" 5 times

**Expected Result**:
- Each undo reverses one action in LIFO order
- After 5 undos, all items removed
- Undo button disables after 5th undo
- No errors or crashes

---

#### TC-AS-006: Undo Limit (6th Action)
**Priority**: P2  
**Preconditions**: 6 items added  
**Steps**:
1. Add 6 foods to meal plan
2. Click "Undo" 6 times

**Expected Result**:
- First 5 undos work correctly
- 6th undo button disabled
- Earliest action (1st food) cannot be undone
- Toast: "Undo history limit reached"

---

#### TC-AS-007: Undo History Clears on Refresh
**Priority**: P2  
**Preconditions**: Undo history has 3 actions  
**Steps**:
1. Add 3 foods
2. Refresh page
3. Check undo button state

**Expected Result**:
- Undo button disabled after refresh
- Undo history cleared (session-based)
- Meal plan persists (saved to database)
- Expected behavior, not a bug

---

### 10. Smart Guidance System

#### TC-SG-001: Enable Guidance Mode
**Priority**: P1  
**Preconditions**: Guidance disabled  
**Steps**:
1. Click "💡 Guidance" button

**Expected Result**:
- Button background turns yellow
- Demo message appears: "Guidance enabled! I'll help you..."
- Guidance box appears below controls
- Guidance toggle state saved to localStorage

---

#### TC-SG-002: Disable Guidance Mode
**Priority**: P1  
**Preconditions**: Guidance enabled  
**Steps**:
1. Click "💡 Guidance" button again

**Expected Result**:
- Button background reverts to white/gray
- Guidance box hides
- Toast: "Guidance disabled"
- State saved to localStorage

---

#### TC-SG-003: Context-Aware Suggestions
**Priority**: P1  
**Preconditions**: Guidance enabled, only proteins added  
**Steps**:
1. Add "Chicken" and "Fish" to Monday
2. Read guidance message

**Expected Result**:
- Guidance suggests: "Add vegetables for balance!"
- Vegetables tab highlighted or suggested
- Positive, encouraging tone
- Updates dynamically as foods added

---

#### TC-SG-004: Celebration Messages
**Priority**: P2  
**Preconditions**: Guidance enabled, week planned  
**Steps**:
1. Plan balanced week (80%+ health score)
2. Read guidance message

**Expected Result**:
- Celebratory message: "Amazing! You created a super healthy week!"
- Positive reinforcement for good choices
- May include emoji or visual celebration

---

#### TC-SG-005: Guidance for Empty Meal Plan
**Priority**: P2  
**Preconditions**: Guidance enabled, no meals planned  
**Steps**:
1. Clear all meals
2. Read guidance

**Expected Result**:
- Helpful message: "Let's start planning! Drag foods from categories above."
- Encouraging tone
- Suggests starting with proteins or grains

---

### 11. Sound & Music System

#### TC-SM-001: Enable Sound Effects
**Priority**: P2  
**Preconditions**: Sounds disabled  
**Steps**:
1. Click "🔊 Sounds" button

**Expected Result**:
- Button background turns green
- Toast: "Sounds enabled!"
- Click sound plays (if audio files exist)
- State saved to localStorage

---

#### TC-SM-002: Test Success Sound
**Priority**: P2  
**Preconditions**: Sounds enabled, audio files present  
**Steps**:
1. Add "Apple" to Monday

**Expected Result**:
- Success sound plays ("ding" or positive tone)
- Sound doesn't block other actions
- Sound ends naturally

---

#### TC-SM-003: Test Error Sound
**Priority**: P2  
**Preconditions**: Sounds enabled, no duplicates rule enabled  
**Steps**:
1. Add "Chicken" to Monday
2. Try adding "Chicken" to Monday again

**Expected Result**:
- Error sound plays (buzzer or negative tone)
- Error toast appears simultaneously
- Sound indicates mistake clearly

---

#### TC-SM-004: Enable Background Music
**Priority**: P3  
**Preconditions**: Music disabled  
**Steps**:
1. Click "🎵 Music" button

**Expected Result**:
- Button background turns blue
- Background music starts (if audio file exists)
- Music loops continuously
- Volume appropriate (not too loud)
- State saved to localStorage

---

#### TC-SM-005: Graceful Fallback (No Audio Files)
**Priority**: P1  
**Preconditions**: No sound files in `/sounds/` folder  
**Steps**:
1. Enable sounds
2. Enable music
3. Perform actions (add foods, trigger errors)

**Expected Result**:
- No JavaScript errors in console
- Visual toggles still work
- Toast messages: "Audio files optional"
- App fully functional without sounds
- Tooltips indicate sounds are optional

---

### 12. Shopping List Generator

#### TC-SL-001: Generate Shopping List
**Priority**: P0  
**Preconditions**: Meal plan has 10+ items  
**Steps**:
1. Click "👨‍👩‍👧 Parent View" button
2. Scroll to "Shopping List" section
3. Click "Generate List" button

**Expected Result**:
- Shopping list generated
- All food items listed with counts (e.g., "Chicken x3")
- Items grouped by category
- Total item count shown
- Print button available

---

#### TC-SL-002: Shopping List Category Grouping
**Priority**: P1  
**Preconditions**: Shopping list generated  
**Steps**:
1. Examine shopping list structure

**Expected Result**:
- Items grouped under headers: Proteins, Vegetables, Fruits, Grains, Dairy, Snacks
- Each category listed separately
- Easy to scan while shopping
- Professional formatting

---

#### TC-SL-003: Print Shopping List
**Priority**: P2  
**Preconditions**: Shopping list generated  
**Steps**:
1. Click "Print" button

**Expected Result**:
- Browser print dialog opens
- Shopping list formatted for printing
- Page layout clean and readable
- Can save as PDF or print to paper

---

#### TC-SL-004: Empty Shopping List Handling
**Priority**: P2  
**Preconditions**: No meals planned  
**Steps**:
1. Open Parent View
2. Click "Generate List"

**Expected Result**:
- Message: "No meals planned yet. Add some meals first!"
- No empty list displayed
- Print button disabled
- Graceful empty state

---

### 13. Language Support (Bilingual)

#### TC-LS-001: Switch to Hebrew
**Priority**: P1  
**Preconditions**: English selected  
**Steps**:
1. Click "🇮🇱 עברית" button

**Expected Result**:
- Entire UI switches to Hebrew
- Text direction changes to RTL
- All food names display in Hebrew
- All buttons and labels in Hebrew
- Category tabs in Hebrew
- Language preference saved to localStorage

---

#### TC-LS-002: Switch Back to English
**Priority**: P1  
**Preconditions**: Hebrew selected  
**Steps**:
1. Click "🇺🇸 English" button

**Expected Result**:
- UI switches to English
- Text direction changes to LTR
- All food names in English
- All UI elements in English
- Smooth transition

---

#### TC-LS-003: Food Names in Both Languages
**Priority**: P1  
**Preconditions**: Meal plan has foods added  
**Steps**:
1. Add "Chicken" (English mode)
2. Switch to Hebrew
3. Verify food now shows "עוף"
4. Switch back to English
5. Verify shows "Chicken" again

**Expected Result**:
- Food names update instantly
- No data loss
- Same food item, different language
- Consistent across all views

---

#### TC-LS-004: Guidance Messages in Selected Language
**Priority**: P2  
**Preconditions**: Guidance enabled  
**Steps**:
1. Enable guidance in English
2. Read suggestions
3. Switch to Hebrew
4. Read suggestions

**Expected Result**:
- Guidance messages in correct language
- Contextually appropriate suggestions
- Positive tone maintained in both languages

---

#### TC-LS-005: Parent Settings in Selected Language
**Priority**: P1  
**Preconditions**: Parent Settings open  
**Steps**:
1. Open Parent Settings in English
2. Switch to Hebrew
3. Verify all tabs and labels in Hebrew

**Expected Result**:
- "Rules" → "כללים"
- "Custom Foods" → "מאכלים מותאמים אישית"
- "Food Limits" → "מגבלות מזון"
- All buttons translated
- Form labels translated

---

### 14. Database Integration (Firebase)

#### TC-DB-001: User Profile CRUD Operations
**Priority**: P0  
**Preconditions**: Firebase configured  
**Steps**:
1. Create profile "Test User"
2. Verify saved to Firestore `users` collection
3. Update profile name
4. Delete profile

**Expected Result**:
- CREATE: New document in `users` collection
- READ: Profile loads on login
- UPDATE: Changes persist
- DELETE: Document removed from Firestore

---

#### TC-DB-002: Meal Plan Persistence
**Priority**: P0  
**Preconditions**: Profile exists  
**Steps**:
1. Add 5 foods to meal plan
2. Refresh browser
3. Verify meal plan reloads

**Expected Result**:
- All 5 foods still present
- Same days and order
- Health meter recalculates correctly
- Data retrieved from Firestore `meal_plans` collection

---

#### TC-DB-003: Custom Rules Persistence
**Priority**: P1  
**Preconditions**: Profile exists  
**Steps**:
1. Set max items per day: 3
2. Enable no duplicates
3. Close browser completely
4. Reopen and load profile

**Expected Result**:
- Rules still enforced
- Settings reload from Firestore `rules` collection
- Validation works immediately

---

#### TC-DB-004: Custom Foods Persistence
**Priority**: P1  
**Preconditions**: Profile exists  
**Steps**:
1. Add custom food "Quinoa Salad"
2. Refresh page
3. Verify custom food appears in palette

**Expected Result**:
- Custom food persists across sessions
- Appears in correct category tab
- Weekly limit enforced
- Stored in Firestore `custom_foods` collection

---

#### TC-DB-005: Shopping List History
**Priority**: P2  
**Preconditions**: Shopping list generated  
**Steps**:
1. Generate shopping list for week 1
2. Save list
3. Clear meal plan
4. Plan week 2
5. View shopping list history

**Expected Result**:
- Both shopping lists saved
- Can view historical lists
- Timestamped correctly
- Stored in Firestore `shopping_lists` collection

---

---

## Integration Test Cases

### IT-001: Complete User Workflow
**Priority**: P0  
**Duration**: 15 minutes  
**Steps**:
1. Create new child profile
2. Plan meals for all 5 days with variety
3. Set custom rules
4. Add custom food
5. Build composite sandwich
6. Generate shopping list
7. Print shopping list
8. Switch language
9. Log out and log back in

**Expected Result**: Entire workflow completes without errors, data persists

---

### IT-002: Parent + Child Interaction Flow
**Priority**: P1  
**Duration**: 10 minutes  
**Steps**:
1. Parent sets rule: max 3 items per day
2. Parent adds custom food "Quinoa Bowl"
3. Parent sets ice cream limit: 2 per week
4. Child tries to add 4 items to Monday → blocked
5. Child adds "Quinoa Bowl" successfully
6. Child tries to add 3 ice creams → blocked

**Expected Result**: Rules enforced in real-time, child sees appropriate error messages

---

### IT-003: Multi-Profile Management
**Priority**: P1  
**Duration**: 10 minutes  
**Steps**:
1. Create profile "Emma" (age 6)
2. Plan meals for Emma
3. Switch to profile "Lucas" (age 8)
4. Plan different meals for Lucas
5. Generate separate shopping lists
6. Verify Emma's data unchanged

**Expected Result**: Profiles isolated, no data leakage, each has unique meal plans

---

---

## User Experience Test Cases

### UX-001: First-Time User Onboarding
**Priority**: P1  
**Preconditions**: Fresh app installation  
**Steps**:
1. Open app for first time
2. Follow prompts to create profile
3. Observe guidance and tooltips

**Expected Result**:
- Clear welcome message
- Intuitive profile creation flow
- Helpful tooltips on first actions
- Not overwhelming with information

**User Feedback**: "I knew what to do without reading instructions"

---

### UX-002: Visual Feedback Clarity
**Priority**: P1  
**Steps**:
1. Enable sounds toggle
2. Enable guidance toggle
3. Enable music toggle
4. Drag food to meal plan

**Expected Result**:
- Each toggle has distinct color (green, yellow, blue)
- Button state clearly visible (on/off)
- Drag-and-drop smooth with visual feedback
- Success animations not distracting

**User Feedback**: "I always know what's enabled"

---

### UX-003: Error Message Helpfulness
**Priority**: P1  
**Steps**:
1. Trigger various validation errors
   - Duplicate food per day
   - Max items exceeded
   - Weekly limit reached

**Expected Result**:
- Error messages clear and specific
- Suggest solutions (e.g., "Try another day")
- No technical jargon
- Kid-friendly language

**User Feedback**: "Error messages helped me understand what to do"

---

### UX-004: Mobile Responsiveness
**Priority**: P1  
**Devices**: iPhone 12, iPad, Android phone  
**Steps**:
1. Open app on mobile device
2. Test drag-and-drop
3. Navigate tabs
4. Open parent settings

**Expected Result**:
- All UI elements sized appropriately
- Buttons large enough for touch
- Drag-and-drop works smoothly
- No horizontal scrolling
- Modals fit screen

---

### UX-005: Loading States
**Priority**: P2  
**Steps**:
1. Simulate slow network
2. Load profile
3. Save meal plan
4. Generate shopping list

**Expected Result**:
- Loading spinners shown
- "Loading..." or "Saving..." messages
- No frozen UI
- User knows system is working

---

---

## Performance Test Cases

### PERF-001: Initial Page Load Time
**Priority**: P1  
**Metric**: Time to Interactive (TTI)  
**Target**: < 3 seconds on 4G network  
**Steps**:
1. Clear browser cache
2. Open app URL
3. Measure time until fully interactive

**Acceptance Criteria**: TTI < 3 seconds

---

### PERF-002: Auto-Save Debouncing Efficiency
**Priority**: P1  
**Steps**:
1. Add 10 foods rapidly (within 5 seconds)
2. Monitor network requests

**Expected Result**:
- Only 1 save request made
- Request sent after 2 seconds of last action
- No redundant API calls

---

### PERF-003: Large Meal Plan Performance
**Priority**: P2  
**Steps**:
1. Add 5 foods per day (25 total foods)
2. Test drag-and-drop responsiveness
3. Test tab switching speed
4. Check health meter calculation speed

**Expected Result**:
- No lag or stutter
- UI remains responsive
- Animations smooth
- Health meter updates < 100ms

---

### PERF-004: Memory Usage (No Leaks)
**Priority**: P2  
**Steps**:
1. Open browser dev tools → Performance tab
2. Use app for 10 minutes (add, remove, undo foods)
3. Monitor memory usage

**Expected Result**:
- Memory usage stable
- No continuous growth
- Garbage collection effective

---

---

## Security Test Cases

### SEC-001: Input Sanitization
**Priority**: P1  
**Steps**:
1. Attempt to add custom food with name: `<script>alert('XSS')</script>`
2. Verify input sanitized

**Expected Result**:
- Script tags stripped or escaped
- No JavaScript execution
- Food name displayed as plain text

---

### SEC-002: Data Isolation Between Profiles
**Priority**: P0  
**Steps**:
1. Create profile "Emma"
2. Add custom food "Emma's Snack"
3. Switch to profile "Lucas"
4. Verify "Emma's Snack" not visible

**Expected Result**:
- Custom foods scoped to user_id
- No cross-profile data leakage
- Each profile has isolated database queries

---

### SEC-003: API Endpoint Validation
**Priority**: P1  
**Steps**:
1. Use browser dev tools to inspect API calls
2. Attempt to modify request payloads
3. Send malformed data

**Expected Result**:
- Server validates all inputs
- Invalid requests rejected with appropriate error codes
- No server crashes

---

---

## Accessibility Test Cases

### A11Y-001: Keyboard Navigation
**Priority**: P2  
**Steps**:
1. Use Tab key to navigate between buttons
2. Press Enter to activate buttons
3. Use Arrow keys in modals

**Expected Result**:
- Focus outline visible
- Logical tab order
- All interactive elements reachable
- Modal traps focus

---

### A11Y-002: Screen Reader Compatibility
**Priority**: P2  
**Tools**: NVDA (Windows), VoiceOver (Mac)  
**Steps**:
1. Enable screen reader
2. Navigate profile creation
3. Navigate meal planning interface

**Expected Result**:
- All elements announced
- Button labels descriptive
- Form inputs have labels
- ARIA attributes present

---

### A11Y-003: Color Contrast Ratios
**Priority**: P1  
**Tools**: WAVE, axe DevTools  
**Steps**:
1. Scan page with accessibility tool

**Expected Result**:
- Text contrast ≥ 4.5:1 for normal text
- Text contrast ≥ 3:1 for large text
- Buttons meet contrast requirements

---

### A11Y-004: Focus Management in Modals
**Priority**: P2  
**Steps**:
1. Open Parent Settings modal
2. Tab through elements
3. Press Esc to close
4. Verify focus returns

**Expected Result**:
- Focus trapped in modal when open
- Esc key closes modal
- Focus returns to trigger button

---

---

## Cross-Browser Test Cases

### CB-001: Chrome (Latest)
**Priority**: P0  
**Features to Test**:
- ✅ Drag-and-drop
- ✅ Animations
- ✅ Audio playback
- ✅ Local storage
- ✅ Print functionality

---

### CB-002: Firefox (Latest)
**Priority**: P1  
**Features to Test**:
- ✅ Drag-and-drop
- ✅ CSS Grid/Flexbox
- ✅ Tailwind CSS rendering
- ✅ Firebase integration

---

### CB-003: Safari (Latest)
**Priority**: P1  
**Features to Test**:
- ✅ iOS Safari drag-and-drop
- ⚠️ Audio autoplay restrictions
- ✅ Date handling
- ✅ Local storage

**Known Limitations**: Background music may not autoplay due to Safari policy

---

### CB-004: Edge (Latest)
**Priority**: P1  
**Features to Test**:
- ✅ All core features
- ✅ Performance
- ✅ Print preview

---

### CB-005: Mobile Browsers
**Priority**: P1  
**iOS Safari**:
- ✅ Touch drag-and-drop
- ✅ Responsive layout
- ⚠️ Audio playback may require user interaction

**Android Chrome**:
- ✅ Touch events
- ✅ Performance
- ✅ Firebase SDK

---

---

## Regression Test Cases

### REG-001: Original MVP Features Still Work
**Priority**: P0  
**Features**:
- ✅ Profile creation
- ✅ Basic drag-and-drop
- ✅ Health meter calculation
- ✅ Avatar animations
- ✅ Shopping list generation

**Expected Result**: All original features functional after enhancements

---

### REG-002: No Breaking Changes from New Features
**Priority**: P0  
**Steps**:
1. Disable all new features (guidance off, sounds off, etc.)
2. Use app as if enhancements didn't exist
3. Verify core functionality

**Expected Result**: App works perfectly without using any enhancements

---

---

## Edge Cases & Boundary Testing

### EDGE-001: Empty States
- Empty meal plan → guidance helpful
- No custom foods → clear message
- No undo history → button disabled
- Zero weekly limits → unlimited behavior

---

### EDGE-002: Maximum Limits
- Add 10 items per day (test max items rule)
- Create 50 custom foods (test scalability)
- Undo 5 times (test undo limit)
- Set weekly limit to 999 (test boundary)

---

### EDGE-003: Rapid Actions
- Drag 10 foods within 2 seconds
- Click tabs rapidly 20 times
- Toggle buttons rapidly
- Spam undo button

**Expected Result**: No crashes, debouncing works, UI remains responsive

---

### EDGE-004: Browser Refresh During Save
- Add food
- Refresh browser immediately (before auto-save)
- Verify data state

**Expected Result**: Either old data persists or new data saves, no corruption

---

### EDGE-005: Invalid Characters in Custom Food
- Names with special characters: `!@#$%^&*()`
- Names with emojis: `🍕🌮🍔`
- Very long names (100+ characters)

**Expected Result**: Input validated, reasonable limits enforced

---

---

## Test Data Requirements

### Test Profiles
- **Emma**: Age 6, Girl avatar, 15 meals planned
- **Lucas**: Age 8, Boy avatar, 20 meals planned
- **Test User**: Age 5, Avatar 3, Empty meal plan

### Test Meal Plans
- **Balanced Week**: 90%+ health score, variety of categories
- **Unbalanced Week**: 30% health score, mostly snacks
- **Empty Week**: No meals planned
- **Partial Week**: Monday-Wednesday only

### Test Custom Foods
- "Quinoa Salad" (Grains, 🥗, limit 3)
- "Mango Smoothie" (Dairy, 🥤, limit 5)
- "Veggie Sticks" (Vegetables, 🥕, limit 7)

### Test Rules Configurations
- **Strict**: No duplicates ON, Max 3 items/day, Max 1 sweet/week
- **Moderate**: No duplicates ON, Max 5 items/day, Max 3 sweets/week
- **Relaxed**: All rules OFF

---

---

## Acceptance Criteria

### Functional Criteria
✅ All 7 enhancement features fully operational  
✅ All P0 and P1 test cases pass  
✅ No critical bugs (P0/P1 severity)  
✅ Data persists across sessions  
✅ Rules engine enforces correctly  

### Performance Criteria
✅ Page load time < 3 seconds  
✅ UI responsive with 25+ meals  
✅ Auto-save debouncing effective  
✅ No memory leaks  

### User Experience Criteria
✅ Mobile drag-and-drop works smoothly  
✅ Error messages clear and helpful  
✅ Visual feedback on all actions  
✅ Bilingual support complete (English/Hebrew)  

### Quality Criteria
✅ Code quality score ≥ 95/100  
✅ Zero console errors in production  
✅ Cross-browser compatibility verified  
✅ Documentation complete and accurate  

### Deployment Criteria
✅ Firebase configured correctly  
✅ All environment variables set  
✅ Production build successful  
✅ User testing feedback positive  

---

## Test Execution Tracking

### Test Summary Template
```
Total Test Cases: 150+
Executed: __/__
Passed: __
Failed: __
Blocked: __
Skipped: __

Pass Rate: __%
Critical Issues: __
High Issues: __
Medium Issues: __
Low Issues: __
```

### Test Sign-Off
- **QA Lead**: ________________  Date: ________
- **Developer**: ________________  Date: ________
- **Product Manager**: ________________  Date: ________

---

## Notes for QA Team

1. **Priority**: Focus on P0 and P1 test cases first
2. **Test Environment**: Use staging environment with test Firebase project
3. **Browser Versions**: Always test latest stable versions
4. **Mobile Testing**: Test on real devices when possible
5. **Data Cleanup**: Clear test data between major test cycles
6. **Regression**: Run full regression suite before each release
7. **Exploratory**: Allocate 20% time for exploratory testing
8. **Automation**: P0 test cases candidates for automation

---

**Document Version**: 1.0  
**Last Updated**: November 5, 2025  
**Next Review**: Before v2.2 release
