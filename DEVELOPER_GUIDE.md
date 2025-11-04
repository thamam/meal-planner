# 👩‍💻 Developer Guide - Kids' Meal Planner

A technical guide for developers who want to understand, modify, or extend the Kids' Meal Planner application.

---

## 🏗️ Architecture Overview

### Tech Stack
```
Frontend Layer:
├── HTML5 (Semantic structure)
├── Tailwind CSS (Utility-first styling)
├── Vanilla JavaScript (ES6+)
└── Google Fonts (Fredoka)

Data Layer:
├── RESTful Table API (Cloud database)
├── localStorage (Session management)
└── JSON (Data serialization)
```

### File Structure
```
kids-meal-planner/
│
├── index.html              # Main application entry point
│
├── js/
│   └── app.js             # Core application logic
│
├── css/
│   └── print.css          # Print-specific styles
│
├── README.md              # Technical documentation
├── PARENT_GUIDE.md        # Parent user guide
├── PROJECT_SUMMARY.md     # Project overview
├── DEMO_INSTRUCTIONS.md   # Testing guide
├── CHANGELOG.md           # Version history
├── LICENSE.md             # License information
└── DEVELOPER_GUIDE.md     # This file
```

---

## 🔧 Development Setup

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Text editor or IDE (VS Code recommended)
- Basic knowledge of HTML, CSS, JavaScript
- Internet connection (for CDN and API)

### Local Development
```bash
# 1. Clone or download the project
cd kids-meal-planner

# 2. Open in browser
# Simply open index.html in your browser
# OR use a local server:
python -m http.server 8000
# OR
npx serve

# 3. Access at http://localhost:8000
```

### No Build Process Required!
- Pure vanilla JavaScript (no transpilation)
- CDN-based dependencies (no npm install)
- Static files only (no server required)
- Instant development feedback

---

## 📂 Code Organization

### index.html Structure
```html
<!DOCTYPE html>
<html>
  <head>
    <!-- Meta tags, title -->
    <!-- Tailwind CSS CDN -->
    <!-- Google Fonts -->
    <!-- Print stylesheet -->
    <!-- Inline styles for animations -->
  </head>
  <body>
    <!-- Header with logo & profile -->
    <!-- Tab navigation -->
    <!-- Planner tab (child view) -->
    <!-- Parent tab (parent view) -->
    <!-- Profile modal -->
    <!-- Welcome screen -->
    <!-- Main app.js script -->
  </body>
</html>
```

### app.js Architecture
```javascript
// Global State
- currentUser
- foodItems
- weeklyMeals
- selectedAvatar

// Initialization
- DOMContentLoaded event
- loadUserFromStorage()
- loadFoodItems()
- renderFoodPalette()
- renderWeeklyPlan()

// Modules (by functionality)
1. User Profile Management
2. Food Items Management
3. Weekly Plan Grid
4. Drag & Drop Handlers
5. Health Meter
6. Avatar Animation
7. Save/Load Meal Plans
8. Tab Navigation
9. Parent View
10. Utility Functions
```

---

## 🗄️ Database Schema

### API Endpoints Pattern
```javascript
// Base URL: relative paths (e.g., 'tables/users')

// List records
GET tables/{table}?page=1&limit=100&search=query&sort=field

// Get single record
GET tables/{table}/{id}

// Create record
POST tables/{table}
Body: { field1: value1, field2: value2 }

// Update record (full)
PUT tables/{table}/{id}
Body: { all_fields: values }

// Update record (partial)
PATCH tables/{table}/{id}
Body: { field_to_update: new_value }

// Delete record (soft delete)
DELETE tables/{table}/{id}
```

### Table Schemas

#### Users
```javascript
{
  id: "auto-generated-uuid",
  name: "string",
  age: number,
  avatar: "emoji-string",
  preferences: "json-string",
  created_at: timestamp,
  updated_at: timestamp
}
```

#### Food Items
```javascript
{
  id: "food_001",
  name: "string",
  category: "protein|veggie|fruit|grain|dairy",
  icon: "emoji",
  nutrition_score: number (1-5),
  ingredients: "json-array-string"
}
```

#### Meal Plans
```javascript
{
  id: "auto-generated-uuid",
  user_id: "user-uuid",
  week_start: "YYYY-MM-DD",
  meals: "json-object-string",
  created_at: timestamp,
  updated_at: timestamp
}
```

#### Shopping Lists
```javascript
{
  id: "auto-generated-uuid",
  user_id: "user-uuid",
  week_start: "YYYY-MM-DD",
  items: "json-object-string",
  created_at_readable: "M/D/YYYY",
  created_at: timestamp,
  updated_at: timestamp
}
```

---

## 🔄 Data Flow

