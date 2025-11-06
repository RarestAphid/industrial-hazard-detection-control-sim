// project/static/scripts/models/pipeline.js
export class Pipeline {
    constructor(x, y, length, orientation = "horizontal", withArrows = false) {
        this.x = x;
        this.y = y;
        this.length = length;
        this.orientation = orientation;
        this.withArrows = withArrows;
    }

    draw(ctx) {
        ctx.save();

        ctx.strokeStyle = "#555";
        ctx.lineWidth = 6;
        ctx.lineCap = "round";

        ctx.beginPath();
        if (this.orientation === "horizontal") {
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x + this.length, this.y);
        } else {
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x, this.y - this.length);
        }
        ctx.stroke();

        // Flanges at both ends
        this.drawFlange(ctx, this.x, this.y);
        if (this.orientation === "horizontal") {
            this.drawFlange(ctx, this.x + this.length, this.y);
        } else {
            this.drawFlange(ctx, this.x, this.y - this.length);
        }

        // Optional arrows
        if (this.withArrows) this.drawArrows(ctx);

        ctx.restore();
    }

    drawFlange(ctx, cx, cy) {
        ctx.fillStyle = "#888";
        ctx.beginPath();
        ctx.arc(cx, cy, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    }

    drawArrows(ctx) {
        const arrowCount = Math.floor(this.length / 50);
        ctx.fillStyle = "#222";
        for (let i = 0; i < arrowCount; i++) {
            const pos = this.orientation === "horizontal"
                ? this.x + (i + 0.5) * (this.length / arrowCount)
                : this.y - (i + 0.5) * (this.length / arrowCount);

            ctx.beginPath();
            if (this.orientation === "horizontal") {
                ctx.moveTo(pos, this.y - 5);
                ctx.lineTo(pos + 8, this.y);
                ctx.lineTo(pos, this.y + 5);
            } else {
                ctx.moveTo(this.x - 5, pos);
                ctx.lineTo(this.x, pos - 8);
                ctx.lineTo(this.x + 5, pos);
            }
            ctx.closePath();
            ctx.fill();
        }
    }
}
