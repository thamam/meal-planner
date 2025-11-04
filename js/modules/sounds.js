// ==========================================
// Sound System Module
// ==========================================

let sounds = {};
let soundEnabled = true;
let musicEnabled = false;

// ==========================================
// Sound Initialization
// ==========================================

function initSounds() {
    // Create sound objects with fallback handling
    sounds = {
        bgMusic: createSound('sounds/background-music.mp3', true, 0.3),
        click: createSound('sounds/click.mp3', false, 0.5),
        success: createSound('sounds/success.mp3', false, 0.7),
        error: createSound('sounds/error.mp3', false, 0.6),
        fanfare: createSound('sounds/fanfare.mp3', false, 0.8),
        drop: createSound('sounds/drop.mp3', false, 0.4),
        remove: createSound('sounds/remove.mp3', false, 0.5)
    };
    
    console.log('🔊 Sound system initialized');
}

function createSound(src, loop = false, volume = 1.0) {
    try {
        const audio = new Audio();
        audio.src = src;
        audio.loop = loop;
        audio.volume = volume;
        audio.preload = 'auto';
        
        // Handle loading errors gracefully
        audio.addEventListener('error', () => {
            console.log(`Sound file not found: ${src} (optional feature)`);
        });
        
        return audio;
    } catch (e) {
        console.log(`Could not create sound: ${src}`);
        return null;
    }
}

// ==========================================
// Sound Playback
// ==========================================

function playSound(soundName) {
    if (!soundEnabled && soundName !== 'bgMusic') return;
    if (!musicEnabled && soundName === 'bgMusic') return;
    
    const sound = sounds[soundName];
    if (sound) {
        try {
            sound.currentTime = 0;
            sound.play().catch(e => {
                // Silent fail - browser may block autoplay
                // This is expected behavior for background music
            });
        } catch (e) {
            // Silent fail
        }
    }
}

function stopSound(soundName) {
    const sound = sounds[soundName];
    if (sound) {
        try {
            sound.pause();
            sound.currentTime = 0;
        } catch (e) {
            // Silent fail
        }
    }
}

// ==========================================
// Sound Control
// ==========================================

function toggleSound() {
    soundEnabled = !soundEnabled;
    const status = soundEnabled ? 'On' : 'Off';
    const icon = soundEnabled ? '🔊' : '🔇';
    
    if (window.showMessage) {
        const note = soundEnabled ? ' (add sound files to sounds/ folder)' : '';
        showMessage(`${icon} Sounds ${status}${note}`, 'info');
    }
    
    // Play confirmation sound if enabled
    if (soundEnabled) {
        playSound('click');
    }
    
    updateSoundButtons();
    return soundEnabled;
}

function toggleMusic() {
    musicEnabled = !musicEnabled;
    const status = musicEnabled ? 'On' : 'Off';
    
    if (musicEnabled && sounds.bgMusic) {
        playSound('bgMusic');
    } else if (sounds.bgMusic) {
        stopSound('bgMusic');
    }
    
    if (window.showMessage) {
        const note = musicEnabled ? ' (add sound files to sounds/ folder)' : '';
        showMessage(`🎵 Music ${status}${note}`, 'info');
    }
    
    updateSoundButtons();
    return musicEnabled;
}

function setSoundEnabled(enabled) {
    soundEnabled = enabled;
    updateSoundButtons();
}

function setMusicEnabled(enabled) {
    musicEnabled = enabled;
    if (enabled) {
        playSound('bgMusic');
    } else {
        stopSound('bgMusic');
    }
    updateSoundButtons();
}

function isSoundEnabled() {
    return soundEnabled;
}

function isMusicEnabled() {
    return musicEnabled;
}

// ==========================================
// UI Updates
// ==========================================

function updateSoundButtons() {
    const soundBtn = document.getElementById('soundToggle');
    const musicBtn = document.getElementById('musicToggle');
    
    if (soundBtn) {
        soundBtn.textContent = soundEnabled ? '🔊' : '🔇';
        soundBtn.title = soundEnabled ? 'Sounds On (audio files optional)' : 'Sounds Off';
        soundBtn.style.opacity = soundEnabled ? '1' : '0.5';
        
        // Visual indication
        if (soundEnabled) {
            soundBtn.classList.add('bg-green-100', 'border-green-400');
            soundBtn.classList.remove('bg-gray-100', 'border-gray-300');
        } else {
            soundBtn.classList.add('bg-gray-100', 'border-gray-300');
            soundBtn.classList.remove('bg-green-100', 'border-green-400');
        }
    }
    
    if (musicBtn) {
        musicBtn.textContent = musicEnabled ? '🎵' : '🎵';
        musicBtn.style.opacity = musicEnabled ? '1' : '0.5';
        musicBtn.title = musicEnabled ? 'Music On (audio files optional)' : 'Music Off';
        
        // Visual indication
        if (musicEnabled) {
            musicBtn.classList.add('bg-blue-100', 'border-blue-400');
            musicBtn.classList.remove('bg-gray-100', 'border-gray-300');
        } else {
            musicBtn.classList.add('bg-gray-100', 'border-gray-300');
            musicBtn.classList.remove('bg-blue-100', 'border-blue-400');
        }
    }
}

// ==========================================
// Preference Management
// ==========================================

function loadSoundPreferences(currentUser) {
    if (!currentUser || !currentUser.preferences) return;
    
    try {
        const prefs = JSON.parse(currentUser.preferences);
        soundEnabled = prefs.soundEnabled !== false;
        musicEnabled = prefs.musicEnabled === true;
        
        // Start music if enabled
        if (musicEnabled) {
            playSound('bgMusic');
        }
        
        updateSoundButtons();
        console.log('✅ Loaded sound preferences:', { soundEnabled, musicEnabled });
    } catch (e) {
        console.log('Using default sound settings');
    }
}

function saveSoundPreferences(currentUser) {
    if (!currentUser) return null;
    
    try {
        const prefs = JSON.parse(currentUser.preferences || '{}');
        prefs.soundEnabled = soundEnabled;
        prefs.musicEnabled = musicEnabled;
        
        const updatedPrefs = JSON.stringify(prefs);
        return updatedPrefs;
    } catch (e) {
        console.error('Error saving sound preferences:', e);
        return null;
    }
}

// ==========================================
// Contextual Sounds
// ==========================================

function playCelebration() {
    playSound('fanfare');
}

function playSuccess() {
    playSound('success');
}

function playError() {
    playSound('error');
}

function playClick() {
    playSound('click');
}

function playDrop() {
    playSound('drop');
}

function playRemove() {
    playSound('remove');
}

// Export functions
if (typeof window !== 'undefined') {
    window.Sounds = {
        initSounds,
        playSound,
        stopSound,
        toggleSound,
        toggleMusic,
        setSoundEnabled,
        setMusicEnabled,
        isSoundEnabled,
        isMusicEnabled,
        loadSoundPreferences,
        saveSoundPreferences,
        updateSoundButtons,
        // Convenience functions
        playCelebration,
        playSuccess,
        playError,
        playClick,
        playDrop,
        playRemove
    };
}
