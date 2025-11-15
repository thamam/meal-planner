#!/bin/bash

#
# Icon generation script for Kids Meal Planner Android App
# This script generates app icons in all required sizes using ImageMagick
#

set -e

# Colors
BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Android Icon Generator${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo -e "${RED}Error: ImageMagick is not installed${NC}"
    echo ""
    echo "Please install ImageMagick:"
    echo "  Ubuntu/Debian: sudo apt-get install imagemagick"
    echo "  macOS: brew install imagemagick"
    echo "  Windows: Download from https://imagemagick.org/script/download.php"
    echo ""
    echo -e "${YELLOW}Alternative: You can manually create icons and place them in:${NC}"
    echo "  app/src/main/res/mipmap-mdpi/ic_launcher.png (48x48)"
    echo "  app/src/main/res/mipmap-hdpi/ic_launcher.png (72x72)"
    echo "  app/src/main/res/mipmap-xhdpi/ic_launcher.png (96x96)"
    echo "  app/src/main/res/mipmap-xxhdpi/ic_launcher.png (144x144)"
    echo "  app/src/main/res/mipmap-xxxhdpi/ic_launcher.png (192x192)"
    exit 1
fi

# Check for source icon
SOURCE_ICON="${1:-icon-source.png}"

if [ ! -f "$SOURCE_ICON" ]; then
    echo -e "${YELLOW}Source icon not found: $SOURCE_ICON${NC}"
    echo ""
    echo "Creating a placeholder icon..."

    # Create a simple gradient icon with emoji
    convert -size 512x512 \
        -define gradient:angle=135 \
        gradient:'#667eea-#764ba2' \
        -gravity center \
        -font Arial \
        -pointsize 300 \
        -fill white \
        -annotate +0+0 '🍱' \
        "$SOURCE_ICON"

    echo -e "${GREEN}✓ Created placeholder icon${NC}"
fi

echo -e "Using source icon: ${BLUE}$SOURCE_ICON${NC}"
echo ""

# Icon sizes for different densities
declare -A SIZES=(
    ["mdpi"]=48
    ["hdpi"]=72
    ["xhdpi"]=96
    ["xxhdpi"]=144
    ["xxxhdpi"]=192
)

# Generate icons
for density in "${!SIZES[@]}"; do
    size=${SIZES[$density]}
    output_dir="app/src/main/res/mipmap-${density}"

    mkdir -p "$output_dir"

    echo -e "Generating ${BLUE}${density}${NC} icon (${size}x${size})..."

    # Generate regular launcher icon
    convert "$SOURCE_ICON" \
        -resize ${size}x${size} \
        -gravity center \
        -extent ${size}x${size} \
        "$output_dir/ic_launcher.png"

    # Generate round launcher icon
    convert "$SOURCE_ICON" \
        -resize ${size}x${size} \
        -gravity center \
        -extent ${size}x${size} \
        \( +clone -threshold -1 -negate -fill white -draw "circle $((size/2)),$((size/2)) $((size/2)),0" \) \
        -alpha off -compose copy_opacity -composite \
        "$output_dir/ic_launcher_round.png"
done

echo ""
echo -e "${GREEN}✓ All icons generated successfully!${NC}"
echo ""
echo -e "${BLUE}Generated icons in:${NC}"
for density in "${!SIZES[@]}"; do
    echo "  app/src/main/res/mipmap-${density}/"
done
