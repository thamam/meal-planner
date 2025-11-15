# App Icons Required

This Android app needs launcher icons in various sizes. You have two options:

## Option 1: Use the Icon Generator Script (Recommended)

If you have ImageMagick installed:

```bash
./generate-icons.sh
```

This will automatically generate all required icon sizes from a source image.

## Option 2: Manually Create Icons

Create PNG icons and place them in the following locations:

### Required Icon Sizes

| Density | Size | Location |
|---------|------|----------|
| mdpi | 48x48 | `app/src/main/res/mipmap-mdpi/ic_launcher.png` |
| hdpi | 72x72 | `app/src/main/res/mipmap-hdpi/ic_launcher.png` |
| xhdpi | 96x96 | `app/src/main/res/mipmap-xhdpi/ic_launcher.png` |
| xxhdpi | 144x144 | `app/src/main/res/mipmap-xxhdpi/ic_launcher.png` |
| xxxhdpi | 192x192 | `app/src/main/res/mipmap-xxxhdpi/ic_launcher.png` |

### Round Icons (Optional but Recommended)

Same sizes as above, but with `ic_launcher_round.png` as the filename.

## Icon Design Guidelines

- **Use the meal planner theme**: Consider using the 🍱 emoji or food-related imagery
- **Match the app colors**: Use the gradient colors from the theme (#667eea to #764ba2)
- **Keep it simple**: Icons should be recognizable at small sizes
- **Use transparent background**: Or ensure background matches your design
- **Follow Material Design**: See https://material.io/design/iconography/

## Tools for Creating Icons

- **Android Asset Studio**: https://romannurik.github.io/AndroidAssetStudio/
- **GIMP**: Free image editor - https://www.gimp.org/
- **Inkscape**: Free vector graphics editor - https://inkscape.org/
- **Figma**: Online design tool - https://www.figma.com/
- **Canva**: Simple online design - https://www.canva.com/

## Temporary Placeholder

Until you create proper icons, the app will work but may show a default Android icon. The app is fully functional without custom icons, but they greatly improve the user experience.
