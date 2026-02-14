# Audio System Documentation

## Overview
The Architect's Lament features a comprehensive audio system with:
- Background music with crossfading
- Sound effects with volume control
- Procedural audio generation (fallback)
- Persistent user settings
- Visual audio indicators

## Architecture

### Core Components
1. **AudioSystem.js** - Main audio controller
2. **ProceduralAudio.js** - Fallback sound generator
3. **AudioSettings.js** - Settings UI
4. **AudioIndicator.js** - Visual status indicator

## Features

### Volume Control
- Separate music and SFX volume sliders
- Smooth fade transitions (500ms default)
- Crossfade between music tracks (2000ms)

### Sound Effects
- UI interactions (click, hover)
- Gameplay events (choices, saves)
- Twist system (glitches, reveals)
- Act-specific ambient sounds

### Background Music
- Act-specific themes
- Menu theme
- Twist reveal theme
- Ending credits theme
- Automatic crossfading

### Procedural Generation
Fallback system when audio files are missing:
- UI clicks (800Hz sine wave)
- Choice selection (600→400Hz)
- Glitch effects (noise + filters)
- Ambient drones
- Musical chords

## Usage Examples

```javascript
// Play sound effect
audioSystem.playSound('click', { volume: 0.5, pitch: 1.2 });

// Change background music with crossfade
audioSystem.crossfadeMusic('act1_sci_fi', 3000);

// Adjust volume smoothly
audioSystem.setMusicVolume(0.7, true);

// Toggle mute
const isMuted = audioSystem.toggleMute();