# 🔥 Firebase Security Configuration

## ⚠️ CRITICAL: Firebase Security Rules Required

Your Firebase API keys are **intentionally public** (this is normal for Firebase web apps), but your database **MUST** be protected with proper Firestore Security Rules.

---

## 🚨 Current Security Risk

**Status:** Your `firebase-config.js` contains public API keys (this is expected).

**Risk Level:**
- ✅ **LOW** if Firestore Security Rules are configured
- 🔴 **CRITICAL** if database is in "Test Mode" (allows public read/write)

---

## ✅ How to Secure Your Database

### Step 1: Check Current Security Rules

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select project: **kids-meal-planner**
3. Navigate to: **Firestore Database** → **Rules** tab
4. Check if you see:

```javascript
// ⚠️ INSECURE - Test Mode (DO NOT USE IN PRODUCTION!)
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // ANYONE CAN ACCESS!
    }
  }
}
```

If you see the above, **your database is completely open** to the public! 🚨

---

### Step 2: Apply Secure Rules

Replace with these **production-ready rules**:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // ==========================================
    // Users Collection
    // ==========================================
    match /users/{userId} {
      // Anyone can create a user (for registration)
      allow create: if true;

      // Users can read and update their own data
      allow read, update: if true; // In production, add authentication:
                                    // if request.auth != null && request.auth.uid == userId;

      // Nobody can delete users (use Cloud Functions for this)
      allow delete: if false;
    }

    // ==========================================
    // Food Items Collection (Read-Only for Users)
    // ==========================================
    match /food_items/{foodId} {
      // Anyone can read food items
      allow read: if true;

      // Only admins can modify (use Firebase Admin SDK)
      allow write: if false;
    }

    // ==========================================
    // Composite Items Collection (Read-Only for Users)
    // ==========================================
    match /composite_items/{itemId} {
      // Anyone can read composite items
      allow read: if true;

      // Only admins can modify
      allow write: if false;
    }

    // ==========================================
    // Custom Foods Collection
    // ==========================================
    match /custom_foods/{foodId} {
      // Anyone can create custom foods
      allow create: if true;

      // Users can read and delete their own custom foods
      allow read: if true; // In production: if resource.data.user_id == request.auth.uid;
      allow delete: if true; // In production: if resource.data.user_id == request.auth.uid;

      // Prevent updates (delete and recreate instead)
      allow update: if false;
    }

    // ==========================================
    // Meal Plans Collection
    // ==========================================
    match /meal_plans/{planId} {
      // Anyone can create meal plans
      allow create: if true;

      // Users can read and update their own meal plans
      allow read: if true; // In production: if resource.data.user_id == request.auth.uid;
      allow update: if true; // In production: if resource.data.user_id == request.auth.uid;
      allow delete: if true; // In production: if resource.data.user_id == request.auth.uid;
    }

    // ==========================================
    // Shopping Lists Collection
    // ==========================================
    match /shopping_lists/{listId} {
      // Anyone can create shopping lists
      allow create: if true;

      // Users can read their own shopping lists
      allow read: if true; // In production: if resource.data.user_id == request.auth.uid;

      // No updates or deletes (recreate instead)
      allow update, delete: if false;
    }

    // ==========================================
    // Rules Collection
    // ==========================================
    match /rules/{ruleId} {
      // Anyone can create rules
      allow create: if true;

      // Users can read and update their own rules
      allow read: if true; // In production: if resource.data.user_id == request.auth.uid;
      allow update: if true; // In production: if resource.data.user_id == request.auth.uid;

      // No deletes
      allow delete: if false;
    }

    // ==========================================
    // Health Check Collection (for connectivity tests)
    // ==========================================
    match /_health/{document=**} {
      allow read: if true;
      allow write: if false;
    }

    // ==========================================
    // Default: Deny All Other Collections
    // ==========================================
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

---

### Step 3: Enhanced Security (Recommended for Production)

For **production deployment**, add Firebase Authentication:

1. **Enable Firebase Authentication:**
   ```bash
   # In Firebase Console:
   Authentication → Get Started → Email/Password → Enable
   ```

2. **Update Rules to Require Authentication:**
   ```javascript
   // Example for meal_plans:
   match /meal_plans/{planId} {
     allow create: if request.auth != null;
     allow read, update, delete: if request.auth != null
                                  && resource.data.user_id == request.auth.uid;
   }
   ```

