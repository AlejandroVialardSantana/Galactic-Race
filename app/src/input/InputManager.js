class InputManager {
    constructor() {
        this.keys = {};
        this.justPressed = {};

        document.addEventListener('keydown', (event) => {
            if (!this.keys[event.key]) {
                // Recién presionada
                this.justPressed[event.key] = true; 
            }
            this.keys[event.key] = true;
        });
        document.addEventListener('keyup', (event) => {
            const key = event.key.toLowerCase();
            this.keys[event.key] = false;
            this.justPressed[event.key] = false;
        });
    }

    isKeyPressed(key) {
        return this.keys[key];
    }

    wasJustPressed(key) {
        if (this.justPressed[key]) {
            // Reinicia el estado de recién presionada
            this.justPressed[key] = false; 
            return true;
        }
        return false;
    }

    resetJustPressed() {
        for (const key in this.justPressed) {
            this.justPressed[key] = false;
        }
    }
}

export { InputManager };
