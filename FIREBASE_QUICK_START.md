# 🚀 Firebase Quick Start - Get Running in 15 Minutes

**Super fast guide to get your MVP working TODAY**

---

## ⚡ 3-Step Setup

### Step 1: Create Firebase Project (3 min)
1. Go to https://console.firebase.google.com/
2. Click "Create a project"
3. Name: `kids-meal-planner`
4. Disable Google Analytics
5. Click "Create project"

### Step 2: Enable Firestore (2 min)
1. Left sidebar → "Firestore Database"
2. Click "Create database"
3. Select "Start in test mode"
4. Choose location closest to you
5. Click "Enable"

### Step 3: Get Configuration (5 min)
1. Click ⚙️ gear icon → "Project settings"
2. Scroll to "Your apps" → Click **</>** icon
3. App nickname: `Kids Meal Planner Web`
4. Click "Register app"
5. **COPY the firebaseConfig object!**

6. Open `js/firebase-config.js`
7. Replace placeholder config with your copied config
8. Save file

---

## 🌱 Seed Database (3 min)

1. Open `seed-database.html` in browser
2. Click "🍎 Seed Food Items (57)"
3. Click "🏗️ Seed Composite Items (3)"
4. Click "✅ Verify Database"
5. Should see green checkmarks!

---

## 🎉 Test It! (2 min)

1. Open `index.html` in browser
2. Click "👤 Profile"
3. Enter name and age
4. Click "💾 Save Profile"
5. Drag a food item to any day
6. Wait 2 seconds (auto-save)
7. Refresh page
8. **If your meal is still there = SUCCESS!** 🎊

---

## 🌍 Deploy (Optional - 5 min later)

```bash
npm install -g firebase-tools
firebase login
cd /path/to/webapp
firebase init
# Select: Hosting, existing project, . (dot), Yes, No, No
firebase deploy
```

Your live URL: `https://your-project-id.web.app` 🚀

---

## ❓ Problems?

**Food items not loading?**
- Check browser console (F12) for errors
- Verify firebase-config.js has your real credentials
- Re-run seed-database.html

**Can't save meals?**
- Create a profile first (Profile button)
- Check Firebase Console → Firestore Database for data

**Other issues?**
See full guide: `FIREBASE_SETUP_GUIDE.md`

---

## ✅ You're Done!

App should be working locally. Deploy when ready!

**Total time: 15 minutes** ⏱️
