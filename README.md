# 🍱 Kids' Meal Planner

A fun, interactive weekly meal planner designed for children aged 4-12. This app helps kids plan their breakfast boxes with parental guidance, teaching healthy eating habits through an engaging, colorful interface.

## ✨ Features

- **Interactive Drag & Drop**: Easy meal planning with colorful food items
- **Bilingual Support**: English and Hebrew interfaces
- **Parental Controls**: Password-protected settings and rules
- **Health Tracking**: Visual health meter based on nutritional balance
- **Custom Foods**: Add your own food items with custom icons
- **Offline Support**: Queue changes when offline, sync when reconnected
- **Auto-save & Undo**: Automatic saving with undo/redo functionality
- **Mobile Friendly**: Touch-optimized for tablets and phones
- **Android App**: Native Android app with offline support
- **Progressive Web App (PWA)**: Installable on mobile devices
- **Sound Effects**: Optional audio feedback for actions
- **Print Support**: Print weekly meal plans

## 🚀 Quick Start

### Option 1: Launch from Terminal (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/thamam/meal-planner.git
   cd meal-planner
   ```

2. **Start the app**
   ```bash
   ./start.sh
   ```

   Or manually with Python:
   ```bash
   python3 -m http.server 8000
   # Then open http://localhost:8000
   ```

   Or with Node.js:
   ```bash
   npx http-server -p 8000
   # Then open http://localhost:8000
   ```

3. **Start planning!**
   - Create a user profile
   - Drag and drop foods into meal slots
   - Track your weekly nutrition

> **Note**: Running locally will use mock data. For persistent storage across devices, set up Firebase (see below).

### Option 2: Open Directly (Simple)

- Simply double-click `index.html` or
- Open `index.html` in your browser

> **Note**: Some browsers may block certain features when opening HTML files directly. Using a local server (Option 1) is recommended.

### Option 3: With Firebase (Recommended for Production)

1. **Set up Firebase**
   - Follow the [Firebase Setup Guide](docs/setup/FIREBASE_SETUP_GUIDE.md)
   - Get your Firebase config from [this guide](docs/setup/HOW_TO_GET_FIREBASE_CONFIG.md)

2. **Configure**
   - Edit `js/core/firebase-config.js` with your Firebase credentials
   - See [Firebase Quick Start](docs/setup/FIREBASE_QUICK_START.md)

3. **Seed the database** (optional)
   - Open `tools/seed-database.html` in your browser
   - Click "Seed Database" to load default foods

4. **Deploy**
   - Upload to your web server or use Firebase Hosting
   - See [Getting Started Guide](docs/setup/GETTING_STARTED.md)

### Option 4: Android App 📱

Build and install the native Android app:

1. **Prerequisites**
   - Java 17+ installed
   - Android SDK (optional, for advanced features)

2. **Build the APK**
   ```bash
   cd android
   ./build-android.sh
   ```

3. **Install on device**
   ```bash
   ./build-android.sh --install
   ```

   Or manually:
   ```bash
   adb install -r meal-planner-debug.apk
   ```

4. **For detailed instructions**
   - See [Android App README](android/README.md)

**Features:**
- ✅ Native Android app experience
- ✅ Offline support with caching
- ✅ Pull to refresh
- ✅ Splash screen
- ✅ Back button navigation
- ✅ Deep linking support

## 📚 Documentation

### For Users
- **[Getting Started](docs/setup/GETTING_STARTED.md)** - Complete setup instructions
- **[Parent Guide](docs/guides/PARENT_GUIDE.md)** - Managing rules and settings
- **[Controls Guide](docs/guides/CONTROLS-GUIDE.md)** - How to use the app

### For Developers
- **[Developer Guide](docs/guides/DEVELOPER_GUIDE.md)** - Architecture and code structure
- **[Implementation Guide](docs/development/IMPLEMENTATION_GUIDE.md)** - Technical details
- **[Project Status](docs/development/PROJECT_STATUS.md)** - Current state and roadmap

### Features
- **[Bilingual Support](docs/guides/features/LANGUAGE-SUPPORT.md)** - English/Hebrew
- **[Custom Foods](docs/guides/features/AUTO-ICON-FEATURE-GUIDE.md)** - Add your own items
- **[CSV Import](docs/guides/features/CSV-IMPORT-GUIDE.md)** - Bulk import foods
- **[Composite Items](docs/guides/features/COMPOSITE-ITEMS-MANAGEMENT-GUIDE.md)** - Manage complex foods
- **[Sound Effects](docs/guides/features/SOUND-FILES-GUIDE.md)** - Audio feedback setup

### More Documentation
See the **[docs/](docs/)** directory for complete documentation organized by topic.

## 🗂️ Project Structure

```
meal-planner/
├── index.html              # Main app entry point
├── README.md               # This file
├── LICENSE.md              # MIT License
│
├── css/                    # Stylesheets
│   └── print.css          # Print-specific styles
│
├── js/                     # JavaScript
│   ├── core/              # Core application files
│   │   ├── app.js         # Main application logic
│   │   ├── firebase-api.js # Firebase integration
│   │   └── firebase-config.js # Firebase configuration
│   ├── modules/           # Feature modules
│   │   ├── autosave-undo.js
│   │   ├── categorized-view.js
│   │   ├── guidance.js
│   │   ├── i18n.js        # Internationalization
│   │   ├── rules.js
│   │   └── sounds.js
│   └── utils/             # Utility functions
│       ├── auth.js        # Authentication
│       ├── error-handler.js
│       ├── modal.js
│       ├── offline-support.js
│       ├── security.js
│       └── state-manager.js
│
├── docs/                   # Documentation
│   ├── setup/             # Setup guides
│   ├── guides/            # User and developer guides
│   │   └── features/      # Feature-specific guides
│   └── development/       # Development documentation
│       └── audits/        # Code audits and fixes
│
├── tools/                  # Database and testing tools
│   ├── seed-database.html
│   ├── update-food-database.html
│   └── test-*.html
│
├── data/                   # Data files
│   └── *.csv              # Default food data
│
└── archive/                # Old files and backups
```

## 🎮 How to Use

1. **Create a Profile**
   - Enter child's name and age (4-12)
   - Choose an avatar

2. **Plan Meals**
   - Drag food items from the palette to meal slots
   - Each weekday has breakfast, snack, and lunch slots
   - Watch the health meter to maintain balance

3. **Parental Features**
   - Switch to "Parent" tab (password protected)
   - Set rules (e.g., max sweets per week)
   - Manage custom foods
   - View weekly summaries

4. **Custom Foods**
   - Add foods not in the default palette
   - Choose categories and icons
   - Set weekly limits

5. **Print & Share**
   - Use Print button for a printer-friendly version
   - Share your meal plan with family

## 🛠️ Technology Stack

- **Frontend**: Vanilla JavaScript (ES6+)
- **Styling**: Tailwind CSS
- **Backend**: Firebase Firestore (optional)
- **Architecture**: Modular, event-driven
- **Security**: Input validation, XSS prevention, password hashing

## 🔒 Security Features

- **Parent Authentication**: SHA-256 password hashing
- **Input Validation**: All user inputs sanitized
- **XSS Protection**: HTML escaping on all dynamic content
- **Offline Queue Security**: Serializable operations only
- **Firebase Security Rules**: Configured for user isolation

See [Firebase Security Guide](docs/setup/FIREBASE_SECURITY.md) for details.

## 🌐 Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

This is a personal project, but suggestions and bug reports are welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 Changelog

See **[CHANGELOG.md](docs/CHANGELOG.md)** for version history and updates.

## 📄 License

This project is licensed under the MIT License - see [LICENSE.md](LICENSE.md) for details.

## 🆘 Support & Issues

- **Documentation**: Check the [docs/](docs/) directory
- **Issues**: Report bugs or request features via GitHub Issues
- **Setup Help**: See [Getting Started Guide](docs/setup/GETTING_STARTED.md)

## 👨‍👩‍👧‍👦 About

Created to help parents engage children in healthy eating habits through interactive meal planning. Designed with input from parents and nutritionists.

---

**Made with ❤️ for healthy, happy kids!**
