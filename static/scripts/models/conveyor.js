export class Conveyor {
    constructor(x, y, length) {
        this.x = x;
        this.y = y;
        this.length = length;
        this.beltOffset = 0; // For belt animation
        this.materialPackets = this.generateMaterialPackets();
    }

    generateMaterialPackets() {
        const packets = [];
        const numPackets = Math.floor(this.length / 40); // One packet every 40px
        for (let i = 0; i < numPackets; i++) {
            packets.push({
                x: (this.length / numPackets) * i,
                size: Math.random() * 8 + 5,
                color: `hsl(${30 + Math.random() * 30}, 60%, 40%)` // Brown/tan colors
            });
        }
        return packets;
    }

    draw(ctx) {
        ctx.save();

        // Draw support structure
        this.drawSupportStructure(ctx);

        // Draw belt system
        this.drawBeltSystem(ctx);

        // Draw control elements
        // this.drawControlElements(ctx);

        ctx.restore();
    }

    drawSupportStructure(ctx) {
        const structureHeight = 15;
        const structureY = this.y + 8;

        // Main support beam
        ctx.fillStyle = "#505050";
        ctx.strokeStyle = "#404040";
        ctx.lineWidth = 2;
        ctx.fillRect(this.x - 10, structureY, this.length + 20, structureHeight);
        ctx.strokeRect(this.x - 10, structureY, this.length + 20, structureHeight);

        // Support legs
        const numLegs = Math.floor(this.length / 80) + 2;
        for (let i = 0; i < numLegs; i++) {
            const legX = this.x - 5 + (this.length + 10) * (i / (numLegs - 1));
            const legHeight = 25;

            ctx.fillRect(legX - 3, structureY + structureHeight, 6, legHeight);
            ctx.strokeRect(legX - 3, structureY + structureHeight, 6, legHeight);
        }

        // Cross bracing
        ctx.lineWidth = 1;
        for (let i = 0; i < numLegs - 1; i++) {
            const leg1X = this.x - 5 + (this.length + 10) * (i / (numLegs - 1));
            const leg2X = this.x - 5 + (this.length + 10) * ((i + 1) / (numLegs - 1));

            ctx.beginPath();
            ctx.moveTo(leg1X, structureY + structureHeight + 5);
            ctx.lineTo(leg2X, structureY + structureHeight + 20);
            ctx.moveTo(leg2X, structureY + structureHeight + 5);
            ctx.lineTo(leg1X, structureY + structureHeight + 20);
            ctx.stroke();
        }
    }

    drawBeltSystem(ctx) {
        // Belt rollers/pulleys
        ctx.fillStyle = "#606060";
        ctx.strokeStyle = "#404040";
        ctx.lineWidth = 2;

        const rollerRadius = 8;
        const rollerY = this.y;

        // Drive pulley (left)
        ctx.beginPath();
        ctx.arc(this.x, rollerY, rollerRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Tail pulley (right)
        ctx.beginPath();
        ctx.arc(this.x + this.length, rollerY, rollerRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Intermediate support rollers
        const numRollers = Math.floor(this.length / 60);
        for (let i = 1; i < numRollers; i++) {
            const rollerX = this.x + (this.length * i / numRollers);
            ctx.beginPath();
            ctx.arc(rollerX, rollerY + 3, rollerRadius - 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        }

        // Belt (moving surface)
        const beltPattern = ctx.createPattern(this.createBeltTexture(), 'repeat');
        ctx.fillStyle = beltPattern || "#2a2a2a";

        // Top belt surface
        ctx.save();
        ctx.translate(this.beltOffset % 20, 0); // Belt movement animation
        ctx.fillRect(this.x - this.beltOffset % 20, this.y - 4, this.length + 20, 8);
        ctx.restore();

        // Belt outline
        ctx.strokeStyle = "#1a1a1a";
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y - 4, this.length, 8);

        // Belt cleats/texture lines
        ctx.strokeStyle = "#404040";
        ctx.lineWidth = 1;
        for (let i = 0; i < this.length / 10 + 2; i++) {
            const cleatX = this.x + (i * 10) - (this.beltOffset % 10);
            if (cleatX >= this.x - 5 && cleatX <= this.x + this.length + 5) {
                ctx.beginPath();
                ctx.moveTo(cleatX, this.y - 4);
                ctx.lineTo(cleatX, this.y + 4);
                ctx.stroke();
            }
        }

        // Side guards/guides
        ctx.strokeStyle = "#707070";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y - 6);
        ctx.lineTo(this.x + this.length, this.y - 6);
        ctx.moveTo(this.x, this.y + 6);
        ctx.lineTo(this.x + this.length, this.y + 6);
        ctx.stroke();
    }

    createBeltTexture() {
        // Create a small canvas for belt texture
        const textureCanvas = document.createElement('canvas');
        textureCanvas.width = 20;
        textureCanvas.height = 8;
        const textureCtx = textureCanvas.getContext('2d');

        // Create diamond plate pattern
        textureCtx.fillStyle = "#2a2a2a";
        textureCtx.fillRect(0, 0, 20, 8);

        textureCtx.fillStyle = "#3a3a3a";
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 2; j++) {
                textureCtx.fillRect(i * 7 + j * 3, j * 4, 3, 2);
            }
        }

        return textureCanvas;
    }

    drawMaterialOnBelt(ctx) {
        // Draw material packets moving on the belt
        this.materialPackets.forEach((packet, index) => {
            const materialX = this.x + packet.x - (this.beltOffset * 0.5) % this.length;

            // Wrap around the belt
            let drawX = materialX;
            if (drawX < this.x) drawX += this.length;
            if (drawX > this.x + this.length) drawX -= this.length;

            if (drawX >= this.x && drawX <= this.x + this.length) {
                // Material pile shape
                ctx.fillStyle = packet.color;
                ctx.beginPath();
                ctx.ellipse(drawX, this.y - 6, packet.size, packet.size * 0.6, 0, 0, Math.PI * 2);
                ctx.fill();

                // Material highlight
                ctx.fillStyle = `${packet.color}55`;
                ctx.beginPath();
                ctx.ellipse(drawX - 2, this.y - 7, packet.size * 0.6, packet.size * 0.4, 0, 0, Math.PI * 2);
                ctx.fill();
            }
        });
    }

    drawControlElements(ctx) {
        // Drive motor
        ctx.fillStyle = "#4a5d23";
        ctx.strokeStyle = "#404040";
        ctx.lineWidth = 2;

        const motorWidth = 20;
        const motorHeight = 15;
        const motorX = this.x - 25;
        const motorY = this.y - motorHeight / 2;

        ctx.fillRect(motorX, motorY, motorWidth, motorHeight);
        ctx.strokeRect(motorX, motorY, motorWidth, motorHeight);

        // Motor shaft
        ctx.strokeStyle = "#808080";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(motorX + motorWidth, motorY + motorHeight / 2);
        ctx.lineTo(this.x - 5, motorY + motorHeight / 2);
        ctx.stroke();

        // Emergency stop at end
        const stopX = this.x + this.length + 15;
        const stopY = this.y - 10;

        ctx.fillStyle = "#cc0000";
        ctx.beginPath();
        ctx.arc(stopX, stopY, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#800000";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Control box
        ctx.fillStyle = "#909090";
        ctx.strokeStyle = "#505050";
        ctx.lineWidth = 1;
        ctx.fillRect(stopX - 8, stopY + 10, 16, 12);
        ctx.strokeRect(stopX - 8, stopY + 10, 16, 12);

        // Status light
        ctx.fillStyle = "#00ff00";
        ctx.beginPath();
        ctx.arc(stopX, stopY + 16, 3, 0, Math.PI * 2);
        ctx.fill();
    }

    // Animation method
    animate() {
        this.beltOffset -= 1; // Belt speed

        // Reset offset to prevent overflow
        if (this.beltOffset > this.length * 2) {
            this.beltOffset = 0;
        }
    }

    // Method to add material packet
    addMaterial(x, size = 8, color = '#8B4513') {
        this.materialPackets.push({
            x: x || 0,
            size: size,
            color: color
        });
    }

    // Method to clear material
    clearMaterial() {
        this.materialPackets = [];
    }
}
