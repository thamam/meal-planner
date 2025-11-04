// ==========================================
// 🔥 Firebase Configuration
// ==========================================

// NOTE: You need to replace these values with your actual Firebase project credentials
// Get these from: https://console.firebase.google.com/
// 1. Go to Project Settings > General
// 2. Scroll down to "Your apps" section
// 3. Click the web app icon (</>)
// 4. Copy the firebaseConfig object

const firebaseConfig = {
    // TODO: Replace with your Firebase project credentials
    apiKey: "YOUR_API_KEY_HERE",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef123456"
};

// Initialize Firebase (if not already initialized)
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
} else {
    firebase.app(); // Use existing app
}

// Initialize Firestore
const db = firebase.firestore();

// Enable offline persistence for better UX
db.enablePersistence()
    .catch((err) => {
        if (err.code === 'failed-precondition') {
            console.warn('Multiple tabs open, persistence only works in one tab at a time.');
        } else if (err.code === 'unimplemented') {
            console.warn('Browser doesn\'t support persistence.');
        }
    });

console.log('🔥 Firebase initialized successfully');
