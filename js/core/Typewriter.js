class Typewriter {
    constructor(element, speed = 30) {
        this.element = element;
        this.speed = speed; // characters per second
        this.currentText = '';
        this.fullText = '';
        this.isTyping = false;
        this.timeout = null;
    }

    type(text) {
        this.fullText = text;
        this.currentText = '';
        this.isTyping = true;
        this.element.textContent = '';
        
        const charsPerInterval = 2;
        const interval = 1000 / this.speed * charsPerInterval;
        
        let i = 0;
        const typeChar = () => {
            if (i < text.length) {
                this.currentText += text.substring(i, i + charsPerInterval);
                this.element.textContent = this.currentText;
                i += charsPerInterval;
                this.timeout = setTimeout(typeChar, interval);
            } else {
                this.isTyping = false;
                this.onComplete();
            }
        };
        
        typeChar();
    }

    complete() {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        this.element.textContent = this.fullText;
        this.isTyping = false;
        this.onComplete();
    }

    onComplete() {
        // Override in implementation
    }
}