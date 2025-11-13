// ==========================================
// 🔥 Firebase Configuration
// ==========================================

// Your Firebase project credentials (already configured!)
// Project: kids-meal-planner
const firebaseConfig = {
  apiKey: "AIzaSyAHciw1eLjoij-TWHZ3_IO3KS8mv4IPnaA",
  authDomain: "kids-meal-planner.firebaseapp.com",
  projectId: "kids-meal-planner",
  storageBucket: "kids-meal-planner.firebasestorage.app",
  messagingSenderId: "530830532763",
  appId: "1:530830532763:web:4afbf9007596beee2ce63e"
};

// Initialize Firebase (using compat mode for compatibility)
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
} else {
    firebase.app(); // Use existing app
}

// Initialize Firestore and make it globally available
window.db = firebase.firestore();

// Enable offline persistence for better UX
window.db.enablePersistence()
    .then(() => {
        console.log('✅ Firebase offline persistence enabled');
    })
    .catch((err) => {
        if (err.code === 'failed-precondition') {
            console.warn('⚠️ Multiple tabs open, persistence only works in one tab at a time.');
        } else if (err.code === 'unimplemented') {
            console.warn('⚠️ Browser doesn\'t support offline persistence.');
        } else {
            console.error('❌ Error enabling persistence:', err);
        }
    });

console.log('🔥 Firebase initialized successfully');