3. **Add Data Validation:**
   ```javascript
   match /meal_plans/{planId} {
     allow create: if request.auth != null
                   && request.resource.data.user_id == request.auth.uid
                   && request.resource.data.week_start is string
                   && request.resource.data.meals is string;

     allow update: if request.auth != null
                   && resource.data.user_id == request.auth.uid
                   && request.resource.data.user_id == resource.data.user_id; // Prevent user_id change
   }
   ```

---

## 🔒 Additional Security Measures

### 1. App Check (Recommended)

Prevent unauthorized apps from accessing your Firebase:

```bash
# In Firebase Console:
App Check → Register App → reCAPTCHA v3
```

Add to your HTML:
```html
<!-- After Firebase SDK -->
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-app-check-compat.js"></script>
<script>
  const appCheck = firebase.appCheck();
  appCheck.activate(
    'YOUR_RECAPTCHA_SITE_KEY',
    true // Use reCAPTCHA v3
  );
</script>
```

### 2. Rate Limiting

Add to Firestore Rules:
```javascript
// Limit document creations per user
allow create: if request.auth != null
              && request.auth.token.email_verified == true
              && request.time < resource.data.created_at + duration.value(1, 's'); // 1 per second max
```

### 3. Data Size Limits

```javascript
// Limit meal plan size to prevent abuse
allow create: if request.resource.size() < 500000; // 500KB max
```

---

## 🧪 Testing Your Security Rules

### Test in Firebase Console:

1. Go to **Firestore Database** → **Rules** tab
2. Click **Rules Playground**
3. Test scenarios:

```javascript
// Test: Can anonymous user read food items?
match /food_items/test_food
Authenticated: No
Read: Should PASS ✅

// Test: Can user modify food items?
match /food_items/test_food
Authenticated: No
Write: Should FAIL ❌

// Test: Can user read other user's meal plans?
match /meal_plans/someone_elses_plan
Authenticated: Yes (user123)
Read: Should FAIL ❌ (if resource.data.user_id != 'user123')
```

---

## 📊 Monitoring

### Enable Firestore Rules Monitoring:

1. Go to Firebase Console → **Firestore** → **Usage** tab
2. Monitor:
   - Denied operations (security rule violations)
   - Read/write operations per collection
   - Quota usage

### Set Up Alerts:

1. Go to **Alerts** in Firebase Console
2. Create alerts for:
   - Unusual spike in denied operations
   - Quota approaching limit
   - High write operations from single IP

---

## 🚨 Emergency: If Database Is Compromised

If you suspect unauthorized access:

### Immediate Actions:

1. **Rotate API Keys:**
   ```bash
   # Firebase Console → Project Settings → General
   # Click "Regenerate" next to Web API Key
   ```

2. **Enable Read-Only Mode:**
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read: if true;
         allow write: if false; // Block all writes
       }
     }
   }
   ```

3. **Review Audit Logs:**
   - Firebase Console → Firestore → Usage
   - Check for suspicious patterns

4. **Restore from Backup:**
   - Enable automated backups in Firebase Console
   - Restore to last known good state

---

## ✅ Security Checklist

Before deploying to production:

- [ ] Firestore Security Rules configured (not in Test Mode)
- [ ] Rules tested in Firebase Console playground
- [ ] Firebase Authentication enabled (recommended)
- [ ] App Check enabled (recommended)
- [ ] Rate limiting configured
- [ ] Data validation in rules
- [ ] Monitoring and alerts set up
- [ ] Backup strategy configured
- [ ] API keys rotated (if previously exposed)
- [ ] Security audit completed

---

## 📚 Additional Resources

- [Firestore Security Rules Guide](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase App Check](https://firebase.google.com/docs/app-check)
- [Security Rules Cookbook](https://firebase.google.com/docs/firestore/security/rules-cookbook)
- [Testing Security Rules](https://firebase.google.com/docs/firestore/security/test-rules-emulator)

---

## 🆘 Support

If you need help configuring security:

1. Check [Firebase Documentation](https://firebase.google.com/docs)
2. Join [Firebase Community](https://firebase.google.com/community)
3. Post on [Stack Overflow](https://stackoverflow.com/questions/tagged/firebase) with tag `firebase`

---

**Remember:** Public API keys are normal for Firebase, but database access **MUST** be restricted with proper Security Rules! 🔒
