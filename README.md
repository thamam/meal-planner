# 🍱 Kids' Meal Planner - Enhanced Edition

An interactive, fun, and educational meal planning application designed for children aged 4-8 to create healthy weekly menus with parental oversight. Now with 7 major enhancements including auto-save, undo, smart guidance, sound effects, and advanced parental controls!

---

## ✨ Features Implemented (Enhanced Version - All 7 Features!)

### 👶 Child-Facing Features
- ✅ **Drag-and-Drop Interface**: Intuitive visual food selection with emoji icons
- ✅ **Tab-Based Food Categories**: Easy navigation through proteins, veggies, fruits, grains, and dairy with one-click category switching
- ✅ **5-Day Weekly Planner**: Monday through Friday meal planning grid
- ✅ **Live Health Meter**: Real-time nutritional balance feedback with color-coded scoring
- ✅ **Animated Avatar**: Friendly character that reacts to meal choices (happy/sad emotions)
- ✅ **24 Healthy Food Options**: Proteins, veggies, fruits, grains, and dairy
- ✅ **Visual Feedback**: Bounce animations, color changes, and toast notifications
- ✅ **Profile Creation**: Kids can set their name, age, and choose an avatar
- ✅ **🎵 Sound Effects**: Optional click, success, error, and celebration sounds with toggle control
- ✅ **🎵 Background Music**: Optional ambient music with separate toggle (audio files optional)
- ✅ **💡 Smart Guidance**: AI-powered suggestions for balanced meals with positive reinforcement
- ✅ **⚡ Auto-Save**: Meal plans save automatically every 2 seconds without needing to click save
- ✅ **↩️ Undo Feature**: 5-step undo history to reverse mistakes
- ✅ **🏗️ Composite Food Builder**: Multi-step food creation (Sandwich Builder, Pasta Builder, Salad Builder)

### 👨‍👩‍👧 Parent-Facing Features
- ✅ **Weekly Summary View**: Complete overview of all planned meals
- ✅ **Shopping List Generator**: Automatic grocery list showing all food items with counts
- ✅ **Nutritional Insights**: Smart recommendations for balanced nutrition
- ✅ **Print Functionality**: Print shopping lists for grocery trips
- ✅ **Historical Tracking**: View and manage meal plans over time
- ✅ **⚙️ Advanced Parent Settings**: Comprehensive control panel accessible from meal planner mode
- ✅ **📋 Custom Rules Engine**: Define validation rules with real-time enforcement
  - No duplicate foods per day
  - Maximum items per day (default: 5)
  - Maximum sweets per week (default: 2)
  - Per-item weekly limits
- ✅ **🍎 Custom Food Manager**: Add/remove foods from the palette with custom icons and limits
- ✅ **🎯 Food Availability Management**: Enable/disable which foods are available to kids with category filtering and bulk actions
- ✅ **🏗️ Composite Items Management**: Easily edit options for Sandwich, Pasta, and Salad builders (breads, fillings, sauces, toppings, dressings)
- ✅ **📊 Per-Item Weekly Limits**: Set individual maximum usage per food item (e.g., max 2 ice creams per week)
- ✅ **🗂️ Categorized Shopping Lists**: Grocery lists grouped by food category showing all planned items

### 💾 Data Persistence Features
- ✅ **Cloud-Based Storage**: Full CRUD operations via RESTful Table API
- ✅ **Auto-Save (2-second debounce)**: Meal plans persist automatically without button clicks
- ✅ **Multiple Users**: Support for multiple child profiles
- ✅ **Week Management**: Save, load, and clear weekly plans
- ✅ **Shopping List History**: Save generated shopping lists
- ✅ **User Rules Persistence**: Custom validation rules saved to database
- ✅ **Custom Foods Persistence**: User-added foods saved per profile
- ✅ **Undo History**: 5-step undo stack maintained in session memory

