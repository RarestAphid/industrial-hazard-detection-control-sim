export class MaterialPellet {
    constructor(type, x, y) {
        this.type = type; // 'BaSO4', 'Slurry', 'BaS', 'CrushedBaS'
        this.x = x;
        this.y = y;
        this.radius = 4; // Small size (4px radius)
        this.color = this.getColorForType(type);
        this.processed = false;
        this.blended = false;
        this.kilned = false;
        this.milled = false;
        this.speed = 2;
        this.targetX = null;
        this.targetY = null;
    }

    getColorForType(type) {
        const colors = {
            'BaSO4': '#ffffff',    // White
            'Slurry': '#2c2c2c',   // Black (Pet Coke + BaSO4 slurry)
            'BaS': '#4a4a4a',      // Dark Gray (BaS ash from kiln)
            'CrushedBaS': '#666666' // Light Gray (crushed BaS from ball mill)
        };
        return colors[type] || '#ff0000'; // Red for unknown/error
    }

    setTarget(targetX, targetY) {
        this.targetX = targetX;
        this.targetY = targetY;
    }

    update() {
        if (this.targetX !== null && this.targetY !== null) {
            // Move towards target
            const dx = this.targetX - this.x;
            const dy = this.targetY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > this.speed) {
                this.x += (dx / distance) * this.speed;
                this.y += (dy / distance) * this.speed;
            } else {
                // Reached target
                this.x = this.targetX;
                this.y = this.targetY;
                this.targetX = null;
                this.targetY = null;
            }
        }
    }

    draw(ctx) {
        if (this.processed) return; // Don't draw processed pellets

        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();

        // Add a slight stroke for definition
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 0.5;
        ctx.stroke();
        ctx.restore();
    }

    // Transform the pellet to a new type
    transform(newType) {
        this.type = newType;
        // this.color = this.getColorForType(newType);
    }

    // Check if pellet is at a specific device
    isAtDevice(deviceX, deviceY, deviceWidth, deviceHeight) {
        return this.x >= deviceX &&
               this.x <= deviceX + deviceWidth &&
               this.y >= deviceY &&
               this.y <= deviceY + deviceHeight;
    }
}
