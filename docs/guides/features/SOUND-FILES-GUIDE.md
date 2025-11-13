# 🔊 Sound Files Guide - Kids' Meal Planner

## Required Sound Files

The app expects 7 MP3 audio files in the `sounds/` directory. If these files are missing, the app works perfectly (graceful fallback), but you won't hear any audio.

---

## Sound File List

Create a `sounds/` folder in the root directory and add these files:

### 1. **background-music.mp3**
- **Type**: Ambient background music (loop)
- **Duration**: 30-120 seconds
- **Volume**: Will play at 30% volume
- **Tone**: Gentle, cheerful, kid-friendly
- **Suggestions**:
  - Light instrumental music
  - Happy ukulele/acoustic guitar
  - Playful piano melody
  - No lyrics (instrumental only)

### 2. **click.mp3**
- **Type**: Button click sound
- **Duration**: 0.1-0.3 seconds
- **Volume**: Will play at 50% volume
- **Tone**: Light tap or click
- **Suggestions**:
  - Simple "pop" sound
  - Soft button press
  - Light "tick" sound

### 3. **success.mp3**
- **Type**: Success confirmation
- **Duration**: 0.5-1.5 seconds
- **Volume**: Will play at 70% volume
- **Tone**: Positive, encouraging
- **Suggestions**:
  - Rising chime (3-5 notes)
  - "Ding!" sound
  - Happy bell
  - Gentle "ta-da!"

### 4. **error.mp3**
- **Type**: Error/warning notification
- **Duration**: 0.5-1 second
- **Volume**: Will play at 60% volume
- **Tone**: Gentle warning (not scary!)
- **Suggestions**:
  - Soft buzzer
  - "Boop boop" sound
  - Gentle descending notes
  - Friendly "uh-oh" sound

### 5. **fanfare.mp3**
- **Type**: Celebration for big achievements
- **Duration**: 2-4 seconds
- **Volume**: Will play at 80% volume
- **Tone**: Exciting, victorious
- **Suggestions**:
  - Short fanfare trumpet
  - "Ta-da!" with sparkles
  - Celebration tune
  - Victory jingle

### 6. **drop.mp3**
- **Type**: Drag-and-drop completion
- **Duration**: 0.3-0.5 seconds
- **Volume**: Will play at 40% volume
- **Tone**: Subtle confirmation
- **Suggestions**:
  - Soft "plop" sound
  - Gentle thud
  - Light "click-in" sound

### 7. **remove.mp3**
- **Type**: Item removal/deletion
- **Duration**: 0.3-0.5 seconds
- **Volume**: Will play at 50% volume
- **Tone**: Neutral removal
- **Suggestions**:
  - Soft "whoosh"
  - Light "swipe" sound
  - Gentle "poof"

---

## Free Sound Resources

### Recommended Websites (Royalty-Free)

1. **Freesound.org**
   - URL: https://freesound.org
   - Free sounds with Creative Commons licenses
   - Great for UI sounds
   - Search: "button click", "success", "error", etc.

2. **Zapsplat.com**
   - URL: https://www.zapsplat.com
   - Free sound effects library
   - Good selection of UI sounds
   - Requires free account

3. **Mixkit.co**
   - URL: https://mixkit.co/free-sound-effects/
   - Free sound effects and music
   - Good for background music
   - No attribution required

4. **FreeSound Effects**
   - URL: https://www.freesoundeffects.com
   - Categorized sound library
   - Easy download

5. **YouTube Audio Library**
   - Available in YouTube Studio
   - Royalty-free music and sound effects
   - High quality

### AI-Generated Sounds

1. **ElevenLabs Sound Effects** (if available)
   - Generate custom sound effects
   - Describe what you need

2. **Soundraw.io**
   - AI-generated music
   - Customizable parameters

---

## Quick Setup Instructions

### Step 1: Create Sounds Directory
```bash
mkdir sounds
cd sounds
```

### Step 2: Download or Create Sound Files
Download from the resources above and save as:
- `background-music.mp3`
- `click.mp3`
- `success.mp3`
- `error.mp3`
- `fanfare.mp3`
- `drop.mp3`
- `remove.mp3`

### Step 3: Test in Browser
1. Open `index.html` in browser
2. Click the 🔊 sound toggle button
3. Click the 🎵 music toggle button
4. Try adding foods to hear the sounds

---

## Alternative: Use Simple Beeps

If you can't find sound files, you can create simple beeps using online tools:

### Online Beep Generators
1. **TTS Tools** - https://www.ttstools.com/sound-effects
2. **Online Tone Generator** - https://onlinetonegenerator.com
3. **BFXR** - https://www.bfxr.net (8-bit style sounds)

### Creating Simple Sounds
1. Generate a tone (e.g., 440 Hz for 0.2 seconds)
2. Export as MP3
3. Rename to match required filename
4. Place in `sounds/` folder

---

## Testing Without Sound Files

The app is designed to work without sound files:

1. Toggle sounds ON (🔊 button turns green)
2. If files missing, you'll see console logs: "Sound file not found: [filename] (optional feature)"
3. App continues to work normally
4. Visual feedback (animations, messages) still works