### 🌍 Language & Localization Features
- ✅ **Bilingual Support**: Full Hebrew (עברית) and English language support
- ✅ **Bilingual Food Names**: All 57 food items display in Hebrew or English based on language selection
- ✅ **RTL Layout**: Right-to-left text direction for Hebrew
- ✅ **Language Switcher**: Toggle between 🇮🇱 עברית and 🇺🇸 English with one click
- ✅ **Persistent Preference**: Language choice saved to localStorage
- ✅ **100+ Translations**: UI elements, messages, and guidance in both languages
- ✅ **Live Updates**: Food names switch instantly when changing language
- ✅ **6 Categories with Snacks**: Proteins, Vegetables, Fruits, Grains, Dairy, Snacks (חטיפים)

---

## 🎉 7 Major Enhancements Implemented

### 1️⃣ Parental Customization & Control
Parents can now fully customize the food palette and set limits:
- **Add Custom Foods**: Create new food items with custom names, icons, categories, and weekly limits
- **Remove Foods**: Delete custom foods that are no longer needed
- **Per-Item Limits**: Set maximum weekly usage for each food (e.g., "ice cream: max 2 per week")
- **Access**: Click "⚙️ Parent Settings" button in meal planner mode

### 2️⃣ Advanced Rule Engine
Configurable validation rules enforced in real-time:
- **No Duplicates Per Day**: Prevent same food item twice on one day (toggle on/off)
- **Max Items Per Day**: Limit total meals per day (default: 5, adjustable)
- **Max Sweets Per Week**: Control dessert frequency (default: 2, adjustable)
- **Item-Specific Limits**: Set individual food weekly limits in Food Limits section
- **Real-Time Validation**: Rules checked before adding food, with helpful error messages

### 3️⃣ Categorized Inventory & Shopping
Enhanced organization for easier browsing and shopping:
- **Tab-Based Food Palette**: Switch between categories with one click (Proteins, Veggies, Fruits, Grains, Dairy)
- **Category Counts**: See how many items in each category at a glance
- **Grouped Shopping Lists**: Grocery lists organized by category for efficient shopping
- **Easier Dragging**: Tab interface makes drag-and-drop more intuitive on all devices

### 4️⃣ Guided Interaction & Smart Suggestions
AI-powered guidance system with positive reinforcement:
- **Context-Aware Suggestions**: Smart tips based on current meal plan (e.g., "Add more veggies!")
- **Category Highlighting**: Visual guidance points to recommended food categories
- **Positive Reactions**: Celebratory messages for healthy food choices
- **Balanced Week Celebrations**: Special messages when achieving 100% balance
- **Toggle Control**: 💡 button to turn guidance on/off

### 5️⃣ Sound Layer & Audio Feedback
Optional audio enhancements for immersive experience:
- **7 Sound Types**: Click, success, error, fanfare, drop, remove, background music
- **Sound Toggle**: 🔊 button for all sound effects (visual feedback shows on/off state)
- **Music Toggle**: 🎵 button for background music (separate control)
- **Graceful Fallback**: App works perfectly without sound files (optional feature)
- **Volume Levels**: Pre-tuned volumes for each sound type (30%-80%)

### 6️⃣ Hierarchical Item Selection (Composite Builder)
Multi-step food creation for complex meals:
- **Sandwich Builder**: Choose bread → filling → veggies (3 steps)
- **Pasta Builder**: Choose pasta type → sauce → toppings (3 steps)
- **Salad Builder**: Choose base greens → protein → dressing (3 steps)
- **Visual Preview**: See your creation before adding to week
- **Rule Integration**: Composite items validate against all rules
- **Access**: Look for 🏗️ icon on composite food items in palette

### 7️⃣ Persistence & Undo System
Robust state management and error recovery:
- **Auto-Save**: 2-second debounced save after any change (no manual save needed)
- **5-Step Undo**: ↩️ button reverses up to 5 recent actions
- **History Stack**: Previous states saved in memory during session
- **Visual Feedback**: Undo button shows available/disabled state
- **Seamless Integration**: Works with all features (drag-drop, composite builder, rules)

---

## 🚀 Quick Start Guide

