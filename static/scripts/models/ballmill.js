export class BallMill {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.rotation = 0;
        this.materialLevel = 0.4; // Material fill level (0-1)
        this.ballPositions = this.generateBallPositions();
    }

    generateBallPositions() {
        const balls = [];
        const numBalls = 15;
        for (let i = 0; i < numBalls; i++) {
            balls.push({
                x: Math.random() * 0.8 + 0.1, // Relative position (0-1)
                y: Math.random() * 0.6 + 0.2,
                size: Math.random() * 4 + 3
            });
        }
        return balls;
    }

    draw(ctx) {
        ctx.save();

        // Draw support structure
        this.drawSupportStructure(ctx);

        // Draw main mill body
        this.drawMillBody(ctx);

        // Draw material and grinding balls
        this.drawMaterialAndBalls(ctx);

        // Draw mill details
        this.drawMillDetails(ctx);

        // Draw drive system
        // this.drawDriveSystem(ctx);

        // Draw control elements
        // this.drawControlElements(ctx);

        ctx.restore();
    }

    drawSupportStructure(ctx) {
        // Foundation and support frame
        ctx.fillStyle = "#505050";
        ctx.strokeStyle = "#404040";
        ctx.lineWidth = 2;

        // Base foundation
        const foundationHeight = 20;
        ctx.fillRect(this.x - 10, this.y + this.height, this.width + 20, foundationHeight);
        ctx.strokeRect(this.x - 10, this.y + this.height, this.width + 20, foundationHeight);

        // Support pedestals
        const pedestalWidth = 15;
        ctx.fillRect(this.x - 5, this.y + this.height - 10, pedestalWidth, 30);
        ctx.strokeRect(this.x - 5, this.y + this.height - 10, pedestalWidth, 30);

        ctx.fillRect(this.x + this.width - 10, this.y + this.height - 10, pedestalWidth, 30);
        ctx.strokeRect(this.x + this.width - 10, this.y + this.height - 10, pedestalWidth, 30);

        // Cross bracing
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(this.x + 5, this.y + this.height + 10);
        ctx.lineTo(this.x + this.width - 5, this.y + this.height + 10);
        ctx.stroke();
    }

    drawMillBody(ctx) {
        // Main cylindrical mill body with metallic gradient
        const gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
        gradient.addColorStop(0, "#d5d5d5");
        gradient.addColorStop(0.3, "#c0c0c0");
        gradient.addColorStop(0.7, "#b0b0b0");
        gradient.addColorStop(1, "#a0a0a0");

        ctx.fillStyle = gradient;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Mill shell outline
        ctx.strokeStyle = "#404040";
        ctx.lineWidth = 3;
        ctx.strokeRect(this.x, this.y, this.width, this.height);

        // Cylindrical reinforcement rings
        ctx.strokeStyle = "#606060";
        ctx.lineWidth = 2;
        for (let i = 1; i < 4; i++) {
            const ringX = this.x + (this.width * i / 4);
            ctx.beginPath();
            ctx.moveTo(ringX, this.y);
            ctx.lineTo(ringX, this.y + this.height);
            ctx.stroke();
        }

        // Horizontal reinforcement bands
        for (let i = 1; i < 3; i++) {
            const bandY = this.y + (this.height * i / 3);
            ctx.beginPath();
            ctx.moveTo(this.x, bandY);
            ctx.lineTo(this.x + this.width, bandY);
            ctx.stroke();
        }
    }

    drawMaterialAndBalls(ctx) {
        if (this.materialLevel <= 0) return;

        const materialHeight = this.height * this.materialLevel;
        const materialY = this.y + this.height - materialHeight;

        // Ore/material being ground
        ctx.fillStyle = "rgba(139, 69, 19, 0.7)"; // Brown ore color
        ctx.fillRect(this.x + 5, materialY, this.width - 10, materialHeight - 5);

        // Grinding balls
        this.ballPositions.forEach((ball, index) => {
            // Animate ball positions based on rotation
            const animatedX = this.x + (this.width - 20) * ball.x + 10;
            const baseY = materialY + (materialHeight - 10) * ball.y;

            // Add rotation effect to ball movement
            const rotationOffset = Math.sin(this.rotation + index) * 5;
            const animatedY = baseY + rotationOffset;

            // Draw grinding ball
            const ballGradient = ctx.createRadialGradient(
                animatedX - 2, animatedY - 2, 1,
                animatedX, animatedY, ball.size
            );
            ballGradient.addColorStop(0, "#f0f0f0");
            ballGradient.addColorStop(1, "#808080");

            ctx.fillStyle = ballGradient;
            ctx.beginPath();
            ctx.arc(animatedX, animatedY, ball.size, 0, Math.PI * 2);
            ctx.fill();

            // Ball highlight
            ctx.strokeStyle = "#606060";
            ctx.lineWidth = 1;
            ctx.stroke();
        });

        // Material dust/powder effect
        ctx.fillStyle = "rgba(160, 82, 45, 0.4)";
        for (let i = 0; i < 10; i++) {
            const dustX = this.x + 10 + Math.random() * (this.width - 20);
            const dustY = materialY + Math.random() * (materialHeight - 10);
            ctx.beginPath();
            ctx.arc(dustX, dustY, 1, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    drawMillDetails(ctx) {
        // Feed chute (inlet)
        ctx.fillStyle = "#808080";
        ctx.strokeStyle = "#404040";
        ctx.lineWidth = 2;

        const chuteWidth = 25;
        const chuteHeight = 15;
        const chuteX = this.x + this.width * 0.2 - chuteWidth / 2;
        const chuteY = this.y - chuteHeight;

        ctx.fillRect(chuteX, chuteY, chuteWidth, chuteHeight + 5);
        ctx.strokeRect(chuteX, chuteY, chuteWidth, chuteHeight + 5);

        // Discharge chute (outlet)
        const dischargeChuteX = this.x + this.width * 0.8 - chuteWidth / 2;
        const dischargeChuteY = this.y + this.height;

        ctx.fillRect(dischargeChuteX, dischargeChuteY, chuteWidth, chuteHeight);
        ctx.strokeRect(dischargeChuteX, dischargeChuteY, chuteWidth, chuteHeight);

        // Manhole covers
        const manholeRadius = 8;
        ctx.fillStyle = "#909090";

        // Top manhole
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y - 5, manholeRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Side inspection port
        ctx.beginPath();
        ctx.arc(this.x - 5, this.y + this.height / 2, manholeRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Manhole bolts
        ctx.fillStyle = "#606060";
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            const boltX = this.x + this.width / 2 + Math.cos(angle) * (manholeRadius - 2);
            const boltY = this.y - 5 + Math.sin(angle) * (manholeRadius - 2);
            ctx.beginPath();
            ctx.arc(boltX, boltY, 1.5, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    drawDriveSystem(ctx) {
        // Main drive motor
        ctx.fillStyle = "#4a5d23";
        ctx.strokeStyle = "#404040";
        ctx.lineWidth = 2;

        const motorWidth = 30;
        const motorHeight = 25;
        const motorX = this.x - motorWidth - 10;
        const motorY = this.y + this.height / 2 - motorHeight / 2;

        ctx.fillRect(motorX, motorY, motorWidth, motorHeight);
        ctx.strokeRect(motorX, motorY, motorWidth, motorHeight);

        // Motor cooling fins
        ctx.strokeStyle = "#606060";
        ctx.lineWidth = 1;
        for (let i = 1; i < 5; i++) {
            const finY = motorY + (motorHeight * i / 5);
            ctx.beginPath();
            ctx.moveTo(motorX, finY);
            ctx.lineTo(motorX + motorWidth, finY);
            ctx.stroke();
        }

        // Drive shaft
        ctx.strokeStyle = "#808080";
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(motorX + motorWidth, motorY + motorHeight / 2);
        ctx.lineTo(this.x - 5, motorY + motorHeight / 2);
        ctx.stroke();

        // Gear reducer
        ctx.fillStyle = "#606060";
        ctx.fillRect(this.x - 15, motorY + 5, 10, 15);
        ctx.strokeRect(this.x - 15, motorY + 5, 10, 15);

        // Rotation indicator
        ctx.save();
        ctx.translate(motorX + motorWidth / 2, motorY + motorHeight / 2);
        ctx.rotate(this.rotation);
        ctx.strokeStyle = "#ff0000";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(10, 0);
        ctx.stroke();
        ctx.restore();
    }

    drawControlElements(ctx) {
        // Control cabinet
        const cabinetX = this.x + this.width + 20;
        const cabinetY = this.y + 10;
        const cabinetWidth = 35;
        const cabinetHeight = 60;

        ctx.fillStyle = "#a0a0a0";
        ctx.strokeStyle = "#505050";
        ctx.lineWidth = 2;
        ctx.fillRect(cabinetX, cabinetY, cabinetWidth, cabinetHeight);
        ctx.strokeRect(cabinetX, cabinetY, cabinetWidth, cabinetHeight);

        // Status indicators
        const indicators = ["#00ff00", "#ffff00", "#ff0000"];
        indicators.forEach((color, i) => {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(cabinetX + 10, cabinetY + 15 + i * 12, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = "#333333";
            ctx.lineWidth = 1;
            ctx.stroke();
        });

        // Control switches
        ctx.fillStyle = "#707070";
        ctx.fillRect(cabinetX + 20, cabinetY + 10, 8, 15);
        ctx.strokeRect(cabinetX + 20, cabinetY + 10, 8, 15);
        ctx.fillRect(cabinetX + 20, cabinetY + 30, 8, 15);
        ctx.strokeRect(cabinetX + 20, cabinetY + 30, 8, 15);

        // Speed indicator
        ctx.strokeStyle = "#404040";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cabinetX + 17, cabinetY + cabinetHeight - 15, 12, 0, Math.PI * 2);
        ctx.stroke();

        // Speed needle
        ctx.save();
        ctx.translate(cabinetX + 17, cabinetY + cabinetHeight - 15);
        ctx.rotate(this.rotation * 0.1);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(10, 0);
        ctx.stroke();
        ctx.restore();
    }

    // Animation method
    animate() {
        this.rotation += 0.02;

        // Occasionally shuffle ball positions for realistic movement
        if (Math.random() < 0.05) {
            this.ballPositions.forEach(ball => {
                ball.x += (Math.random() - 0.5) * 0.02;
                ball.y += (Math.random() - 0.5) * 0.02;
                ball.x = Math.max(0.1, Math.min(0.9, ball.x));
                ball.y = Math.max(0.1, Math.min(0.9, ball.y));
            });
        }
    }

    // Method to set material level
    setMaterialLevel(level) {
        this.materialLevel = Math.max(0, Math.min(1, level));
    }
}