### Save Meal Plan Flow
```
User clicks "Save"
  ↓
saveMealPlan() called
  ↓
Check if currentUser exists
  ↓
Get current week's Monday date
  ↓
Check if plan exists for this week
  ↓
  ├─ Exists? → PUT (update)
  └─ New? → POST (create)
  ↓
Serialize weeklyMeals to JSON
  ↓
Send to API tables/meal_plans
  ↓
Show success/error message
```

### Load Meal Plan Flow
```
Page loads / User clicks "Load"
  ↓
Check currentUser from localStorage
  ↓
Get current week's Monday
  ↓
Fetch tables/meal_plans?search={user_id}
  ↓
Filter by user_id and week_start
  ↓
  ├─ Found? → Parse JSON meals
  └─ Not found? → Show info message
  ↓
Update weeklyMeals global state
  ↓
Call updateWeeklyPlanDisplay()
  ↓
Render UI with meals
```

### Health Meter Calculation
```
User drops food in meal slot
  ↓
updateWeeklyPlanDisplay() called
  ↓
updateHealthMeter() called
  ↓
Count categories:
  - Loop through all days
  - Loop through meals per day
  - Increment category counters
  ↓
Calculate scores:
  - Protein: (count/3) × 20
  - Veggie: (count/5) × 20
  - Fruit: (count/5) × 20
  - Grain: (count/3) × 20
  - Dairy: (count/3) × 20
  ↓
Sum total (max 100)
  ↓
Update UI:
  - Health fill width
  - Color (red/yellow/green)
  - Percentage display
  ↓
Animate avatar based on score
```

---

## 🎨 Styling System

### Tailwind CSS Classes Used
```css
/* Layout */
.max-w-7xl, .mx-auto, .grid, .flex, .space-y-6

/* Colors */
.bg-purple-{100-600}, .text-{color}-{shade}

/* Typography */
.text-{size}, .font-{weight}

/* Spacing */
.p-{size}, .m-{size}, .gap-{size}

/* Borders */
.rounded-{size}, .border-{width}

/* Effects */
.shadow-{size}, .hover:{property}, .transition
```

### Custom CSS (in index.html)
```css
/* Drag & Drop */
.food-item { cursor: grab; transition: transform 0.2s; }
.food-item:hover { transform: scale(1.1) rotate(5deg); }
.meal-slot.drag-over { background: #fef3c7; }

/* Health Meter */
.health-meter { height: 30px; border-radius: 15px; }
.health-fill { transition: width 0.5s, background 0.5s; }

/* Animations */
@keyframes bounce { ... }
@keyframes happy { ... }
@keyframes sad { ... }
```

---

## 🧩 Key Functions Reference

### Core Functions
```javascript
// Initialization
loadUserFromStorage()          // Load user from localStorage
loadFoodItems()                 // Fetch food items from API
renderFoodPalette()             // Display food items
renderWeeklyPlan()              // Create weekly grid

// User Management
showProfileModal()              // Open profile dialog
saveProfile()                   // Save user to API & localStorage
updateUserDisplay()             // Update header with user info

// Meal Planning
handleDragStart(e)              // Start drag operation
handleDrop(e)                   // Drop food on day
removeMeal(day, mealId)         // Remove food from day
updateWeeklyPlanDisplay()       // Re-render weekly grid

// Health Tracking
updateHealthMeter()             // Calculate & display balance
animateAvatar(emotion)          // Trigger avatar animation

// Data Persistence
saveMealPlan()                  // Save to API
loadMealPlan()                  // Load from API
autoLoadMealPlan()              // Auto-load on init

// Parent Features
switchTab(tab)                  // Switch between views
generateShoppingList()          // Create shopping list
updateNutritionalInsights()     // Generate recommendations

// Utilities
getMonday(date)                 // Get week's Monday
showMessage(msg, type)          // Toast notification
```

---

## 🔌 Adding New Features

### Adding a New Food Item
```javascript
// Option 1: Via API (recommended for production)
await fetch('tables/food_items', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    id: "food_025",
    name: "Sweet Potato",
    category: "veggie",
    icon: "🍠",
    nutrition_score: 5,
    ingredients: JSON.stringify(["sweet potato"])
  })
});

// Option 2: Via TableDataAdd tool (for bulk)
// Use TableDataAdd with array of food objects
```

### Adding a New Meal Type (e.g., Breakfast)
```javascript
// 1. Update weeklyMeals structure in app.js
let weeklyMeals = {
  monday: { breakfast: [], lunch: [] },
  tuesday: { breakfast: [], lunch: [] },
  // ...
};

// 2. Update renderWeeklyPlan() to create multiple slots
// 3. Modify handleDrop() to specify meal type
// 4. Adjust updateHealthMeter() to count all meal types
// 5. Update save/load functions for new structure
```

