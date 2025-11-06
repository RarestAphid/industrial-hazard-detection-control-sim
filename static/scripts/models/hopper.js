export class Hopper {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.materialLevel = 0.7; // Material fill level (0-1)
        this.dischargeOpen = false; // Discharge gate status
        this.vibrationOffset = 0; // For vibration animation
    }

    draw(ctx) {
        ctx.save();

        // Draw support structure
        this.drawSupportStructure(ctx);

        // Draw main hopper body
        this.drawHopperBody(ctx);

        // Draw material inside
        this.drawMaterial(ctx);

        // Draw hopper details
        this.drawHopperDetails(ctx);

        // Draw discharge mechanism
        // this.drawDischargeMechanism(ctx);

        // Draw control elements
        // this.drawControlElements(ctx);

        // Draw loading chute
        this.drawLoadingChute(ctx);

        ctx.restore();
    }

    drawSupportStructure(ctx) {
        // Support legs and frame
        ctx.fillStyle = "#505050";
        ctx.strokeStyle = "#404040";
        ctx.lineWidth = 2;

        const legWidth = 8;
        const legHeight = 25;
        const legSpacing = this.width * 0.8;

        // Left support leg
        const leftLegX = this.x + (this.width - legSpacing) / 2;
        ctx.fillRect(leftLegX, this.y + this.height, legWidth, legHeight);
        ctx.strokeRect(leftLegX, this.y + this.height, legWidth, legHeight);

        // Right support leg
        const rightLegX = this.x + this.width - (this.width - legSpacing) / 2 - legWidth;
        ctx.fillRect(rightLegX, this.y + this.height, legWidth, legHeight);
        ctx.strokeRect(rightLegX, this.y + this.height, legWidth, legHeight);

        // Cross bracing
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(leftLegX + legWidth / 2, this.y + this.height + legHeight - 5);
        ctx.lineTo(rightLegX + legWidth / 2, this.y + this.height + legHeight - 5);
        ctx.stroke();

        // Diagonal braces
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(leftLegX, this.y + this.height + 5);
        ctx.lineTo(rightLegX + legWidth, this.y + this.height + legHeight - 5);
        ctx.moveTo(rightLegX + legWidth, this.y + this.height + 5);
        ctx.lineTo(leftLegX, this.y + this.height + legHeight - 5);
        ctx.stroke();
    }

    drawHopperBody(ctx) {
        // Create metallic gradient for hopper body
        const gradient = ctx.createLinearGradient(this.x, this.y, this.x + this.width, this.y + this.height);
        gradient.addColorStop(0, "#e0e0e0");
        gradient.addColorStop(0.3, "#d0d0d0");
        gradient.addColorStop(0.7, "#c0c0c0");
        gradient.addColorStop(1, "#b0b0b0");

        ctx.fillStyle = gradient;

        // Main hopper body - rectangular top section
        const topHeight = this.height * 0.6;
        ctx.fillRect(this.x, this.y, this.width, topHeight);

        // Funnel section (trapezoidal)
        const bottomWidth = this.width * 0.3;
        const funnelHeight = this.height * 0.4;
        const funnelStartY = this.y + topHeight;

        ctx.beginPath();
        ctx.moveTo(this.x, funnelStartY);
        ctx.lineTo(this.x + this.width, funnelStartY);
        ctx.lineTo(this.x + this.width - (this.width - bottomWidth) / 2, this.y + this.height);
        ctx.lineTo(this.x + (this.width - bottomWidth) / 2, this.y + this.height);
        ctx.closePath();
        ctx.fill();

        // Hopper outline
        ctx.strokeStyle = "#404040";
        ctx.lineWidth = 3;
        ctx.strokeRect(this.x, this.y, this.width, topHeight);
        ctx.stroke(); // Funnel outline from previous path
    }

    drawMaterial(ctx) {
        if (this.materialLevel <= 0) return;

        // Petroleum coke material (dark brown/black)
        ctx.fillStyle = "rgba(50, 30, 20, 0.9)";

        const topHeight = this.height * 0.6;
        const materialHeight = topHeight * this.materialLevel;
        const materialY = this.y + topHeight - materialHeight;

        // Material in main body
        ctx.fillRect(this.x + 3, materialY, this.width - 6, materialHeight);

        // Material in funnel (if level is high enough)
        if (this.materialLevel > 0.8) {
            const funnelLevel = (this.materialLevel - 0.8) / 0.2;
            const funnelStartY = this.y + topHeight;
            const funnelMaterialHeight = (this.height * 0.4) * funnelLevel;
            const bottomWidth = this.width * 0.3;

            ctx.beginPath();
            ctx.moveTo(this.x + 3, funnelStartY);
            ctx.lineTo(this.x + this.width - 3, funnelStartY);
            const funnelBottomY = funnelStartY + funnelMaterialHeight;
            const funnelBottomLeft = this.x + (this.width - bottomWidth) / 2 + 3;
            const funnelBottomRight = this.x + this.width - (this.width - bottomWidth) / 2 - 3;
            ctx.lineTo(funnelBottomRight, funnelBottomY);
            ctx.lineTo(funnelBottomLeft, funnelBottomY);
            ctx.closePath();
            ctx.fill();
        }

        // Material surface texture
        ctx.fillStyle = "rgba(80, 50, 30, 0.6)";
        for (let i = 0; i < 12; i++) {
            const particleX = this.x + 10 + Math.random() * (this.width - 20);
            const particleY = materialY + Math.random() * Math.min(materialHeight, 20);
            ctx.beginPath();
            ctx.arc(particleX, particleY, 2 + Math.random() * 2, 0, Math.PI * 2);
            ctx.fill();
        }

        // Material level indicator
        ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(this.x, materialY);
        ctx.lineTo(this.x + this.width, materialY);
        ctx.stroke();
        ctx.setLineDash([]);
    }

    drawHopperDetails(ctx) {
        const topHeight = this.height * 0.6;

        // Reinforcement ribs on main body
        ctx.strokeStyle = "#606060";
        ctx.lineWidth = 2;

        // Vertical reinforcement ribs
        for (let i = 1; i < 3; i++) {
            const ribX = this.x + (this.width * i / 3);
            ctx.beginPath();
            ctx.moveTo(ribX, this.y + 5);
            ctx.lineTo(ribX, this.y + topHeight - 5);
            ctx.stroke();
        }

        // Horizontal reinforcement bands
        for (let i = 1; i < 3; i++) {
            const bandY = this.y + (topHeight * i / 3);
            ctx.beginPath();
            ctx.moveTo(this.x + 3, bandY);
            ctx.lineTo(this.x + this.width - 3, bandY);
            ctx.stroke();
        }

        // Corner reinforcements
        ctx.fillStyle = "#808080";
        const cornerSize = 6;
        // Top corners
        ctx.fillRect(this.x - 1, this.y - 1, cornerSize, cornerSize);
        ctx.fillRect(this.x + this.width - cornerSize + 1, this.y - 1, cornerSize, cornerSize);

        // Access ladder
        ctx.strokeStyle = "#707070";
        ctx.lineWidth = 3;
        const ladderX = this.x + this.width + 5;
        ctx.beginPath();
        ctx.moveTo(ladderX, this.y + topHeight);
        ctx.lineTo(ladderX, this.y + 10);
        ctx.stroke();

        // Ladder rungs
        ctx.lineWidth = 2;
        for (let i = 0; i < 4; i++) {
            const rungY = this.y + topHeight - 10 - (i * 12);
            ctx.beginPath();
            ctx.moveTo(ladderX - 5, rungY);
            ctx.lineTo(ladderX + 5, rungY);
            ctx.stroke();
        }
    }

    drawDischargeMechanism(ctx) {
        const bottomWidth = this.width * 0.3;
        const dischargeX = this.x + (this.width - bottomWidth) / 2;
        const dischargeY = this.y + this.height;
        const dischargeWidth = bottomWidth;
        const gateHeight = 8;

        // Discharge outlet frame
        ctx.fillStyle = "#707070";
        ctx.strokeStyle = "#404040";
        ctx.lineWidth = 2;
        ctx.fillRect(dischargeX - 3, dischargeY, dischargeWidth + 6, gateHeight);
        ctx.strokeRect(dischargeX - 3, dischargeY, dischargeWidth + 6, gateHeight);

        // Discharge gate/valve
        ctx.fillStyle = this.dischargeOpen ? "#4CAF50" : "#F44336";
        const gateY = dischargeY + (this.dischargeOpen ? gateHeight : 2);
        ctx.fillRect(dischargeX, gateY, dischargeWidth, 4);
        ctx.strokeRect(dischargeX, gateY, dischargeWidth, 4);

        // Gate actuator
        ctx.fillStyle = "#606060";
        const actuatorX = dischargeX + dischargeWidth + 8;
        const actuatorY = dischargeY - 5;
        ctx.fillRect(actuatorX, actuatorY, 12, 18);
        ctx.strokeRect(actuatorX, actuatorY, 12, 18);

        // Actuator handle
        ctx.strokeStyle = "#808080";
        ctx.lineWidth = 3;
        ctx.beginPath();
        const handleAngle = this.dischargeOpen ? -Math.PI/4 : Math.PI/4;
        const handleCenterX = actuatorX + 6;
        const handleCenterY = actuatorY + 9;
        ctx.moveTo(handleCenterX, handleCenterY);
        ctx.lineTo(
            handleCenterX + Math.cos(handleAngle) * 8,
            handleCenterY + Math.sin(handleAngle) * 8
        );
        ctx.stroke();

        // Vibrator (for material flow assistance)
        ctx.fillStyle = "#4a5d23"; // Motor green
        const vibratorX = this.x - 15;
        const vibratorY = this.y + this.height * 0.8;
        ctx.fillRect(vibratorX, vibratorY, 12, 20);
        ctx.strokeRect(vibratorX, vibratorY, 12, 20);

        // Vibrator attachment
        ctx.strokeStyle = "#606060";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(vibratorX + 12, vibratorY + 10);
        ctx.lineTo(this.x, vibratorY + 10);
        ctx.stroke();
    }

    drawControlElements(ctx) {
        // Level sensor
        ctx.fillStyle = "#909090";
        ctx.strokeStyle = "#505050";
        ctx.lineWidth = 1;

        const sensorX = this.x + this.width - 12;
        const sensorY = this.y + 15;
        ctx.fillRect(sensorX, sensorY, 10, 25);
        ctx.strokeRect(sensorX, sensorY, 10, 25);

        // Level indicator lights
        const levels = [0.25, 0.5, 0.75];
        levels.forEach((level, i) => {
            const lightY = sensorY + 5 + (i * 5);
            const isActive = this.materialLevel >= level;
            ctx.fillStyle = isActive ? "#00ff00" : "#333333";
            ctx.beginPath();
            ctx.arc(sensorX + 5, lightY, 2, 0, Math.PI * 2);
            ctx.fill();
        });

        // Control box
        const controlX = this.x + this.width + 25;
        const controlY = this.y + 20;
        const controlWidth = 30;
        const controlHeight = 40;

        ctx.fillStyle = "#a0a0a0";
        ctx.strokeStyle = "#505050";
        ctx.lineWidth = 2;
        ctx.fillRect(controlX, controlY, controlWidth, controlHeight);
        ctx.strokeRect(controlX, controlY, controlWidth, controlHeight);

        // Control buttons
        ctx.fillStyle = "#4CAF50"; // Start button
        ctx.beginPath();
        ctx.arc(controlX + 10, controlY + 12, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#F44336"; // Stop button
        ctx.beginPath();
        ctx.arc(controlX + 20, controlY + 12, 4, 0, Math.PI * 2);
        ctx.fill();

        // Discharge control switch
        ctx.fillStyle = this.dischargeOpen ? "#4CAF50" : "#808080";
        ctx.fillRect(controlX + 8, controlY + 25, 14, 8);
        ctx.strokeRect(controlX + 8, controlY + 25, 14, 8);

        // Switch position indicator
        ctx.fillStyle = "#ffffff";
        const switchX = controlX + (this.dischargeOpen ? 16 : 10);
        ctx.fillRect(switchX, controlY + 26, 4, 6);
    }

    drawLoadingChute(ctx) {
        // Loading chute on top
        const chuteWidth = this.width * 0.6;
        const chuteHeight = 15;
        const chuteX = this.x + (this.width - chuteWidth) / 2;
        const chuteY = this.y - chuteHeight;

        ctx.fillStyle = "#808080";
        ctx.strokeStyle = "#404040";
        ctx.lineWidth = 2;

        // Main chute body
        ctx.fillRect(chuteX, chuteY, chuteWidth, chuteHeight + 3);
        ctx.strokeRect(chuteX, chuteY, chuteWidth, chuteHeight + 3);

        // Chute flange
        ctx.fillRect(chuteX - 5, chuteY + chuteHeight, chuteWidth + 10, 3);
        ctx.strokeRect(chuteX - 5, chuteY + chuteHeight, chuteWidth + 10, 3);

        // Chute cover/lid
        ctx.fillStyle = "#909090";
        ctx.fillRect(chuteX + 2, chuteY - 3, chuteWidth - 4, 3);
        ctx.strokeRect(chuteX + 2, chuteY - 3, chuteWidth - 4, 3);

        // Loading port connection
        ctx.strokeStyle = "#606060";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(chuteX + chuteWidth / 2, chuteY - 10);
        ctx.lineTo(chuteX + chuteWidth / 2, chuteY);
        ctx.stroke();
    }

    // Animation method
    animate() {
        this.vibrationOffset += 0.1;
    }

    // Method to set material level
    setMaterialLevel(level) {
        this.materialLevel = Math.max(0, Math.min(1, level));
    }

    // Method to control discharge gate
    setDischargeOpen(open) {
        this.dischargeOpen = open;
    }

    // Method to get discharge position for pellet generation
    getDischargePoint() {
        const bottomWidth = this.width * 0.3;
        return {
            x: this.x + this.width / 2,
            y: this.y + this.height + 8,
            width: bottomWidth
        };
    }
}
