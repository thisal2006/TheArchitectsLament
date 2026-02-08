class Effects {
    static flash(color = '#00aaff', duration = 300) {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: ${color};
            opacity: 0.3;
            pointer-events: none;
            z-index: 1000;
        `;
        document.body.appendChild(overlay);
        
        setTimeout(() => {
            overlay.style.transition = 'opacity 0.5s';
            overlay.style.opacity = '0';
            setTimeout(() => overlay.remove(), 500);
        }, duration);
    }

    static shake(element, intensity = 5) {
        const originalX = element.offsetLeft;
        const originalY = element.offsetTop;
        
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                const x = originalX + (Math.random() * intensity * 2 - intensity);
                const y = originalY + (Math.random() * intensity * 2 - intensity);
                element.style.transform = `translate(${x}px, ${y}px)`;
            }, i * 50);
        }
        
        setTimeout(() => {
            element.style.transform = 'translate(0, 0)';
            element.style.transition = 'transform 0.3s';
        }, 500);
    }

    static fadeIn(element, duration = 1000) {
        element.style.opacity = '0';
        element.style.transition = `opacity ${duration}ms`;
        
        setTimeout(() => {
            element.style.opacity = '1';
        }, 10);
    }
}