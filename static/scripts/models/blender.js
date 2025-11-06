export class Blender {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.rotation = 0; // For rotating animation
        this.materialLevel = 0.6; // Material fill level (0-1)
    }

    draw(ctx) {
        ctx.save();

        // Draw support frame first (behind the vessel)
        this.drawSupportFrame(ctx);

        // Draw the main vessel
        this.drawVesselBody(ctx);

        // Draw material inside
        this.drawMaterial(ctx);

        // Draw vessel outline and details
        this.drawVesselDetails(ctx);

        // Drive mechanism
        // this.drawDriveMechanism(ctx);

        // Control panel
        // this.drawControlPanel(ctx);

        // Loading/discharge ports
        this.drawPorts(ctx);

        ctx.restore();
    }

    drawSupportFrame(ctx) {
        ctx.strokeStyle = "#404040";
        ctx.fillStyle = "#505050";
        ctx.lineWidth = 3;

        // Main support columns
        const frameWidth = this.width + 40;
        const frameHeight = this.height + 60;
        const frameX = this.x - 20;
        const frameY = this.y - 10;

        // Left support column
        ctx.fillRect(frameX - 15, frameY, 15, frameHeight);
        ctx.strokeRect(frameX - 15, frameY, 15, frameHeight);

        // Right support column
        ctx.fillRect(frameX + frameWidth, frameY, 15, frameHeight);
        ctx.strokeRect(frameX + frameWidth, frameY, 15, frameHeight);

        // Cross bracing
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(frameX - 10, frameY + frameHeight * 0.3);
        ctx.lineTo(frameX + frameWidth + 5, frameY + frameHeight * 0.3);
        ctx.moveTo(frameX - 10, frameY + frameHeight * 0.7);
        ctx.lineTo(frameX + frameWidth + 5, frameY + frameHeight * 0.7);
        ctx.stroke();

        // Base platform
        ctx.fillStyle = "#606060";
        ctx.fillRect(frameX - 20, frameY + frameHeight - 10, frameWidth + 40, 15);
        ctx.strokeRect(frameX - 20, frameY + frameHeight - 10, frameWidth + 40, 15);
    }

    drawVesselBody(ctx) {
        // Create metallic gradient
        const gradient = ctx.createLinearGradient(this.x, this.y, this.x + this.width, this.y + this.height);
        gradient.addColorStop(0, "#e8e8e8");
        gradient.addColorStop(0.3, "#d0d0d0");
        gradient.addColorStop(0.7, "#c0c0c0");
        gradient.addColorStop(1, "#b8b8b8");

        ctx.fillStyle = gradient;

        // Center cylinder
        const centerHeight = this.height * 0.5;
        const centerY = this.y + this.height * 0.25;
        ctx.fillRect(this.x, centerY, this.width, centerHeight);

        // Top cone
        ctx.beginPath();
        ctx.moveTo(this.x, centerY);
        ctx.lineTo(this.x + this.width / 2, this.y);
        ctx.lineTo(this.x + this.width, centerY);
        ctx.closePath();
        ctx.fill();

        // Bottom cone
        ctx.beginPath();
        ctx.moveTo(this.x, centerY + centerHeight);
        ctx.lineTo(this.x + this.width / 2, this.y + this.height);
        ctx.lineTo(this.x + this.width, centerY + centerHeight);
        ctx.closePath();
        ctx.fill();
    }

    drawMaterial(ctx) {
        if (this.materialLevel <= 0) return;

        // Material color (pharmaceutical powder)
        ctx.fillStyle = "rgba(255, 220, 180, 0.8)";

        const centerHeight = this.height * 0.5;
        const centerY = this.y + this.height * 0.25;
        const materialHeight = centerHeight * this.materialLevel;

        // Material in center section
        if (this.materialLevel > 0) {
            const materialY = centerY + centerHeight - materialHeight;
            ctx.fillRect(this.x + 5, materialY, this.width - 10, materialHeight);
        }

        // Material in cones (if level is high enough)
        if (this.materialLevel > 0.7) {
            const coneLevel = (this.materialLevel - 0.7) / 0.3;

            // Top cone material
            const topConeHeight = (this.height * 0.25) * coneLevel;
            ctx.beginPath();
            ctx.moveTo(this.x + 10, centerY);
            ctx.lineTo(this.x + this.width / 2, centerY - topConeHeight);
            ctx.lineTo(this.x + this.width - 10, centerY);
            ctx.closePath();
            ctx.fill();

            // Bottom cone material
            ctx.beginPath();
            ctx.moveTo(this.x + 10, centerY + centerHeight);
            ctx.lineTo(this.x + this.width / 2, centerY + centerHeight + topConeHeight);
            ctx.lineTo(this.x + this.width - 10, centerY + centerHeight);
            ctx.closePath();
            ctx.fill();
        }

        // Add some particle effect
        ctx.fillStyle = "rgba(255, 200, 150, 0.6)";
        for (let i = 0; i < 8; i++) {
            const particleX = this.x + 20 + Math.random() * (this.width - 40);
            const particleY = centerY + 10 + Math.random() * (materialHeight - 20);
            ctx.beginPath();
            ctx.arc(particleX, particleY, 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    drawVesselDetails(ctx) {
        ctx.strokeStyle = "#404040";
        ctx.lineWidth = 3;

        const centerHeight = this.height * 0.5;
        const centerY = this.y + this.height * 0.25;

        // Main vessel outline
        ctx.strokeRect(this.x, centerY, this.width, centerHeight);

        // Top cone outline
        ctx.beginPath();
        ctx.moveTo(this.x, centerY);
        ctx.lineTo(this.x + this.width / 2, this.y);
        ctx.lineTo(this.x + this.width, centerY);
        ctx.stroke();

        // Bottom cone outline
        ctx.beginPath();
        ctx.moveTo(this.x, centerY + centerHeight);
        ctx.lineTo(this.x + this.width / 2, this.y + this.height);
        ctx.lineTo(this.x + this.width, centerY + centerHeight);
        ctx.stroke();

        // Vessel bands/reinforcements
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#505050";

        // Horizontal reinforcement bands
        for (let i = 1; i < 3; i++) {
            const bandY = centerY + (centerHeight * i / 3);
            ctx.beginPath();
            ctx.moveTo(this.x, bandY);
            ctx.lineTo(this.x + this.width, bandY);
            ctx.stroke();
        }

        // Bolts/flanges
        ctx.fillStyle = "#707070";
        for (let i = 0; i < 6; i++) {
            const boltX = this.x + (this.width * (i + 1) / 7);
            // Top flange bolts
            ctx.beginPath();
            ctx.arc(boltX, centerY - 5, 3, 0, Math.PI * 2);
            ctx.fill();
            // Bottom flange bolts
            ctx.beginPath();
            ctx.arc(boltX, centerY + centerHeight + 5, 3, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    drawDriveMechanism(ctx) {
        const driveX = this.x - 40;
        const driveY = this.y + this.height * 0.4;

        // Motor housing
        ctx.fillStyle = "#556b2f";
        ctx.strokeStyle = "#404040";
        ctx.lineWidth = 2;
        ctx.fillRect(driveX - 25, driveY, 25, 30);
        ctx.strokeRect(driveX - 25, driveY, 25, 30);

        // Drive shaft
        ctx.strokeStyle = "#808080";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(driveX, driveY + 15);
        ctx.lineTo(this.x - 5, driveY + 15);
        ctx.stroke();

        // Coupling
        ctx.fillStyle = "#606060";
        ctx.fillRect(driveX - 5, driveY + 10, 10, 10);
        ctx.strokeRect(driveX - 5, driveY + 10, 10, 10);

        // Rotating indicator (shows rotation)
        ctx.save();
        ctx.translate(driveX - 12, driveY + 15);
        ctx.rotate(this.rotation);
        ctx.strokeStyle = "#ff0000";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(8, 0);
        ctx.stroke();
        ctx.restore();
    }

    drawControlPanel(ctx) {
        const panelX = this.x + this.width + 30;
        const panelY = this.y + 20;
        const panelWidth = 40;
        const panelHeight = 80;

        // Control panel box
        ctx.fillStyle = "#a0a0a0";
        ctx.strokeStyle = "#505050";
        ctx.lineWidth = 2;
        ctx.fillRect(panelX, panelY, panelWidth, panelHeight);
        ctx.strokeRect(panelX, panelY, panelWidth, panelHeight);

        // Control buttons
        const buttonColors = ["#00ff00", "#ffff00", "#ff0000"];
        for (let i = 0; i < 3; i++) {
            ctx.fillStyle = buttonColors[i];
            ctx.beginPath();
            ctx.arc(panelX + 20, panelY + 20 + i * 15, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = "#333333";
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        // Speed control dial
        ctx.strokeStyle = "#404040";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(panelX + 20, panelY + panelHeight - 15, 10, 0, Math.PI * 2);
        ctx.stroke();

        // Dial pointer
        ctx.beginPath();
        ctx.moveTo(panelX + 20, panelY + panelHeight - 15);
        const dialAngle = this.rotation * 0.1;
        ctx.lineTo(
            panelX + 20 + Math.cos(dialAngle) * 8,
            panelY + panelHeight - 15 + Math.sin(dialAngle) * 8
        );
        ctx.stroke();
    }

    drawPorts(ctx) {
        const centerY = this.y + this.height * 0.25;
        const centerHeight = this.height * 0.5;

        // Loading port (top)
        ctx.fillStyle = "#808080";
        ctx.strokeStyle = "#404040";
        ctx.lineWidth = 2;

        const portWidth = 15;
        const portHeight = 10;
        const topPortX = this.x + this.width / 2 - portWidth / 2;
        const topPortY = this.y - portHeight;

        ctx.fillRect(topPortX, topPortY, portWidth, portHeight + 5);
        ctx.strokeRect(topPortX, topPortY, portWidth, portHeight + 5);

        // Port flange
        ctx.fillRect(topPortX - 5, topPortY + portHeight, portWidth + 10, 3);
        ctx.strokeRect(topPortX - 5, topPortY + portHeight, portWidth + 10, 3);

        // Discharge valve (bottom)
        const bottomPortX = this.x + this.width / 2 - portWidth / 2;
        const bottomPortY = this.y + this.height;

        ctx.fillRect(bottomPortX, bottomPortY, portWidth, portHeight);
        ctx.strokeRect(bottomPortX, bottomPortY, portWidth, portHeight);

        // Valve handle
        ctx.fillStyle = "#606060";
        ctx.fillRect(bottomPortX + portWidth, bottomPortY + 3, 8, 4);
        ctx.strokeRect(bottomPortX + portWidth, bottomPortY + 3, 8, 4);

        // Manhole/inspection port (side)
        const manholeRadius = 12;
        const manholeX = this.x + this.width + 5;
        const manholeY = centerY + centerHeight / 2;

        ctx.fillStyle = "#909090";
        ctx.beginPath();
        ctx.arc(manholeX, manholeY, manholeRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Manhole bolts
        ctx.fillStyle = "#606060";
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const boltX = manholeX + Math.cos(angle) * (manholeRadius - 3);
            const boltY = manholeY + Math.sin(angle) * (manholeRadius - 3);
            ctx.beginPath();
            ctx.arc(boltX, boltY, 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Animation method
    animate() {
        this.rotation += 0.03;
    }

    // Method to set material level
    setMaterialLevel(level) {
        this.materialLevel = Math.max(0, Math.min(1, level));
    }
}
