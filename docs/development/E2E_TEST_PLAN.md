# End-to-End Test Plan - Kids' Meal Planner

## Purpose
Comprehensive test flows to validate critical user journeys and catch issues before deployment.

## Test Environment
- Browser: Chrome/Safari latest
- Server: Local (python3 -m http.server 8000)
- Database: Firebase (or mock if unavailable)

---

## Critical User Flows

### Flow 1: First-Time User - Profile Creation
**Priority: CRITICAL**

**Steps:**
1. Open app (http://localhost:8000)
2. Verify welcome state (no profile exists)
3. Click to create profile
4. Fill in name (valid: letters only, 1-50 chars)
5. Fill in age (valid: 4-12)
6. Select avatar (any emoji)
7. Click Save
8. Verify profile saved
9. Verify user display shows name, age, avatar
10. Verify localStorage has user data

**Expected Results:**
- ✅ Profile modal opens
- ✅ Validation works for name/age
- ✅ Avatar selection highlights selected emoji
- ✅ Save succeeds without errors
- ✅ Modal closes
- ✅ User info displayed correctly
- ✅ No console errors

**Edge Cases:**
- Empty name → should show error
- Invalid age (3 or 13) → should show error
- No avatar selected → should use default '😊'
- Special characters in name → should be sanitized

---

### Flow 2: Parent Password Setup (First Time)
**Priority: CRITICAL**

**Steps:**
1. With profile created, click "Parent" tab
2. Verify setup modal appears
3. Click "Set Up Password"
4. Enter password < 6 chars → should show error
5. Enter valid password (6+ chars with letters & numbers)
6. Click OK
7. Verify confirmation modal appears
8. Enter same password again
9. Click OK
10. Verify success message
11. Verify modal closes
12. Verify parent tab is accessible

**Expected Results:**
- ✅ Setup modal shows on first access
- ✅ Password validation works
- ✅ Short password rejected with message
- ✅ Confirmation modal appears
- ✅ Mismatched passwords rejected
- ✅ Success message shows
- ✅ All modals close
- ✅ Password saved to localStorage (hashed)
- ✅ Session created
- ✅ Parent tab accessible

**Edge Cases:**
- Cancel setup → should close, can retry later
- Passwords don't match → show error, stay open
- Very long password → should work
- Special characters in password → should work

---

### Flow 3: Parent Login (Returning User)
**Priority: CRITICAL**

**Steps:**
1. Clear session: sessionStorage.clear()
2. Click "Parent" tab
3. Verify login modal appears (not setup)
4. Enter wrong password → should show error
5. Enter correct password
6. Click OK
7. Verify modal closes
8. Verify parent tab accessible

**Expected Results:**
- ✅ Login modal shows (not setup)
- ✅ Wrong password rejected with error
- ✅ Correct password accepted
- ✅ Modal closes
- ✅ Session created
- ✅ Parent features accessible

---

### Flow 4: Meal Planning - Drag & Drop
**Priority: HIGH**

**Steps:**
1. With profile created
2. Verify food items loaded
3. Drag a food item to Monday breakfast
4. Drop it
5. Verify food appears in slot
6. Verify health meter updates
7. Drag another food to same slot
8. Verify multiple items show
9. Remove an item (click X)
10. Verify item removed
11. Verify health meter updates

**Expected Results:**
- ✅ Food palette loads
- ✅ Drag works smoothly
- ✅ Drop zones highlight on hover
- ✅ Food appears in correct slot
- ✅ Health meter reflects choices
- ✅ Multiple items per slot work
- ✅ Remove works
- ✅ No console errors

---

### Flow 5: Save Meal Plan
**Priority: HIGH**

**Steps:**
1. With profile and meals planned
2. Click "Save" button
3. Verify saving indicator shows
4. Wait for completion
5. Verify success message
6. Refresh page
7. Verify meals persist

**Expected Results:**
- ✅ Save button works
- ✅ Loading state shows
- ✅ Success message appears
- ✅ Data saves to Firebase/localStorage
- ✅ Page refresh loads saved data
- ✅ No data loss

---

### Flow 6: Custom Food Creation
**Priority: MEDIUM**

**Steps:**
1. Navigate to Parent tab (auth required)
2. Go to Custom Foods section
3. Click "Add Custom Food"
4. Fill in name, category, icon, limit
5. Click Save
6. Verify food appears in list
7. Verify food available in food palette
8. Try to delete custom food
9. Confirm deletion
10. Verify food removed

**Expected Results:**
- ✅ Form opens
- ✅ Validation works
- ✅ Save succeeds
- ✅ Food appears in palette
- ✅ Delete confirmation shows
- ✅ Deletion works
- ✅ Food removed from palette

---

### Flow 7: Rules Configuration
**Priority: MEDIUM**

**Steps:**
1. In Parent tab, go to Rules
2. Set max sweets per week
3. Set other limits
4. Save rules
5. Go to Planner tab
6. Try to exceed limits
7. Verify warnings/restrictions

**Expected Results:**
- ✅ Rules form works
- ✅ Rules save successfully
- ✅ Limits enforced in planner
- ✅ User gets feedback on violations

---

### Flow 8: Offline Mode
**Priority: MEDIUM**

**Steps:**
1. Go offline (dev tools → Network → Offline)
2. Make meal plan changes
3. Try to save
4. Verify queued indicator
5. Go back online
6. Verify auto-sync
7. Verify changes persisted

**Expected Results:**
- ✅ Offline indicator shows
- ✅ Changes queued
- ✅ User informed of offline mode
- ✅ Online reconnection detected
- ✅ Changes auto-sync
- ✅ No data loss

---

### Flow 9: Print Meal Plan
**Priority: LOW**

**Steps:**
1. With meals planned
2. Click Print button
3. Verify print preview
4. Check formatting

**Expected Results:**
- ✅ Print dialog opens
- ✅ Formatting is clean
- ✅ All meals visible
- ✅ User info shows

---

### Flow 10: Language Switch
**Priority: MEDIUM**

**Steps:**
1. Click language toggle
2. Verify UI switches to Hebrew
3. Verify RTL layout
4. Switch back to English
5. Verify LTR layout

**Expected Results:**
- ✅ Language switches
- ✅ All text translates
- ✅ Layout direction correct
- ✅ No broken UI

---

## Validation Test Cases

### Input Validation
- [ ] Name: empty, too long, special chars, numbers
- [ ] Age: empty, too young (3), too old (13), negative, non-number
- [ ] Password: empty, too short (<6), no letters, no numbers
- [ ] Avatar: empty, invalid emoji, very long string
- [ ] Custom food name: empty, too long, special chars

### Security Tests
- [ ] XSS: Try `<script>alert('xss')</script>` in inputs
- [ ] SQL Injection: Try `'; DROP TABLE users;--` in inputs
- [ ] Password hashing: Verify passwords stored as hashes
- [ ] Session management: Verify logout works
- [ ] Parent auth: Verify child can't access parent features

### Browser Compatibility
- [ ] Chrome (latest)
- [ ] Safari (latest)
- [ ] Firefox (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

### Error Handling
- [ ] Network error during save
- [ ] Firebase unavailable
- [ ] Invalid localStorage data
- [ ] Corrupted user data
- [ ] Module load failure

---

## Automated Test Script Ideas

### Browser Console Tests
```javascript
// Test 1: Profile Creation
console.log('=== Test: Profile Creation ===');
document.getElementById('profileName').value = 'Test User';
document.getElementById('profileAge').value = '8';
window.selectedAvatar = '🦁';
await window.saveProfile();
console.log('Profile created:', window.currentUser);

// Test 2: Password Validation
console.log('=== Test: Password Validation ===');
const result1 = window.Security.validatePassword('abc');
console.log('Short password:', result1);
const result2 = window.Security.validatePassword('abc123');
console.log('Good password:', result2);

// Test 3: Emoji Validation
console.log('=== Test: Emoji Validation ===');
console.log('😊 valid?', window.Security.isValidEmoji('😊'));
console.log('🦁 valid?', window.Security.isValidEmoji('🦁'));
console.log('abc valid?', window.Security.isValidEmoji('abc'));
```

---

## Test Execution Checklist

### Pre-Test Setup
- [ ] Clear browser cache
- [ ] Clear localStorage
- [ ] Clear sessionStorage
- [ ] Open dev console
- [ ] Start local server

### During Testing
- [ ] Monitor console for errors
- [ ] Check network tab for failed requests
- [ ] Verify localStorage updates
- [ ] Test on different browsers
- [ ] Test responsive design

### Post-Test
- [ ] Document all issues found
- [ ] Prioritize bugs (Critical/High/Medium/Low)
- [ ] Create GitHub issues for bugs
- [ ] Update this test plan with findings

---

## Known Issues to Verify Fixed
- [x] "Illegal avatar" error → Fixed: Lenient emoji validation
- [x] "Create profile first" even with profile → Fixed: window.selectedAvatar scoping
- [x] Password setup modal doesn't close → Fixed: Modal validator error handling

---

## Future Test Automation

### Recommended Tools
1. **Playwright** - E2E browser automation
2. **Cypress** - Modern E2E testing
3. **Jest** - Unit tests for utilities
4. **Testing Library** - Component testing

### Priority Tests to Automate
1. Profile creation flow
2. Password setup/login flow
3. Meal planning basic operations
4. Input validation tests
5. Error handling scenarios

---

## Test Results Log

### [Date] - Initial Test Run
- Tester: [Name]
- Browser: [Browser/Version]
- Issues Found: [List]
- Pass Rate: [X/Y tests passed]

(Results will be logged here after each test run)
