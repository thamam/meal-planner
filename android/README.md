# Kids Meal Planner - Android App

This is the native Android wrapper for the Kids Meal Planner web application. It uses a WebView to display the web app with native Android features and offline support.

## Features

- 📱 **Native Android Experience**: Full-screen app with splash screen
- 🔄 **Offline Support**: Works offline with cached content
- 📲 **Pull to Refresh**: Swipe down to reload the app
- ⬅️ **Back Button**: Navigate through app history
- 🔗 **Deep Linking**: Support for app-specific URLs
- 🎨 **Material Design**: Modern Android UI/UX
- 🌐 **WebView Integration**: Seamless web app integration
- 💾 **Local Storage**: Persistent data storage
- 🔒 **Secure**: Input validation and security features

## Prerequisites

Before building the Android app, make sure you have:

### Required

- **Java Development Kit (JDK) 17 or higher**
  - Check: `java -version`
  - Download: https://adoptium.net/

- **Android SDK** (if using Android Studio)
  - Download Android Studio: https://developer.android.com/studio
  - Or install command-line tools: https://developer.android.com/studio/command-line

### Optional

- **ImageMagick** (for generating app icons)
  - Ubuntu/Debian: `sudo apt-get install imagemagick`
  - macOS: `brew install imagemagick`
  - Windows: Download from https://imagemagick.org/

- **Android Debug Bridge (adb)** (for installing on devices)
  - Included with Android SDK Platform Tools

## Quick Start

### 1. Generate App Icons (Optional)

If you have ImageMagick installed:

```bash
./generate-icons.sh
```

Or manually place icons in:
- `app/src/main/res/mipmap-mdpi/ic_launcher.png` (48x48)
- `app/src/main/res/mipmap-hdpi/ic_launcher.png` (72x72)
- `app/src/main/res/mipmap-xhdpi/ic_launcher.png` (96x96)
- `app/src/main/res/mipmap-xxhdpi/ic_launcher.png` (144x144)
- `app/src/main/res/mipmap-xxxhdpi/ic_launcher.png` (192x192)

### 2. Build the APK

#### Debug Build (for testing)

```bash
./build-android.sh
```

Or using Gradle directly:

```bash
./gradlew assembleDebug
```

The APK will be at: `app/build/outputs/apk/debug/app-debug.apk`

#### Release Build (for production)

```bash
./build-android.sh --release
```

Or using Gradle directly:

```bash
./gradlew assembleRelease
```

The APK will be at: `app/build/outputs/apk/release/app-release-unsigned.apk`

### 3. Install on Device

#### Using the build script:

```bash
./build-android.sh --install
```

#### Using adb directly:

```bash
adb install -r app/build/outputs/apk/debug/app-debug.apk
```

#### Using Android Studio:

1. Open the `android` folder in Android Studio
2. Click **Run** → **Run 'app'**
3. Select your device or emulator

## Build Script Options

The `build-android.sh` script supports several options:

```bash
./build-android.sh [OPTIONS]

Options:
  -r, --release    Build release APK (default: debug)
  -i, --install    Install APK on connected device after build
  -c, --clean      Clean build (removes build cache)
  -h, --help       Show help message

Examples:
  ./build-android.sh                    # Build debug APK
  ./build-android.sh -r                 # Build release APK
  ./build-android.sh -i                 # Build debug and install
  ./build-android.sh -r -i              # Build release and install
  ./build-android.sh -c -r              # Clean build release APK
```

## Project Structure

```
android/
├── app/
│   ├── src/
│   │   └── main/
│   │       ├── java/com/mealplanner/kids/
│   │       │   ├── MainActivity.kt          # Main activity with WebView
│   │       │   ├── MealPlannerApplication.kt # Application class
│   │       │   └── WebAppInterface.kt       # JS bridge
│   │       ├── res/
│   │       │   ├── layout/
│   │       │   │   └── activity_main.xml    # Main layout
│   │       │   ├── values/
│   │       │   │   ├── strings.xml          # String resources
│   │       │   │   ├── colors.xml           # Color palette
│   │       │   │   └── themes.xml           # App themes
│   │       │   ├── mipmap-*/                # App icons
│   │       │   └── xml/                     # Configuration files
│   │       ├── assets/                      # Web app files (auto-copied)
│   │       └── AndroidManifest.xml          # App manifest
│   ├── build.gradle                         # App-level build config
│   └── proguard-rules.pro                   # ProGuard rules
├── gradle/                                  # Gradle wrapper
├── build.gradle                             # Project-level build config
├── settings.gradle                          # Project settings
├── gradle.properties                        # Gradle properties
├── build-android.sh                         # Build script
├── generate-icons.sh                        # Icon generator
└── README.md                                # This file
```