**This is intentional** - sounds are an enhancement, not a requirement.

---

## File Size Recommendations

| File | Recommended Size | Max Size |
|------|------------------|----------|
| background-music.mp3 | 500KB - 2MB | 5MB |
| click.mp3 | 5KB - 20KB | 50KB |
| success.mp3 | 10KB - 50KB | 100KB |
| error.mp3 | 10KB - 50KB | 100KB |
| fanfare.mp3 | 50KB - 200KB | 500KB |
| drop.mp3 | 5KB - 20KB | 50KB |
| remove.mp3 | 5KB - 20KB | 50KB |

**Total**: ~600KB - 2.5MB for all sounds

---

## Format Requirements

- **Format**: MP3 (preferred) or OGG
- **Sample Rate**: 44.1 kHz or 48 kHz
- **Bit Rate**: 128 kbps or higher
- **Channels**: Mono or Stereo (Stereo for music, Mono for effects)

---

## Converting Audio Files

If you have sounds in other formats (WAV, FLAC, M4A, etc.):

### Online Converters
1. **CloudConvert** - https://cloudconvert.com/
2. **Online Audio Converter** - https://online-audio-converter.com/
3. **Zamzar** - https://www.zamzar.com/

### Desktop Tools
- **Audacity** (Free) - Export as MP3
- **FFmpeg** (Command line)
  ```bash
  ffmpeg -i input.wav -b:a 128k output.mp3
  ```

---

## Sound Design Tips

### For Children Ages 4-8
- ✅ Keep sounds cheerful and non-threatening
- ✅ Use bright, clear tones
- ✅ Avoid scary or harsh sounds
- ✅ Keep error sounds gentle (not punishing)
- ✅ Make success sounds rewarding

### Volume Guidelines
Already configured in the app:
- Background music: 30% (subtle)
- Click: 50% (noticeable)
- Success: 70% (rewarding)
- Error: 60% (attention-getting but not harsh)
- Fanfare: 80% (celebratory)
- Drop: 40% (subtle feedback)
- Remove: 50% (confirmation)

---

## Licensing Considerations

### For Public/Commercial Use
Make sure sounds are:
- ✅ Royalty-free
- ✅ Licensed for web use
- ✅ Attribution provided (if required)
- ✅ Commercial use allowed (if applicable)

### Safe Choices
- Creative Commons CC0 (Public Domain)
- Creative Commons BY (Attribution)
- Royalty-free sound libraries
- Your own recordings

**Avoid**: Copyrighted music, trademarked sounds (e.g., iPhone ringtones)

---

## Troubleshooting

### Sounds Not Playing?

**Check 1**: Files in correct location?
```
project-root/
├── index.html
├── js/
├── sounds/          ← Files should be here
│   ├── background-music.mp3
│   ├── click.mp3
│   └── ...
```

**Check 2**: Sound toggle enabled?
- Click 🔊 button (should turn green)
- Click 🎵 button for music (should turn blue)

**Check 3**: Browser console errors?
- Open DevTools (F12)
- Look for errors in Console tab
- Should see: "Sound file not found: [filename] (optional feature)"

**Check 4**: Browser autoplay policy?
- Some browsers block autoplay
- Background music may need user click to start
- Try clicking something first, then toggle music

**Check 5**: File names exact?
- Names are case-sensitive
- Must be exactly: `background-music.mp3` (not `Background-Music.mp3`)
- Must be `.mp3` extension

### Still Not Working?

1. Check file format (must be MP3 or OGG)
2. Check file isn't corrupted (try playing in media player)
3. Check browser supports MP3 (all modern browsers do)
4. Check file permissions (files should be readable)

---

## Example Sound Pack

Here's a suggested set of search terms for finding sounds:

1. **background-music.mp3**: "happy kids background music"
2. **click.mp3**: "UI button click"
3. **success.mp3**: "achievement unlock"
4. **error.mp3**: "gentle error beep"
5. **fanfare.mp3**: "short fanfare celebration"
6. **drop.mp3**: "item drop plop"
7. **remove.mp3**: "swipe whoosh"

---

## Quick Start (5 Minutes)

1. Go to https://mixkit.co/free-sound-effects/
2. Search and download:
   - Click sound
   - Success sound
   - Error beep
   - Celebration sound
3. Go to https://mixkit.co/free-stock-music/
4. Download a cheerful instrumental track
5. Convert to MP3 if needed
6. Rename files to match requirements
7. Place in `sounds/` folder
8. Test in browser!

---

## Optional: Professional Sound Pack

If you want a cohesive sound set:

**Recommendation**: Search for "UI Sound Pack" on:
- GameDev Market
- Itch.io
- Unity Asset Store (many have web licenses)

Look for packs labeled:
- Kids/Children
- Cartoon
- Casual Game
- Educational

**Cost**: $5-$30 for professional pack

---

## Need Help?

If you can't create/find sound files:
1. App works perfectly without them
2. Visual feedback (animations) still work
3. Toast messages still appear
4. Consider adding sounds later

**Remember**: Sounds are optional! The app is fully functional without them.

---

*Once you add sound files, the app will automatically detect and use them!* 🎵
