// project/static/scripts/models/pump.js
export class Pump {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    draw(ctx) {
        ctx.save();

        // Main pump body (cylindrical look)
        const gradient = ctx.createLinearGradient(this.x, this.y, this.x + this.width, this.y);
        gradient.addColorStop(0, "#4f5b66");
        gradient.addColorStop(0.5, "#6c7a89");
        gradient.addColorStop(1, "#4f5b66");

        ctx.fillStyle = gradient;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.strokeStyle = "#2c2c2c";
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);

        // Flanges (left and right)
        const flangeRadius = 8;
        this.drawFlange(ctx, this.x, this.y + this.height / 2, flangeRadius);
        this.drawFlange(ctx, this.x + this.width, this.y + this.height / 2, flangeRadius);

        // Base plate
        ctx.fillStyle = "#3c3c3c";
        ctx.fillRect(this.x - 5, this.y + this.height, this.width + 10, 8);

        // Control panel
        // this.drawControlPanel(ctx);

        ctx.restore();
    }

    drawFlange(ctx, cx, cy, r) {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fillStyle = "#808080";
        ctx.fill();
        ctx.stroke();

        // Bolts around flange
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            const bx = cx + Math.cos(angle) * (r - 3);
            const by = cy + Math.sin(angle) * (r - 3);
            ctx.beginPath();
            ctx.arc(bx, by, 1.5, 0, Math.PI * 2);
            ctx.fillStyle = "#333";
            ctx.fill();
        }
    }

    drawControlPanel(ctx) {
        const panelX = this.x + this.width + 10;
        const panelY = this.y + this.height / 4;
        ctx.fillStyle = "#b0b0b0";
        ctx.fillRect(panelX, panelY, 15, this.height / 2);
        ctx.strokeRect(panelX, panelY, 15, this.height / 2);

        const lights = ["#00ff00", "#ffff00", "#ff0000"];
        for (let i = 0; i < 3; i++) {
            ctx.fillStyle = lights[i];
            ctx.beginPath();
            ctx.arc(panelX + 7.5, panelY + 6 + i * 8, 3, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}
