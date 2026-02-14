/**
 * Audio Asset Placeholder Generator
 * Run this script to create placeholder audio files
 * Node.js script - not part of the game, just for development
 */

const fs = require('fs');
const path = require('path');

console.log('Audio Asset Placeholder Generator');
console.log('=================================');

// Create directory structure
const dirs = [
    'assets/sounds',
    'assets/music'
];

dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Created directory: ${dir}`);
    }
});

// Create README with instructions
const readme = `# Audio Assets

This directory contains audio assets for The Architect's Lament.

## Sound Effects (.mp3, .wav, .ogg)
- click.mp3 - UI button click
- choice.mp3 - Choice selection
- complete.mp3 - Act completion
- error.mp3 - Error/negative feedback
- hover.mp3 - Button hover
- save.mp3 - Save/load game
- glitch.mp3 - Reality glitch
- reveal.mp3 - Twist reveal

## Music (.mp3)
- act1_ambient.mp3 - Sci-fi ambient
- act2_medieval.mp3 - Fantasy medieval
- act3_horror.mp3 - Horror atmosphere
- act4_office.mp3 - Office/realism
- menu_theme.mp3 - Main menu
- twist_reveal.mp3 - Twist reveal
- ending.mp3 - Ending credits

## License
All audio assets should be royalty-free or original compositions.
Recommended sources:
- https://freesound.org/
- https://incompetech.com/
- https://www.zapsplat.com/

The game includes procedural audio generation as fallback.
`;

fs.writeFileSync('assets/README.md', readme);
console.log('Created assets/README.md with instructions');

console.log('\n✅ Placeholder structure created!');
console.log('Add your audio files to the appropriate directories.');