## Configuration

### App Details

Edit `app/build.gradle` to customize:

- **Package Name**: `applicationId "com.mealplanner.kids"`
- **Version Code**: `versionCode 1`
- **Version Name**: `versionName "1.0.0"`
- **Min SDK**: `minSdk 24` (Android 7.0+)
- **Target SDK**: `targetSdk 34` (Android 14)

### App URL

The app loads from local assets by default. To use a hosted version:

Edit `MainActivity.kt`:

```kotlin
// Change from:
private val appUrl = "file:///android_asset/index.html"

// To:
private val appUrl = "https://your-domain.com/index.html"
```

### Permissions

The app requests these permissions (see `AndroidManifest.xml`):

- `INTERNET` - Required for online features and Firebase
- `ACCESS_NETWORK_STATE` - To detect online/offline status
- `WRITE_EXTERNAL_STORAGE` (API ≤28) - For exporting meal plans
- `READ_EXTERNAL_STORAGE` (API ≤32) - For importing data

## JavaScript Bridge

The app provides a JavaScript interface for native features:

```javascript
// Show Android toast notification
Android.showToast("Hello from web app!");

// Get app version
const version = Android.getAppVersion();

// Vibrate device
Android.vibrate(100); // milliseconds
```

## Signing for Release

To publish on Google Play Store, you need to sign the APK:

### 1. Generate a keystore:

```bash
keytool -genkey -v -keystore meal-planner.keystore \
  -alias meal-planner -keyalg RSA -keysize 2048 -validity 10000
```

### 2. Configure signing in `app/build.gradle`:

```gradle
android {
    signingConfigs {
        release {
            storeFile file("path/to/meal-planner.keystore")
            storePassword "your-store-password"
            keyAlias "meal-planner"
            keyPassword "your-key-password"
        }
    }

    buildTypes {
        release {
            signingConfig signingConfigs.release
            // ...
        }
    }
}
```

### 3. Build signed APK:

```bash
./gradlew assembleRelease
```

## Troubleshooting

### Build fails with "Java version" error

Make sure you have Java 17 or higher:

```bash
java -version
```

Set `JAVA_HOME` if needed:

```bash
export JAVA_HOME=/path/to/jdk-17
```

### "adb not found" error

Install Android SDK Platform Tools or add to PATH:

```bash
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

### WebView shows blank page

1. Check that web assets were copied: `app/src/main/assets/index.html`
2. Enable WebView debugging in `MealPlannerApplication.kt`
3. Use Chrome DevTools: `chrome://inspect/#devices`

### App crashes on startup

1. Check logcat: `adb logcat | grep -i error`
2. Verify all required files are in `assets/` folder
3. Check JavaScript console for errors

## Performance Optimization

The app includes several optimizations:

- **ProGuard**: Code shrinking and obfuscation (release builds)
- **Resource shrinking**: Removes unused resources
- **WebView caching**: Caches web content for faster loading
- **Service Worker**: PWA caching for offline support
- **Asset compression**: Gradle compresses assets automatically

## Testing

### Run on Emulator

1. Create an AVD (Android Virtual Device) in Android Studio
2. Start the emulator
3. Run: `./build-android.sh --install`

### Run on Physical Device

1. Enable Developer Options on your device
2. Enable USB Debugging
3. Connect via USB
4. Run: `./build-android.sh --install`

### Debug WebView

Enable WebView debugging to inspect with Chrome DevTools:

1. In `MealPlannerApplication.kt`, `WebView.setWebContentsDebuggingEnabled(true)` is enabled for debug builds
2. Connect device and open app
3. In Chrome, go to: `chrome://inspect/#devices`
4. Click "Inspect" under your app

## Publishing

### Google Play Store

1. Create a Google Play Developer account
2. Generate a signed release APK (see "Signing for Release" above)
3. Create app listing in Play Console
4. Upload APK or Android App Bundle (AAB)
5. Complete store listing (screenshots, description, etc.)
6. Submit for review

### App Bundle (Recommended)

For Google Play, use Android App Bundle instead of APK:

```bash
./gradlew bundleRelease
```

Output: `app/build/outputs/bundle/release/app-release.aab`

## Support

For issues or questions:

- **App Issues**: Check the main project README
- **Android-specific**: See logcat output
- **Build Problems**: Verify prerequisites are installed

## License

Same license as the main Kids Meal Planner project (MIT License).
