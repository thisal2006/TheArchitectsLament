class LoadingScreen {
    constructor() {
        this.progress = 0;
        this.totalAssets = 0;
        this.loadedAssets = 0;
        this.createScreen();
    }

    createScreen() {
        this.screen = document.createElement('div');
        this.screen.id = 'loading-screen';
        this.screen.innerHTML = `
            <div class="loading-container">
                <div class="loading-title">THE ARCHITECT'S LAMENT</div>
                <div class="loading-subtitle">Initializing Reality Simulation...</div>
                <div class="progress-container">
                    <div class="progress-bar"></div>
                    <div class="progress-text">0%</div>
                </div>
                <div class="loading-hint">Subject ID: ${saveSystem.subjectId}</div>
                <div class="loading-tip">Tip: Your choices shape the narrative</div>
            </div>
        `;
        
        this.screen.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #0a0a1a, #1a1a2e);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        `;

        this.container = this.screen.querySelector('.loading-container');
        this.container.style.cssText = `
            text-align: center;
            max-width: 600px;
            padding: 40px;
            background: rgba(0, 0, 0, 0.5);
            border-radius: 10px;
            border: 1px solid #00aaff;
        `;

        this.title = this.screen.querySelector('.loading-title');
        this.title.style.cssText = `
            font-size: 2.5rem;
            color: #00ffff;
            margin-bottom: 20px;
            text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
        `;

        this.subtitle = this.screen.querySelector('.loading-subtitle');
        this.subtitle.style.cssText = `
            font-size: 1.2rem;
            color: #8888cc;
            margin-bottom: 30px;
        `;

        this.progressBar = this.screen.querySelector('.progress-bar');
        this.progressText = this.screen.querySelector('.progress-text');
        
        const progressContainer = this.screen.querySelector('.progress-container');
        progressContainer.style.cssText = `
            background: rgba(0, 20, 40, 0.7);
            border-radius: 10px;
            height: 20px;
            margin: 30px 0;
            overflow: hidden;
            position: relative;
        `;

        this.progressBar.style.cssText = `
            height: 100%;
            background: linear-gradient(90deg, #0066ff, #00aaff);
            width: 0%;
            transition: width 0.3s ease;
        `;

        this.progressText.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
        `;

        this.hint = this.screen.querySelector('.loading-hint');
        this.hint.style.cssText = `
            color: #666699;
            font-size: 0.9rem;
            margin-top: 20px;
            font-family: monospace;
        `;

        this.tip = this.screen.querySelector('.loading-tip');
        this.tip.style.cssText = `
            color: #8888cc;
            font-size: 0.9rem;
            margin-top: 10px;
            font-style: italic;
        `;

        document.body.appendChild(this.screen);
    }

    setTotalAssets(count) {
        this.totalAssets = count;
    }

    updateProgress(assetName = '') {
        this.loadedAssets++;
        this.progress = Math.floor((this.loadedAssets / this.totalAssets) * 100);
        
        this.progressBar.style.width = `${this.progress}%`;
        this.progressText.textContent = `${this.progress}%`;
        
        if (assetName) {
            this.subtitle.textContent = `Loading: ${assetName}...`;
        }

        if (this.progress >= 100) {
            setTimeout(() => this.hide(), 500);
        }
    }

    hide() {
        this.screen.style.opacity = '0';
        this.screen.style.transition = 'opacity 0.5s';
        setTimeout(() => {
            this.screen.style.display = 'none';
        }, 500);
    }

    show() {
        this.screen.style.display = 'flex';
        this.screen.style.opacity = '1';
    }

    simulateLoad(steps = 10) {
        this.setTotalAssets(steps);
        let current = 0;
        
        const assets = [
            'Event System',
            'Save Module',
            'Dialogue Engine',
            'Visual Assets',
            'Audio System',
            'Narrative Data',
            'Moral Calculator',
            'Reality Simulator',
            'Experiment Protocols',
            'Finalizing Simulation'
        ];

        const interval = setInterval(() => {
            this.updateProgress(assets[current]);
            current++;
            
            if (current >= steps) {
                clearInterval(interval);
            }
        }, 300);
    }
}

const loadingScreen = new LoadingScreen();