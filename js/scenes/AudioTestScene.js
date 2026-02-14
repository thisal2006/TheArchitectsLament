class AudioTestScene {
    constructor() {
        this.active = false;
    }

    show() {
        this.active = true;
        
        const testScreen = document.createElement('div');
        testScreen.id = 'audio-test-screen';
        testScreen.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #0a0a1a;
            z-index: 30000;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            font-family: 'Courier New', monospace;
        `;

        testScreen.innerHTML = `
            <h1 style="color: #00ffff; margin-bottom: 30px;">AUDIO SYSTEM TEST</h1>
            
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; max-width: 800px;">
                <button id="test-click" class="btn-primary">🔊 Click</button>
                <button id="test-choice" class="btn-primary">🎯 Choice</button>
                <button id="test-glitch" class="btn-primary">⚡ Glitch</button>
                <button id="test-reveal" class="btn-primary">🎭 Reveal</button>
                <button id="test-hover" class="btn-primary">🖱️ Hover</button>
                <button id="test-save" class="btn-primary">💾 Save</button>
            </div>
            
            <div style="margin-top: 30px; display: flex; gap: 20px;">
                <button id="test-sci-fi" class="btn-secondary">🚀 Sci-Fi Music</button>
                <button id="test-fantasy" class="btn-secondary">⚔️ Fantasy Music</button>
                <button id="test-horror" class="btn-secondary">👻 Horror Music</button>
                <button id="test-twist" class="btn-secondary">🔄 Twist Music</button>
            </div>
            
            <div style="margin-top: 30px;">
                <button id="test-procedural" class="btn-tertiary">🎹 Test Procedural</button>
            </div>
            
            <div style="margin-top: 50px;">
                <button id="close-test" class="btn-danger">CLOSE</button>
            </div>
        `;

        document.body.appendChild(testScreen);

        // Bind test buttons
        document.getElementById('test-click').onclick = () => audioSystem.playSound('click');
        document.getElementById('test-choice').onclick = () => audioSystem.playSound('choice');
        document.getElementById('test-glitch').onclick = () => audioSystem.playSound('glitch');
        document.getElementById('test-reveal').onclick = () => audioSystem.playSound('reveal');
        document.getElementById('test-hover').onclick = () => audioSystem.playSound('hover');
        document.getElementById('test-save').onclick = () => audioSystem.playSound('save');
        
        document.getElementById('test-sci-fi').onclick = () => audioSystem.playMusic('act1_sci_fi');
        document.getElementById('test-fantasy').onclick = () => audioSystem.playMusic('act2_fantasy');
        document.getElementById('test-horror').onclick = () => audioSystem.playMusic('act3_horror');
        document.getElementById('test-twist').onclick = () => audioSystem.playMusic('twist_theme');
        
        document.getElementById('test-procedural').onclick = () => proceduralAudio.testAll();
        
        document.getElementById('close-test').onclick = () => {
            testScreen.remove();
            this.active = false;
            audioSystem.playMenuMusic();
        };
    }
}

const audioTestScene = new AudioTestScene();