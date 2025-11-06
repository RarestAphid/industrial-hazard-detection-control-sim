export class Kiln {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.rotation = 0; // For rotating effect
    }

    draw(ctx) {
        ctx.save();

        // Main kiln body (cylindrical appearance)
        this.drawMainBody(ctx);

        // Support structure
        this.drawSupportStructure(ctx);

        // End caps
        this.drawEndCaps(ctx);

        // Burner/flame
        this.drawBurner(ctx);

        // Support rollers
        // this.drawSupportRollers(ctx);

        // Control panel/details
        // this.drawControlDetails(ctx);

        // Rotating ring gear (visual detail)
        // this.drawRingGear(ctx);

        ctx.restore();
    }

    drawMainBody(ctx) {
        const centerY = this.y + this.height / 2;

        // Main cylindrical body with heat gradient
        const gradient = ctx.createLinearGradient(this.x, this.y, this.x + this.width, this.y);
        gradient.addColorStop(0, "#ff6b35");
        gradient.addColorStop(0.3, "#ff8c42");
        gradient.addColorStop(0.6, "#ffc649");
        gradient.addColorStop(1, "#ffdd59");

        // Main body
        ctx.fillStyle = gradient;
        ctx.fillRect(this.x + 20, this.y + 10, this.width - 40, this.height - 20);

        // Body outline
        ctx.strokeStyle = "#2c2c2c";
        ctx.lineWidth = 3;
        ctx.strokeRect(this.x + 20, this.y + 10, this.width - 40, this.height - 20);

        // Cylindrical rings/bands for structural detail
        ctx.strokeStyle = "#1a1a1a";
        ctx.lineWidth = 2;
        for (let i = 1; i < 4; i++) {
            const bandX = this.x + 20 + (this.width - 40) * (i / 4);
            ctx.beginPath();
            ctx.moveTo(bandX, this.y + 10);
            ctx.lineTo(bandX, this.y + this.height - 10);
            ctx.stroke();
        }

        // Heat shimmer effect (wavy lines)
        /*
        ctx.strokeStyle = "rgba(255, 140, 66, 0.6)";
        ctx.lineWidth = 1;
        for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            const waveY = this.y - 10 - (i * 3);
            for (let x = this.x + 20; x < this.x + this.width - 20; x += 10) {
                const wave = Math.sin((x + this.rotation * 2) * 0.1) * 3;
                if (x === this.x + 20) {
                    ctx.moveTo(x, waveY + wave);
                } else {
                    ctx.lineTo(x, waveY + wave);
                }
            }
            ctx.stroke();
        }
        */
    }

    drawSupportStructure(ctx) {
        const centerY = this.y + this.height / 2;
        const supportHeight = 30;

        // Support legs
        ctx.fillStyle = "#404040";
        ctx.strokeStyle = "#2c2c2c";
        ctx.lineWidth = 2;

        // Left support
        ctx.fillRect(this.x + 30, this.y + this.height - 10, 15, supportHeight);
        ctx.strokeRect(this.x + 30, this.y + this.height - 10, 15, supportHeight);

        // Right support
        ctx.fillRect(this.x + this.width - 45, this.y + this.height - 10, 15, supportHeight);
        ctx.strokeRect(this.x + this.width - 45, this.y + this.height - 10, 15, supportHeight);

        // Cross bracing
        ctx.beginPath();
        ctx.moveTo(this.x + 37, this.y + this.height + 20);
        ctx.lineTo(this.x + this.width - 37, this.y + this.height + 20);
        ctx.stroke();
    }

    drawEndCaps(ctx) {
        // Left end cap (feed end)
        ctx.fillStyle = "#5a5a5a";
        ctx.strokeStyle = "#2c2c2c";
        ctx.lineWidth = 2;
        ctx.fillRect(this.x, this.y + 15, 25, this.height - 30);
        ctx.strokeRect(this.x, this.y + 15, 25, this.height - 30);

        // Right end cap (discharge end)
        ctx.fillRect(this.x + this.width - 25, this.y + 15, 25, this.height - 30);
        ctx.strokeRect(this.x + this.width - 25, this.y + 15, 25, this.height - 30);

        // End cap details (bolts)
        ctx.fillStyle = "#808080";
        for (let i = 0; i < 3; i++) {
            const boltY = this.y + 25 + i * ((this.height - 50) / 2);
            // Left bolts
            ctx.beginPath();
            ctx.arc(this.x + 12, boltY, 3, 0, Math.PI * 2);
            ctx.fill();
            // Right bolts
            ctx.beginPath();
            ctx.arc(this.x + this.width - 12, boltY, 3, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    drawBurner(ctx) {
        // Burner assembly
        ctx.fillStyle = "#666666";
        ctx.strokeStyle = "#333333";
        ctx.lineWidth = 2;

        const burnerWidth = 40;
        const burnerHeight = 20;
        const burnerX = this.x + this.width - 65;
        const burnerY = this.y + this.height / 2 - burnerHeight / 2;

        ctx.fillRect(burnerX, burnerY, burnerWidth, burnerHeight);
        ctx.strokeRect(burnerX, burnerY, burnerWidth, burnerHeight);

        // Flame effect
        const flameGradient = ctx.createRadialGradient(
            burnerX + burnerWidth, burnerY + burnerHeight / 2, 5,
            burnerX + burnerWidth + 30, burnerY + burnerHeight / 2, 25
        );
        flameGradient.addColorStop(0, "rgba(255, 100, 0, 0.8)");
        flameGradient.addColorStop(0.5, "rgba(255, 200, 0, 0.6)");
        flameGradient.addColorStop(1, "rgba(255, 255, 0, 0.2)");

        ctx.fillStyle = flameGradient;
        ctx.beginPath();
        ctx.ellipse(burnerX + burnerWidth + 15, burnerY + burnerHeight / 2, 20, 8, 0, 0, Math.PI * 2);
        ctx.fill();
    }

    drawSupportRollers(ctx) {
        // Support rollers under the kiln
        ctx.fillStyle = "#606060";
        ctx.strokeStyle = "#404040";
        ctx.lineWidth = 1;

        const rollerRadius = 8;
        const rollerY = this.y + this.height + 5;

        // Multiple support rollers
        for (let i = 1; i < 4; i++) {
            const rollerX = this.x + (this.width * i / 4);
            ctx.beginPath();
            ctx.arc(rollerX, rollerY, rollerRadius, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        }
    }

    drawControlDetails(ctx) {
        // Control panel
        ctx.fillStyle = "#8a8a8a";
        ctx.strokeStyle = "#555555";
        ctx.lineWidth = 1;

        const panelX = this.x + 50;
        const panelY = this.y - 25;
        const panelWidth = 60;
        const panelHeight = 20;

        ctx.fillRect(panelX, panelY, panelWidth, panelHeight);
        ctx.strokeRect(panelX, panelY, panelWidth, panelHeight);

        // Indicator lights
        const colors = ["#00ff00", "#ffff00", "#ff0000"];
        for (let i = 0; i < 3; i++) {
            ctx.fillStyle = colors[i];
            ctx.beginPath();
            ctx.arc(panelX + 10 + i * 15, panelY + 10, 4, 0, Math.PI * 2);
            ctx.fill();
        }

        // Temperature gauge
        ctx.strokeStyle = "#333333";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(this.x + this.width - 50, this.y - 20, 15, 0, Math.PI * 2);
        ctx.stroke();

        // Gauge needle
        ctx.beginPath();
        ctx.moveTo(this.x + this.width - 50, this.y - 20);
        const angle = (this.rotation * 0.1) % (Math.PI * 2);
        ctx.lineTo(
            this.x + this.width - 50 + Math.cos(angle) * 12,
            this.y - 20 + Math.sin(angle) * 12
        );
        ctx.stroke();
    }

    drawRingGear(ctx) {
        // Ring gears wrapping around the cylindrical kiln (side profile view)
        ctx.strokeStyle = "#404040";
        ctx.lineWidth = 3;

        // Create 2-3 ring gears at different positions along the kiln
        const gearPositions = [0.25, 0.75]; // Position along kiln length
        const gearWidth = 12; // Width of the gear band
        const toothHeight = 6;

        for (let pos of gearPositions) {
            const gearX = this.x + 20 + (this.width - 40) * pos - gearWidth / 2;

            // Main gear band (vertical lines showing the side of the ring)
            ctx.fillStyle = "#505050";
            ctx.fillRect(gearX, this.y + 8, gearWidth, this.height - 16);
            ctx.strokeRect(gearX, this.y + 8, gearWidth, this.height - 16);

            // Gear teeth on top and bottom edges
            ctx.fillStyle = "#404040";
            const numTeeth = 8; // Number of teeth visible on each edge
            const toothSpacing = gearWidth / numTeeth;

            // Top teeth
            for (let i = 0; i < numTeeth; i++) {
                const toothX = gearX + i * toothSpacing;
                ctx.fillRect(toothX, this.y + 8 - toothHeight, toothSpacing * 0.6, toothHeight);
                ctx.strokeRect(toothX, this.y + 8 - toothHeight, toothSpacing * 0.6, toothHeight);
            }

            // Bottom teeth
            for (let i = 0; i < numTeeth; i++) {
                const toothX = gearX + i * toothSpacing;
                ctx.fillRect(toothX, this.y + this.height - 8, toothSpacing * 0.6, toothHeight);
                ctx.strokeRect(toothX, this.y + this.height - 8, toothSpacing * 0.6, toothHeight);
            }

            // Add some depth lines to show the cylindrical nature
            ctx.strokeStyle = "#606060";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(gearX + 2, this.y + 10);
            ctx.lineTo(gearX + 2, this.y + this.height - 10);
            ctx.moveTo(gearX + gearWidth - 2, this.y + 10);
            ctx.lineTo(gearX + gearWidth - 2, this.y + this.height - 10);
            ctx.stroke();
        }
    }

    // Method to animate rotation
    animate() {
        this.rotation += 0.02;
    }
}
