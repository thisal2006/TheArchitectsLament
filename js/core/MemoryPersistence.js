class MemoryPersistence {
    constructor() {
        this.memories = [];
        this.loadMemories();
    }

    addMemory(memory) {
        this.memories.push({
            ...memory,
            timestamp: new Date().toISOString()
        });
        
        this.saveMemories();
        
        // Show memory fragment
        this.showMemoryFragment(memory);
    }

    showMemoryFragment(memory) {
        const fragment = document.createElement('div');
        fragment.className = 'memory-fragment';
        fragment.innerHTML = `
            <div class="memory-icon">💭</div>
            <div class="memory-text">${memory.text}</div>
        `;
        
        fragment.style.cssText = `
            position: fixed;
            top: ${Math.random() * 80 + 10}vh;
            left: ${Math.random() * 80 + 10}vw;
            background: rgba(0, 255, 255, 0.1);
            border: 1px solid #00ffff;
            color: #00ffff;
            padding: 15px;
            border-radius: 5px;
            z-index: 9996;
            animation: memoryFloat 5s ease;
            pointer-events: none;
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes memoryFloat {
                0% { opacity: 0; transform: scale(0.5); }
                20% { opacity: 1; transform: scale(1); }
                80% { opacity: 1; transform: scale(1) translateY(-20px); }
                100% { opacity: 0; transform: scale(0.5) translateY(-40px); }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(fragment);
        
        setTimeout(() => {
            fragment.remove();
            style.remove();
        }, 5000);
    }

    saveMemories() {
        localStorage.setItem('architect_memories', JSON.stringify(this.memories));
    }

    loadMemories() {
        const saved = localStorage.getItem('architect_memories');
        if (saved) {
            this.memories = JSON.parse(saved);
        }
    }

    getMemories() {
        return this.memories;
    }

    clearMemories() {
        this.memories = [];
        localStorage.removeItem('architect_memories');
    }
}

const memoryPersistence = new MemoryPersistence();