### For Children:
1. **Create Your Profile**: Click the "👤 Profile" button and enter your name, age, and pick a fun avatar
2. **Browse Food Categories**: Click category tabs (🍗 Proteins, 🥦 Veggies, 🍎 Fruits, 🍞 Grains, 🧀 Dairy) to see different foods
3. **Plan Your Week**: Drag food items from the palette onto any day of the week
4. **Try Composite Builders**: Click items with 🏗️ icon to build sandwiches, pasta, or salads step-by-step
5. **Watch the Health Meter**: Try to make it green by choosing balanced meals!
6. **Listen to Guidance**: The 💡 suggestions will help you make healthy choices
7. **Use Undo**: Made a mistake? Click ↩️ to go back
8. **Toggle Sounds**: Turn sounds 🔊 and music 🎵 on/off as you like
9. **Auto-Save**: Your plan saves automatically - no need to click save!

### For Parents:
1. **Switch to Parent View**: Click the "👨‍👩‍👧 Parent View" tab
   - **Password Required**: Enter `1580` when prompted (prevents child access)
2. **Access Parent Settings**: Click "⚙️ Parent Settings" button in meal planner mode
3. **Configure Rules**: Set up validation rules (duplicates, max items, sweet limits)
4. **Manage Food Availability**: Enable/disable which foods kids can select
   - Filter by category (All, Proteins, Veggies, Fruits, Grains, Dairy, Snacks)
   - Toggle individual foods on/off
   - Use "Enable All" or "Disable All" for bulk changes
5. **Edit Composite Builders**: Customize Sandwich, Pasta, and Salad builder options (NEW!)
   - Add/remove bread types, fillings, spreads, sauces, toppings, dressings
   - Perfect for managing allergies (remove nuts, gluten, dairy)
   - Easy emoji-based interface
6. **Customize Food Palette**: Add or remove custom foods with icons and limits
7. **Set Food Limits**: Define weekly maximums for each food item
8. **Save Settings**: Click "💾 Save Settings" to persist your configurations
8. **Generate Shopping List**: Click "✨ Generate List" to see all planned items by category
9. **Print Shopping List**: Use "🖨️ Print" to take it to the store
10. **Check Insights**: Review nutritional recommendations

**Parent Password**: `1580` - Required for accessing Parent View dashboard  
⚠️ **Currently Disabled for Development** - See `PARENT-PASSWORD-DISABLED.md` for details. Re-enable before publishing!

---

## 📊 Current Functional Entry URIs

### Main Application
- **`/index.html`** - Main meal planner interface
  - Query Parameters: None
  - Features: Drag-and-drop planner, health meter, profile management

### Database Management Tools
- **`/update-food-database-bilingual.html`** - Bilingual food database import tool
  - Features: Import 57 food items with Hebrew and English names
  - Functions: Clear database, import from CSV, view import status
  - Data Source: kids_breakfast_box_defaults_bilingual.csv
  - **Usage**: Open in browser, click "Clear Old Data First", then "Update Database"

### RESTful API Endpoints

#### Users (Child Profiles)
- **GET** `tables/users` - List all user profiles
- **GET** `tables/users/{id}` - Get specific user profile
- **POST** `tables/users` - Create new child profile
- **PUT** `tables/users/{id}` - Update profile (includes preferences with sound/guidance settings)
- **DELETE** `tables/users/{id}` - Remove profile

#### Food Items
- **GET** `tables/food_items?limit=100` - Get all available food items
- **GET** `tables/food_items/{id}` - Get specific food item

#### Custom Foods (NEW)
- **GET** `tables/custom_foods?search={user_id}` - Get user's custom foods
- **POST** `tables/custom_foods` - Add custom food item
- **DELETE** `tables/custom_foods/{id}` - Remove custom food

#### Composite Items (NEW)
- **GET** `tables/composite_items` - Get all composite builders (sandwich, pasta, salad)
- **GET** `tables/composite_items/{id}` - Get specific composite item with steps

#### Rules (NEW)
- **GET** `tables/rules?search={user_id}` - Get user's validation rules
- **POST** `tables/rules` - Save/update rule configuration
- **PUT** `tables/rules/{id}` - Update existing rule