### Adding an Achievement Badge
```javascript
// 1. Create badges array
const badges = [
  { id: "veggie_master", name: "Veggie Master", icon: "🥦", requirement: "5+ veggies in a week" },
  // ...
];

// 2. Add checkAchievements() function
function checkAchievements() {
  // Count categories from weeklyMeals
  // Compare against badge requirements
  // Award new badges
  // Store in user profile
}

// 3. Display badges in profile
// 4. Animate on earning new badge
```

### Adding Dietary Restrictions
```javascript
// 1. Add to user preferences
preferences: JSON.stringify({
  allergies: ["peanuts", "dairy"],
  diet_type: "vegetarian"
});

// 2. Filter food items in renderFoodPalette()
const filteredFoods = foodItems.filter(food => {
  // Check against user preferences
  return !hasAllergen(food, currentUser.preferences);
});

// 3. Add restriction badges to food items
// 4. Show warnings when planning
```

---

## 🧪 Testing Approaches

### Manual Testing
```javascript
// 1. Profile Creation
// - Create with valid data
// - Try without name/age
// - Switch avatars
// - Save and reload page

// 2. Drag & Drop
// - Drag to each day
// - Multiple foods per day
// - Same food multiple times
// - Remove foods

// 3. Health Meter
// - Only one category
// - All categories balanced
// - Empty week
// - Over-target in one category

// 4. Save/Load
// - Save empty week
// - Save full week
// - Load existing plan
// - Multiple users

// 5. Parent View
// - Generate empty list
// - Generate full list
// - Print functionality
// - Insights accuracy
```

### Automated Testing (Future)
```javascript
// Consider adding:
// - Jest for unit tests
// - Cypress for E2E tests
// - Testing Library for DOM testing

// Example unit test structure:
describe('Health Meter', () => {
  test('calculates 100% for balanced week', () => {
    const score = calculateHealthScore({
      protein: 3, veggie: 5, fruit: 5, grain: 3, dairy: 3
    });
    expect(score).toBe(100);
  });
});
```

---

## 🐛 Debugging Tips

### Common Issues & Solutions

#### "Food items not loading"
```javascript
// Debug steps:
console.log('Food items:', foodItems.length);
// Check network tab for API response
// Verify table has data: TableSchemaRead('food_items')
// Check for CORS errors
```

#### "Drag & drop not working"
```javascript
// Debug steps:
console.log('Drag started:', draggedElement);
// Check if draggable="true" on elements
// Verify event handlers attached
// Test on different browsers
// Check touch events for mobile
```

#### "Save not persisting"
```javascript
// Debug steps:
console.log('Current user:', currentUser);
console.log('Meals to save:', weeklyMeals);
// Check network tab for API call
// Verify response status
// Check user_id matches
// Ensure internet connection
```

### Browser Console Commands
```javascript
// Check current state
console.log(currentUser);
console.log(weeklyMeals);
console.log(foodItems);

// Test functions directly
saveMealPlan();
loadMealPlan();
updateHealthMeter();

// Clear localStorage (reset app)
localStorage.clear();
location.reload();
```

---

## 🚀 Performance Optimization

### Current Performance
- Initial load: < 2 seconds
- Drag response: < 50ms
- API calls: Async, non-blocking
- Animations: 60 FPS (CSS-based)

### Optimization Opportunities
```javascript
// 1. Debounce save operations
let saveTimeout;
function debouncedSave() {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(saveMealPlan, 2000);
}

// 2. Cache food items
if (localStorage.getItem('foodItemsCache')) {
  foodItems = JSON.parse(localStorage.getItem('foodItemsCache'));
} else {
  await loadFoodItems();
  localStorage.setItem('foodItemsCache', JSON.stringify(foodItems));
}

// 3. Lazy load images (if adding photos)
<img loading="lazy" src="...">

// 4. Minimize DOM manipulation
// Use DocumentFragment for batch updates
```

---

## 📦 Deployment Options

### Static Hosting (Recommended)
- ✅ Netlify: Drag & drop folder
- ✅ Vercel: Connect to Git repo
- ✅ GitHub Pages: Push to gh-pages branch
- ✅ Cloudflare Pages: Connect to Git

### Configuration
```yaml
# netlify.toml
[build]
  publish = "."

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Environment Variables
```javascript
// No env variables needed for MVP
// Future: API keys, analytics, etc.
```

---

## 🔐 Security Considerations

### Current Security
- ✅ No authentication (deliberate for simplicity)
- ✅ No sensitive data collected
- ✅ Client-side only (no server vulnerabilities)
- ✅ API uses UUID for user identification

### Future Security (V2.0+)
- Add authentication for parent accounts
- Implement rate limiting on API
- Sanitize user inputs
- Add CAPTCHA for profile creation
- Encrypt sensitive preferences

---

## 🌐 Internationalization (i18n)

### Current: English Only

### Adding New Language
```javascript
// 1. Create language file
const translations = {
  en: {
    title: "Kids' Meal Planner",
    save: "Save",
    // ...
  },
  es: {
    title: "Planificador de Comidas para Niños",
    save: "Guardar",
    // ...
  }
};

