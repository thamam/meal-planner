# 🔥 How to Get Your Firebase Configuration

**Quick reference guide for retrieving Firebase credentials**

---

## 📍 Your Current Status

✅ **Good news!** Your Firebase config is already in the code:
- Project: `kids-meal-planner`
- API Key: `AIzaSyAHciw1eLjoij-TWHZ3_IO3KS8mv4IPnaA`
- Project ID: `kids-meal-planner`

**You don't need to get it again unless you want to verify it or create a new project.**

---

## 🎯 How to Get Firebase Config (Step-by-Step)

### Step 1: Go to Firebase Console
Open in your browser:
```
https://console.firebase.google.com/
```

### Step 2: Select Your Project
- You should see **"kids-meal-planner"** in the list
- Click on it to open the project

### Step 3: Open Project Settings
Two ways to do this:

**Method A:**
- Click the **⚙️ gear icon** (top left, next to "Project Overview")
- Click **"Project settings"**

**Method B:**
- Look for "Project settings" in the left sidebar
- Click it directly

### Step 4: Scroll to "Your apps"
- Scroll down the page
- Find the section titled **"Your apps"**
- You should see a web app icon **</>** with "Kids Meal Planner Web"

### Step 5: View Configuration
- Under your web app, you'll see **"Config"** (might need to expand)
- Or click **"SDK setup and configuration"** tab
- Select **"Config"** radio button (not "npm")

### Step 6: Copy the Configuration
You'll see JavaScript code like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyAHciw1eLjoij-TWHZ3_IO3KS8mv4IPnaA",
  authDomain: "kids-meal-planner.firebaseapp.com",
  projectId: "kids-meal-planner",
  storageBucket: "kids-meal-planner.firebasestorage.app",
  messagingSenderId: "530830532763",
  appId: "1:530830532763:web:4afbf9007596beee2ce63e"
};
```

**Important:** Copy the entire `firebaseConfig = { ... }` object, including the curly braces!

---

## 📋 What Each Field Means

| Field | Purpose | Example |
|-------|---------|---------|
| `apiKey` | Identifies your app to Firebase | `AIzaSyA...` |
| `authDomain` | Authentication domain | `your-project.firebaseapp.com` |
| `projectId` | Unique project identifier | `kids-meal-planner` |
| `storageBucket` | Cloud storage location | `your-project.appspot.com` |
| `messagingSenderId` | For push notifications | `123456789012` |
| `appId` | Unique app identifier | `1:123456789012:web:abc123` |

---

## 🔄 If You Don't See a Web App

If the "Your apps" section is empty:

### Create a New Web App

1. In the "Your apps" section, click the **</>** icon (web app icon)
2. Enter app nickname: `Kids Meal Planner Web`
3. **DON'T** check "Also set up Firebase Hosting" yet
4. Click **"Register app"**
5. Your config will appear on the next screen
6. Copy the `firebaseConfig` object
7. Click **"Continue to console"**

---

## 📝 How to Use the Config

### Where to Put It

The config goes in: `js/firebase-config.js`

### What to Replace

Find these lines (around line 7-13):
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",  // ← Replace these
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

Replace with your actual values:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyAHciw1eLjoij-TWHZ3_IO3KS8mv4IPnaA",
  authDomain: "kids-meal-planner.firebaseapp.com",
  projectId: "kids-meal-planner",
  storageBucket: "kids-meal-planner.firebasestorage.app",
  messagingSenderId: "530830532763",
  appId: "1:530830532763:web:4afbf9007596beee2ce63e"
};
```

**Note:** Your values are already in the file! This is just for reference.

---

## 🔒 Security Notes

### Is it Safe to Share?

**API Key**: 
- ✅ Safe to include in client-side code
- ✅ Protected by Firebase security rules
- ⚠️ Don't share publicly on internet/GitHub public repos

**Other Fields**:
- ✅ Safe to include in your code
- These identify your project but don't grant access

**Real Security**:
- Comes from Firestore Security Rules
- Set these in Firebase Console → Firestore Database → Rules

---

## ✅ Quick Verification

To check if your config is correct:

1. Open your app in browser
2. Press **F12** (open console)
3. Look for: **"🔥 Firebase initialized successfully"**
4. If you see it = Config is correct! ✅
5. If you see "Firebase not defined" = Config issue ❌

---

## 🆘 Common Issues

### "Firebase project not found"
**Cause**: Wrong project ID  
**Fix**: Double-check projectId matches your Firebase Console

### "API key not valid"
**Cause**: Typo in API key  
**Fix**: Copy-paste carefully from Firebase Console

### "Domain not authorized"
**Cause**: Running from file:// protocol  
**Fix**: Use a local web server (I've started one for you!)

---

## 🔗 Quick Links

**Firebase Console**: https://console.firebase.google.com/  
**Your Project**: https://console.firebase.google.com/project/kids-meal-planner  
**Firestore Database**: https://console.firebase.google.com/project/kids-meal-planner/firestore  

---

## 📞 Still Need Help?

Your config is **already working** in the code. If you're having issues:

1. Check the browser console (F12) for errors
2. Verify Firestore is in "test mode" (Firebase Console → Firestore → Rules)
3. Make sure you seeded the database (run seed-database.html)

---

*Your Firebase credentials are safe and already configured!*  
*This guide is just for reference if you need them again.*