#### Meal Plans
- **GET** `tables/meal_plans?search={user_id}` - Get user's meal plans
- **POST** `tables/meal_plans` - Save new meal plan (auto-save triggered)
- **PUT** `tables/meal_plans/{id}` - Update existing meal plan
- **DELETE** `tables/meal_plans/{id}` - Remove meal plan

#### Shopping Lists
- **GET** `tables/shopping_lists?search={user_id}` - Get user's shopping lists
- **POST** `tables/shopping_lists` - Save new categorized shopping list

---

## 🗄️ Data Models

### Users Table
```javascript
{
  id: "UUID",                    // Auto-generated
  name: "Emma",                  // Child's name
  age: 7,                        // Child's age
  avatar: "🦄",                  // Chosen emoji avatar
  preferences: "{}",             // JSON string for dietary preferences
  created_at: 1234567890,        // Auto-generated timestamp
  updated_at: 1234567890         // Auto-generated timestamp
}
```

### Food Items Table
```javascript
{
  id: "food_001",                          // Unique identifier
  name: "Grilled Chicken",                 // Display name (English)
  name_he: "עוף צלוי",                     // Display name (Hebrew) - OPTIONAL
  category: "protein",                     // protein/veggie/fruit/grain/dairy/snack
  icon: "🍗",                              // Emoji representation
  nutrition_score: 5,                      // Health rating 1-5
  weekly_limit: 0,                         // Max per week (0 = unlimited)
  is_sweet: false,                         // Counts toward sweet limit
  ingredients: "[\"chicken breast\", ...]" // JSON array string
}
```

### Meal Plans Table
```javascript
{
  id: "UUID",                    // Auto-generated
  user_id: "user_uuid",          // Reference to users table
  week_start: "2025-01-06",      // Monday of the week (YYYY-MM-DD)
  meals: "{...}",                // JSON string containing all weekly meals
  created_at: 1234567890,        // Auto-generated timestamp
  updated_at: 1234567890         // Auto-generated timestamp
}
```

### Shopping Lists Table
```javascript
{
  id: "UUID",                          // Auto-generated
  user_id: "user_uuid",                // Reference to users table
  week_start: "2025-01-06",            // Week reference
  items: "{...}",                      // JSON string of ingredients grouped by category
  created_at_readable: "1/6/2025",     // Human-readable date
  created_at: 1234567890,              // Auto-generated timestamp
  updated_at: 1234567890               // Auto-generated timestamp
}
```

### Custom Foods Table (NEW)
```javascript
{
  id: "UUID",                    // Auto-generated
  user_id: "user_uuid",          // Reference to users table
  name: "Tofu Nuggets",          // Custom food name
  category: "protein",           // Food category
  icon: "🥡",                    // Emoji icon
  weekly_limit: 3,               // Max per week (0 = unlimited)
  is_sweet: false,               // Counts toward sweet limit if true
  created_at: 1234567890,        // Auto-generated timestamp
  updated_at: 1234567890         // Auto-generated timestamp
}
```

### Rules Table (NEW)
```javascript
{
  id: "UUID",                              // Auto-generated
  user_id: "user_uuid",                    // Reference to users table
  rule_name: "noDuplicatesPerDay",         // Rule identifier
  rule_value: "true",                      // JSON string (boolean/number)
  enabled: true,                           // Rule active status
  created_at: 1234567890,                  // Auto-generated timestamp
  updated_at: 1234567890                   // Auto-generated timestamp
}
```

### Composite Items Table (NEW - Pre-loaded)
```javascript
{
  id: "composite_001",                     // Unique identifier
  name: "Sandwich Builder",                // Display name
  category: "grain",                       // Primary category
  icon: "🏗️🥪",                           // Emoji representation
  steps: "[\"Bread\", \"Filling\", ...]",  // JSON array of step names
  ingredients_map: "{...}",                // JSON object mapping steps to options
  created_at: 1234567890,                  // Auto-generated timestamp
  updated_at: 1234567890                   // Auto-generated timestamp
}
```

---

## 🎯 Health Scoring Algorithm