// 2. Add language selector
function setLanguage(lang) {
  currentLanguage = lang;
  updateUITexts();
}

// 3. Update all UI text
document.getElementById('saveButton').textContent = translations[currentLanguage].save;
```

---

## 📊 Analytics Integration (Future)

### Recommended Analytics
```javascript
// Google Analytics 4
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>

// Track events
function trackMealPlanSaved() {
  gtag('event', 'meal_plan_saved', {
    'user_age': currentUser.age,
    'week_balance': calculateHealthScore()
  });
}

// Privacy: Ensure GDPR compliance
// - Cookie consent banner
// - Anonymize IP addresses
// - Parent control over analytics
```

---

## 🤝 Contributing Guidelines

### Code Style
- Use ES6+ features
- Descriptive variable names
- Comment complex logic
- Follow existing patterns
- Keep functions small and focused

### Git Workflow (if using version control)
```bash
# 1. Create feature branch
git checkout -b feature/breakfast-planning

# 2. Make changes and test
# 3. Commit with clear message
git commit -m "Add breakfast meal type to planner"

# 4. Push and create pull request
git push origin feature/breakfast-planning
```

### Pull Request Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] New feature
- [ ] Bug fix
- [ ] Documentation update
- [ ] Performance improvement

## Testing
- [ ] Tested on desktop
- [ ] Tested on mobile
- [ ] Tested on multiple browsers
- [ ] Added/updated tests

## Screenshots (if applicable)
```

---

## 📚 Resources & References

### Documentation
- [MDN Web Docs](https://developer.mozilla.org/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [HTML5 Drag and Drop API](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API)

### Nutrition Resources
- [USDA Food Database](https://fdc.nal.usda.gov/)
- [MyPlate Guidelines](https://www.myplate.gov/)
- [CDC Child Nutrition](https://www.cdc.gov/nutrition/)

### Design Inspiration
- [Dribbble - Kids Apps](https://dribbble.com/search/kids-app)
- [Behance - Educational Apps](https://www.behance.net/search/projects?search=educational+app)

---

## 🎓 Learning Path

### For Beginners
1. Study HTML structure in index.html
2. Understand Tailwind utility classes
3. Learn JavaScript event handling
4. Practice with drag & drop API
5. Explore fetch API for data

### For Intermediate
1. Refactor code into modules
2. Add TypeScript for type safety
3. Implement state management (Redux)
4. Add automated testing
5. Optimize performance

### For Advanced
1. Build React version
2. Create native mobile apps
3. Implement real-time sync
4. Add AI meal suggestions
5. Scale for thousands of users

---

## 💡 Tips & Best Practices

### Development
- ✅ Test on real devices, not just emulator
- ✅ Use browser DevTools effectively
- ✅ Keep code DRY (Don't Repeat Yourself)
- ✅ Comment non-obvious logic
- ✅ Version control everything

### User Experience
- ✅ Think like a child (target age 4-8)
- ✅ Make interactions forgiving
- ✅ Provide immediate feedback
- ✅ Use simple, clear language
- ✅ Test with actual kids!

### Data Management
- ✅ Always validate user input
- ✅ Handle API errors gracefully
- ✅ Provide offline fallbacks
- ✅ Don't lose user data
- ✅ Make save operations explicit

---

## 🐞 Known Limitations

### Technical
- No offline mode (requires internet)
- No undo/redo functionality
- Limited to 5 weekdays
- Single meal type (lunch only)
- No batch operations

### UX
- No onboarding tutorial
- Limited avatar customization
- No food search/filter
- Print layouts could be better
- No keyboard shortcuts

### Data
- No data export (besides print)
- No historical analytics
- No meal plan templates
- No favorite meals saving

---

## 🔮 Architecture for V2.0

### Recommended Upgrades
```javascript
// 1. Component-based architecture
// Use React, Vue, or Web Components

// 2. State management
// Redux, MobX, or Context API

// 3. TypeScript
// Type safety for better DX

// 4. Testing framework
// Jest + React Testing Library

// 5. Build process
// Webpack, Vite, or Parcel

// 6. Backend
// Node.js + Express + PostgreSQL
// Or serverless with Supabase/Firebase
```

---

## 📞 Support & Questions

### Self-Help
1. Check this developer guide
2. Review README.md
3. Search through code comments
4. Check browser console for errors

### Community (Future)
- GitHub Issues (if open source)
- Discord server
- Stack Overflow tag
- Reddit community

---

*Happy coding! Build something amazing for kids! 🚀*
