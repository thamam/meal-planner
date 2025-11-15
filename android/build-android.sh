#!/bin/bash

#
# Build script for Kids Meal Planner Android App
# This script builds the Android APK and optionally installs it on a connected device
#

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Kids Meal Planner - Android Build${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Check if Java is installed
if ! command -v java &> /dev/null; then
    echo -e "${RED}Error: Java is not installed or not in PATH${NC}"
    echo "Please install Java 17 or higher"
    exit 1
fi

# Check Java version
JAVA_VERSION=$(java -version 2>&1 | awk -F '"' '/version/ {print $2}' | cut -d'.' -f1)
if [ "$JAVA_VERSION" -lt 17 ]; then
    echo -e "${YELLOW}Warning: Java version should be 17 or higher${NC}"
    echo "Current version: $(java -version 2>&1 | head -n 1)"
fi

# Parse command line arguments
BUILD_TYPE="debug"
INSTALL=false
CLEAN=false

while [[ $# -gt 0 ]]; do
    case $1 in
        -r|--release)
            BUILD_TYPE="release"
            shift
            ;;
        -i|--install)
            INSTALL=true
            shift
            ;;
        -c|--clean)
            CLEAN=true
            shift
            ;;
        -h|--help)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  -r, --release    Build release APK (default: debug)"
            echo "  -i, --install    Install APK on connected device after build"
            echo "  -c, --clean      Clean build (removes build cache)"
            echo "  -h, --help       Show this help message"
            echo ""
            echo "Examples:"
            echo "  $0                    # Build debug APK"
            echo "  $0 -r                 # Build release APK"
            echo "  $0 -i                 # Build debug and install"
            echo "  $0 -r -i              # Build release and install"
            echo "  $0 -c -r              # Clean build release APK"
            exit 0
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            echo "Use -h or --help for usage information"
            exit 1
            ;;
    esac
done

# Clean build if requested
if [ "$CLEAN" = true ]; then
    echo -e "${YELLOW}Cleaning build...${NC}"
    ./gradlew clean
    echo ""
fi

# Build the APK
echo -e "${GREEN}Building ${BUILD_TYPE} APK...${NC}"
if [ "$BUILD_TYPE" = "release" ]; then
    ./gradlew assembleRelease
    APK_PATH="app/build/outputs/apk/release/app-release-unsigned.apk"
    APK_OUTPUT="meal-planner-release.apk"
else
    ./gradlew assembleDebug
    APK_PATH="app/build/outputs/apk/debug/app-debug.apk"
    APK_OUTPUT="meal-planner-debug.apk"
fi

# Check if build was successful
if [ ! -f "$APK_PATH" ]; then
    echo -e "${RED}Build failed! APK not found at: $APK_PATH${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}✓ Build successful!${NC}"
echo -e "APK location: ${BLUE}$APK_PATH${NC}"

# Copy APK to root directory for easy access
cp "$APK_PATH" "../$APK_OUTPUT"
echo -e "APK copied to: ${BLUE}../$APK_OUTPUT${NC}"

# Get APK size
APK_SIZE=$(du -h "$APK_PATH" | cut -f1)
echo -e "APK size: ${BLUE}$APK_SIZE${NC}"

# Install if requested
if [ "$INSTALL" = true ]; then
    echo ""
    echo -e "${YELLOW}Installing APK on connected device...${NC}"

    # Check if adb is available
    if ! command -v adb &> /dev/null; then
        echo -e "${RED}Error: adb is not installed or not in PATH${NC}"
        echo "Please install Android SDK Platform Tools"
        exit 1
    fi

    # Check for connected devices
    DEVICES=$(adb devices | grep -v "List" | grep "device$" | wc -l)
    if [ "$DEVICES" -eq 0 ]; then
        echo -e "${RED}Error: No Android devices connected${NC}"
        echo "Please connect a device or start an emulator"
        exit 1
    fi

    # Install the APK
    adb install -r "$APK_PATH"

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Installation successful!${NC}"
        echo ""
        echo -e "${BLUE}You can now launch the app on your device${NC}"
    else
        echo -e "${RED}Installation failed${NC}"
        exit 1
    fi
fi

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Build complete!${NC}"
echo -e "${GREEN}========================================${NC}"