The health meter calculates balance based on weekly nutritional categories:

- **Protein**: Target 3+ servings/week (20 points max)
- **Vegetables**: Target 5+ servings/week (20 points max)
- **Fruits**: Target 5+ servings/week (20 points max)
- **Grains**: Target 3+ servings/week (20 points max)
- **Dairy**: Target 3+ servings/week (20 points max)

**Total Score**: 0-100%
- 🔴 Red (0-39%): Needs more variety
- 🟡 Yellow (40-69%): Good progress
- 🟢 Green (70-100%): Excellent balance!

---

## 🛠️ Tech Stack

### Frontend
- **HTML5** with semantic structure and Web Audio API
- **Tailwind CSS** via CDN for rapid, responsive styling
- **Vanilla JavaScript** (ES6+) with modular architecture
- **Google Fonts** (Fredoka) for kid-friendly typography
- **Drag & Drop API** for intuitive meal planning

### Backend/Storage
- **RESTful Table API** for persistent cloud storage
- **localStorage** for session state and preferences
- **JSON** for complex data serialization (rules, steps, ingredients)

### Module Architecture
- `js/app.js` - Main application logic (1,300+ lines)
- `js/modules/rules.js` - Validation rule engine
- `js/modules/sounds.js` - Audio system with graceful fallback
- `js/modules/guidance.js` - AI-powered suggestion system
- `js/modules/autosave-undo.js` - Auto-save and undo management
- `js/modules/categorized-view.js` - Tab-based food palette rendering

### Libraries & CDN
- Tailwind CSS: `https://cdn.tailwindcss.com`
- Google Fonts: `https://fonts.googleapis.com/css2?family=Fredoka`

### Optional Audio Files
Place MP3 files in `sounds/` folder (gracefully skipped if missing):
- `background-music.mp3` - Ambient music (loop, 30% volume)
- `click.mp3` - Button clicks (50% volume)
- `success.mp3` - Success actions (70% volume)
- `error.mp3` - Validation errors (60% volume)
- `fanfare.mp3` - Celebrations (80% volume)
- `drop.mp3` - Drag-and-drop (40% volume)
- `remove.mp3` - Item removal (50% volume)

---

## 📱 Responsive Design

- ✅ Desktop: Full grid layout with all features visible
- ✅ Tablet: Adjusted grid columns for optimal viewing
- ✅ Mobile: Single-column layout with touch-friendly drag-and-drop

---

## 🎮 Features Not Yet Implemented (Future Versions)

These features could enhance the app further:

### Enhanced Gamification
- [ ] Sticker rewards for balanced weeks
- [ ] Achievement badges (e.g., "Veggie Master", "Protein Pro")
- [ ] Weekly challenges and goals
- [ ] Point system with leaderboard
- [ ] Daily check-in when meals are eaten

### Advanced Profiles
- [ ] Parent/guardian login system with authentication
- [ ] Dietary restriction management (gluten-free, vegan, allergies)
- [ ] Favorite foods tracking
- [ ] Child growth tracking

### Meal Planning Enhancements
- [ ] Breakfast and dinner slots (currently lunch only)
- [ ] Recipe suggestions with cooking instructions
- [ ] Portion size calculator
- [ ] Calorie and macro tracking
- [ ] Copy previous successful weeks
- [ ] Meal prep mode with batch cooking

### Social Features
- [ ] Share meal plans with friends
- [ ] Community recipes
- [ ] Parent groups and tips
- [ ] Meal plan templates library

### Technical Improvements
- [ ] Offline mode with sync
- [ ] Push notifications for meal reminders
- [ ] Integration with grocery delivery services
- [ ] Export to calendar apps
- [ ] Barcode scanner for adding custom foods
- [ ] Voice input for hands-free planning

---

## 🎓 Educational Value

This app helps children:
- **Learn** about nutrition and food groups
- **Develop** planning and decision-making skills
- **Practice** responsibility and independence
- **Understand** balance and variety in diet
- **Build** healthy eating habits early

---

## 🚀 Deployment

To make this app live and accessible online:

1. Go to the **Publish tab** in your development environment
2. Click the publish button
3. Share the generated URL with families

The app is fully static and serverless, making deployment instant and scalable.

---

## 🔒 Privacy & Data

- **Password Protection**: Parent View requires password `1580` to prevent child access
- **Basic Security**: Client-side password check (suitable for ages 4-8, not cryptographic)
- **User data** stored in cloud database with unique IDs
- **No personal information** beyond name/age required
- **Parent control** - all data viewable in parent dashboard
- **Data persistence** - meal plans saved automatically

**Note**: The password is a deterrent for young children, not a security measure for sensitive data. It's visible in client-side code and can be changed by editing `js/app.js` line 765.

---

## 📈 Recommended Next Steps

1. **User Testing**: Have children aged 4-8 test the enhanced interface with all 7 features
2. **Parent Feedback**: Gather insights on custom rules and food limit usefulness
3. **Audio Content**: Create/source appropriate sound effects and background music
4. **Food Database Expansion**: Add 20-30 more food items based on user preferences
5. **Composite Builder Expansion**: Add more builders (burrito, pizza, smoothie)
6. **Mobile App**: Consider native mobile app for better touch and offline experience
7. **Tutorial Mode**: Add first-time user walkthrough for parent settings
8. **Nutritionist Review**: Validate health scoring and rule defaults
9. **Accessibility**: Add screen reader support and keyboard navigation
10. **Performance Testing**: Test auto-save with large meal plans
11. **A/B Testing**: Test guidance system effectiveness with different age groups

---

## 🐛 Known Issues / Limitations

- **Sound Files Optional**: Audio features require MP3 files in `sounds/` folder (app works without them)
- **Shopping List Quantities**: Counts ingredient occurrences rather than specific portions
- **Print Functionality**: Prints entire page (not just shopping list)
- **Avatar Animations**: Simple CSS transitions (could be enhanced with Lottie/SVG)
- **Browser Autoplay Policy**: Background music may require user interaction to start
- **Undo Limit**: Only 5 steps (older states are lost)
- **Session-Based Undo**: Undo history clears on page refresh

---

## 🙏 Credits

- **Emoji Icons**: Native system emojis for universal compatibility
- **Font**: Fredoka by Google Fonts (kid-friendly, rounded sans-serif)
- **Color Scheme**: Purple/pink gradient for playful, engaging atmosphere
- **Design Pattern**: Drag-and-drop from HTML5 native API

---

## 📞 Support

For questions, issues, or feature requests:
- Check the Parent View for nutritional guidance
- Review this README for feature documentation
- Test on different devices for best experience

---

## 🎉 Success Metrics

**MVP Goals Achieved:**
- ✅ Drag-and-drop meal planning interface
- ✅ Visual health feedback system
- ✅ Parent dashboard with insights
- ✅ Cloud-based data persistence
- ✅ Shopping list generation
- ✅ Animated, engaging UI for children
- ✅ Mobile-responsive design

**Enhanced Features Achieved (All 7!):**
- ✅ Parental customization with custom foods and limits
- ✅ Advanced rule engine with real-time validation
- ✅ Categorized inventory with tab-based navigation
- ✅ Smart guidance with AI suggestions
- ✅ Sound layer with 7 audio types
- ✅ Hierarchical composite food builders
- ✅ Auto-save and 5-step undo system

**Language Features Achieved:**
- ✅ Full bilingual support (Hebrew + English)
- ✅ 57 food items with bilingual names
- ✅ 100+ UI translations
- ✅ RTL layout support
- ✅ Live language switching
- ✅ 6 food categories including Snacks

**Code Statistics:**
- Total Lines: ~2,500+ lines of JavaScript
- Modules: 6 separate files for clean architecture
- Database Tables: 7 tables (users, food_items, custom_foods, composite_items, rules, meal_plans, shopping_lists)
- Features: 40+ distinct features implemented
- API Endpoints: 25+ RESTful endpoints

**Ready for Advanced Production Use!** 🚀✨

---

*Built with ❤️ for healthy, happy kids!*
