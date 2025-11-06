import { Conveyor } from "./models/conveyor.js";
import { Blender } from "./models/blender.js";
import { Pump } from "./models/pump.js";
import { Pipeline } from "./models/pipeline.js";
import { Kiln } from "./models/kiln.js";
import { BallMill } from "./models/ballmill.js";
import { ControlPoint } from "./models/ControlPoint.js";
import { MaterialPellet } from "./models/MaterialPellet.js";
import { Hopper } from "./models/hopper.js";

function lerpColor(color1, color2, factor) {
    factor = Math.max(0, Math.min(1, factor));
    const parseHex = (hex) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return { r, g, b };
    };
    const c1 = parseHex(color1);
    const c2 = parseHex(color2);
    const r = Math.round(c1.r + factor * (c2.r - c1.r));
    const g = Math.round(c1.g + factor * (c2.g - c1.g));
    const b = Math.round(c1.b + factor * (c2.b - c1.b));
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

// IoT Components
class IoTNode {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.pulseOffset = 0;
        this.isHovered = false;
    }

    draw(ctx) {
        ctx.save();

        // Pulsing effect
        const pulse = Math.sin(this.pulseOffset) * 0.3 + 0.7;

        // Node body
        ctx.fillStyle = `rgba(0, 150, 255, ${pulse})`;
        ctx.strokeStyle = "#0066cc";
        ctx.lineWidth = 2;

        // Main node circle
        ctx.beginPath();
        ctx.arc(this.x, this.y, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Inner core
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(this.x, this.y, 6, 0, Math.PI * 2);
        ctx.fill();

        // Signal rings
        for (let i = 1; i <= 2; i++) {
            ctx.strokeStyle = `rgba(0, 150, 255, ${0.3 * pulse})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(this.x, this.y, 12 + i * 8, 0, Math.PI * 2);
            ctx.stroke();
        }

        // Antenna
        ctx.strokeStyle = "#666666";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y - 12);
        ctx.lineTo(this.x, this.y - 20);
        ctx.stroke();

        // Antenna tip
        ctx.fillStyle = "#ff4444";
        ctx.beginPath();
        ctx.arc(this.x, this.y - 20, 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    animate() {
        this.pulseOffset += 0.1;
    }

    containsPoint(mouseX, mouseY) {
        const distance = Math.sqrt(Math.pow(mouseX - this.x, 2) + Math.pow(mouseY - this.y, 2));
        return distance <= 20;
    }
}

class IoTHub {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.dataFlowOffset = 0;
        this.isHovered = false;
    }

    draw(ctx) {
        ctx.save();

        // Main hub body
        const gradient = ctx.createLinearGradient(this.x - 30, this.y - 20, this.x + 30, this.y + 20);
        gradient.addColorStop(0, "#2c3e50");
        gradient.addColorStop(0.5, "#34495e");
        gradient.addColorStop(1, "#2c3e50");

        ctx.fillStyle = gradient;
        ctx.strokeStyle = "#1a252f";
        ctx.lineWidth = 3;

        // Hub chassis
        ctx.fillRect(this.x - 30, this.y - 20, 60, 40);
        ctx.strokeRect(this.x - 30, this.y - 20, 60, 40);

        // Screen/display
        ctx.fillStyle = "#000000";
        ctx.fillRect(this.x - 25, this.y - 15, 35, 25);
        ctx.strokeStyle = "#333333";
        ctx.lineWidth = 1;
        ctx.strokeRect(this.x - 25, this.y - 15, 35, 25);

        // Display content (data visualization)
        ctx.strokeStyle = "#00ff00";
        ctx.lineWidth = 1;
        for (let i = 0; i < 5; i++) {
            const waveY = this.y - 5 + Math.sin(this.dataFlowOffset + i * 0.5) * 3;
            ctx.beginPath();
            ctx.moveTo(this.x - 20, waveY);
            ctx.lineTo(this.x - 10, waveY);
            ctx.stroke();
        }

        // Status indicators
        const indicators = [
            { color: "#00ff00", x: this.x + 15, y: this.y - 10 },
            { color: "#ffff00", x: this.x + 20, y: this.y - 10 },
            { color: "#0088ff", x: this.x + 25, y: this.y - 10 }
        ];

        indicators.forEach(indicator => {
            ctx.fillStyle = indicator.color;
            ctx.beginPath();
            ctx.arc(indicator.x, indicator.y, 2, 0, Math.PI * 2);
            ctx.fill();
        });

        // Connectivity ports
        ctx.fillStyle = "#555555";
        for (let i = 0; i < 3; i++) {
            ctx.fillRect(this.x - 32, this.y - 8 + i * 8, 4, 4);
        }

        // Label
        ctx.fillStyle = "#ecf0f1";
        ctx.font = "10px Arial";
        ctx.textAlign = "center";
        ctx.fillText("IoT HUB", this.x, this.y + 15);

        // Cloud connection indicator
        ctx.strokeStyle = "#3498db";
        ctx.lineWidth = 2;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(this.x, this.y - 20);
        ctx.lineTo(this.x, this.y - 35);
        ctx.stroke();
        ctx.setLineDash([]);

        // Cloud symbol
        ctx.fillStyle = "#3498db";
        ctx.beginPath();
        ctx.arc(this.x - 5, this.y - 40, 4, 0, Math.PI * 2);
        ctx.arc(this.x, this.y - 42, 5, 0, Math.PI * 2);
        ctx.arc(this.x + 5, this.y - 40, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    animate() {
        this.dataFlowOffset += 0.2;
    }

    containsPoint(mouseX, mouseY) {
        return mouseX >= this.x - 30 && mouseX <= this.x + 30 &&
               mouseY >= this.y - 20 && mouseY <= this.y + 20;
    }
}

class Tooltip {
    constructor() {
        this.visible = false;
        this.x = 0;
        this.y = 0;
        this.title = "";
        this.description = "";
    }

    show(x, y, title, description) {
        this.visible = true;
        this.x = x;
        this.y = y;
        this.title = title;
        this.description = description;
    }

    hide() {
        this.visible = false;
    }

    draw(ctx) {
        if (!this.visible) return;

        ctx.save();

        // Measure text for tooltip sizing
        ctx.font = "bold 14px Arial";
        const titleWidth = ctx.measureText(this.title).width;
        ctx.font = "12px Arial";
        const descWidth = ctx.measureText(this.description).width;

        const tooltipWidth = Math.max(titleWidth, descWidth) + 20;
        const tooltipHeight = 50;

        // Position tooltip to avoid canvas edges
        let tooltipX = this.x + 15;
        let tooltipY = this.y - tooltipHeight - 10;

        if (tooltipX + tooltipWidth > ctx.canvas.width - 10) {
            tooltipX = this.x - tooltipWidth - 15;
        }
        if (tooltipY < 10) {
            tooltipY = this.y + 25;
        }

        // Tooltip background
        ctx.fillStyle = "rgba(44, 62, 80, 0.95)";
        ctx.strokeStyle = "#34495e";
        ctx.lineWidth = 1;
        ctx.fillRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight);
        ctx.strokeRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight);

        // Title
        ctx.fillStyle = "#ecf0f1";
        ctx.font = "bold 14px Arial";
        ctx.textAlign = "left";
        ctx.fillText(this.title, tooltipX + 10, tooltipY + 20);

        // Description
        ctx.fillStyle = "#bdc3c7";
        ctx.font = "12px Arial";
        ctx.fillText(this.description, tooltipX + 10, tooltipY + 37);

        ctx.restore();
    }
}

window.onload = function () {
    const canvas = document.getElementById("step1Canvas");
    const ctx = canvas.getContext("2d");

    // Reference to the process phase display
    const processPhaseElem = document.getElementById("process-phase");

    // Helper function to update process phase text
    function setProcessPhase(phase) {
        if (processPhaseElem) {
            processPhaseElem.textContent = phase;
        }
    }

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const sectionWidth = canvasWidth / 6;

    let processState = {
        conveyorActive: false,
        waterFlowing: false,
        waterFlowing2: false,
        blendingComplete: false,
        kilnProcessing: false,
        millingComplete: false,
        initialMass: 0
    };

    let blendingStartTime = null;
    let ballStartTime = null;
    let numEnteredBlender = 0;
    let numEnteredBallMill = 0;

    let waterFlowAnimation = { progress: 0, active: false };
    let waterFlowAnimation2 = { progress: 0, active: false };
    let petCokeFlowAnimation = { progress: 0, active: false };
    let pellets = [];
    let massInputPopup = null;
    let initialMassKg = 0;

    const deviceParameters = {
        conveyor: {
            speed: { label: "Conveyor Speed", value: 0, min: 0, max: 10, step: 0.1, unit: "m/s", targetValue: 6 }
        },
        blender: {
            rotationSpeed: { label: "Rotation Speed", value: 0, min: 0, max: 200, step: 1, unit: "RPM", targetValue: 150 },
            mixingTime: { label: "Mixing Time", value: 0, min: 0, max: 20, step: 1, unit: "seconds", targetValue: 12 }
        },
        hopper: {
            mass: { label: "Petroleum Coke Mass", value: 0, min: 0, max: 6000, step: 1000, unit: "kg", getTargetValue: () => initialMassKg}
        },
        pump: {
            flowRate: { label: "Water Flow Rate", value: 0, min: 0, max: 2000, step: 50, unit: "L/hour", getTargetValue: () => initialMassKg * 2 }
        },
        pump2: {
            flowRate: { label: "Water Flow Rate", value: 0, min: 0, max: 2000, step: 50, unit: "L/hour", getTargetValue: () => initialMassKg * 2 }
        },
        kiln: {
            temperature: { label: "Kiln Temperature", value: 0, min: 0, max: 1500, step: 10, unit: "°C", targetValue: 1100 },
            pressure: { label: "Pressure", value: 0, min: 0, max: 2, step: 0.1, unit: "atm", targetValue: 1 }
        },
        ballmill: {
            millingSpeed: { label: "Milling Speed", value: 0, min: 0, max: 100, step: 5, unit: "% critical speed", targetValue: 75 },
            particleSize: { label: "Target Particle Size", value: 0, min: 0, max: 500, step: 10, unit: "μm", targetValue: 150 }
        }
    };

    const conveyor = new Conveyor(sectionWidth * 0.5, 305, 200);
    const blender = new Blender(sectionWidth * 2, 250, 100, 100);
    const hopper = new Hopper(sectionWidth * 2, 30, 100, 100);
    const pump = new Pump(sectionWidth * 2.11, canvasHeight - 100, 50, 50);
    const pump2 = new Pump(sectionWidth * 5 + 35, 75, 50, 50);
    const kiln = new Kiln(sectionWidth * 3.3, 275, 200, 60);
    const ballmill = new BallMill(sectionWidth * 5, 275, 120, 60);

    // IoT Components
    const iotNode = new IoTNode(kiln.x + kiln.width / 2, canvasHeight - 60);
    const iotHub = new IoTHub(canvasWidth - 100, canvasHeight - 60);
    const tooltip = new Tooltip();

    const conveyorToBlender = new Pipeline(conveyor.x + conveyor.length, conveyor.y, blender.x - (conveyor.x + conveyor.length) + 20, "horizontal");
    const pumpToBlenderVertical = new Pipeline(pump.x + pump.width / 2, pump.y, + (pump.y - (blender.y + blender.height)), "vertical");
    const blenderToKiln = new Pipeline(blender.x + blender.width, blender.y + blender.height / 2 + 5, (kiln.x + 10) - (blender.x + blender.width), "horizontal");
    const hopperToBlenderVertical = new Pipeline(hopper.x + hopper.width / 2, 245, blender.y - (hopper.y + hopper.height), "vertical");
    const kilnToBallmill = new Pipeline(kiln.x + kiln.width - 10, kiln.y + kiln.height / 2, ballmill.x - (kiln.x + kiln.width) + 5, "horizontal");
    const pumpToBallmillVertical = new Pipeline(pump2.x + pump2.width / 2, 270, (ballmill.y - ballmill.height / 2) - (pump2.y + pump2.height) + 30, "vertical");
    const ballmillToExit = new Pipeline(ballmill.x + ballmill.width, ballmill.y + ballmill.height / 2, canvasWidth - (ballmill.x + ballmill.width) + 50, "horizontal");

    function validateConveyor() {
        return Math.abs(deviceParameters.conveyor.speed.value - 6) < 0.1;
    }

    function validatePump() {
        if (initialMassKg === 0) return false;
        const targetFlow = initialMassKg * 2;
        return Math.abs(deviceParameters.pump.flowRate.value - targetFlow) < 1;
    }

    function validatePump2() {
        if (initialMassKg === 0) return false;
        const targetFlow = initialMassKg * 2;
        return Math.abs(deviceParameters.pump2.flowRate.value - targetFlow) < 1;
    }

    function validateBlender() {
        return Math.abs(deviceParameters.blender.rotationSpeed.value - 150) < 1 &&
               Math.abs(deviceParameters.blender.mixingTime.value - 12) < 1;
    }

    function validateHopper() {
        if (initialMassKg === 0) return false;
        const targetMass = initialMassKg;
        return Math.abs(deviceParameters.hopper.mass.value - targetMass) < 1;
    }

    function validateKiln() {
        return Math.abs(deviceParameters.kiln.temperature.value - 1100) < 5 &&
               Math.abs(deviceParameters.kiln.pressure.value - 1) < 0.1;
    }

   function validateBallmill() {
        return (
            deviceParameters.ballmill.millingSpeed.value >= 75 &&
            deviceParameters.ballmill.millingSpeed.value <= 80 &&
            Math.abs(deviceParameters.ballmill.particleSize.value - 150) < 1
        );
    }
    function createMassInputPopup() {
        if (massInputPopup) return;
        massInputPopup = document.createElement('div');
        massInputPopup.className = 'mass-input-popup';
        massInputPopup.style.cssText = `
            position: fixed;
            left: 50%;
            top: 20%;
            transform: translateX(-50%);
            background: white;
            border: 2px solid #3366cc;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 9999;
            width: 250px;
            font-family: Arial, sans-serif;
        `;

        const title = document.createElement('h3');
        title.textContent = 'Initial BaSO₄ Input';
        massInputPopup.appendChild(title);

        const label = document.createElement('label');
        label.textContent = 'Please enter mass of BaSO₄ (multiple of 1000 kg):';
        massInputPopup.appendChild(label);

        const input = document.createElement('input');
        input.type = 'number';
        input.min = '1000';
        input.max = '10000';
        input.step = '1000';
        input.value = '1000';
        massInputPopup.appendChild(input);

        const button = document.createElement('button');
        button.textContent = 'Start Process';
        button.addEventListener('click', () => {
            const mass = parseInt(input.value);
            if (mass % 1000 === 0 && mass > 0 && mass <= 6000) {
                initialMassKg = mass;
                processState.initialMass = mass / 1000;
                document.body.removeChild(massInputPopup);
                massInputPopup = null;
                numEnteredBlender = 0;
                numEnteredBallMill = 0;
                blendingStartTime = null;
                ballStartTime = null;
                const numPellets = processState.initialMass;
                const spacing = Math.max(20, conveyor.length / numPellets);
                for (let i = 0; i < numPellets; i++) {
                    const startX = conveyor.x + (i * spacing) + 10;
                    const pellet = new MaterialPellet('BaSO4', startX, conveyor.y);
                    pellet.id = i;
                    if (pellet.speed !== undefined) {
                        pellet.originalSpeed = pellet.speed;
                        pellet.speed /= 3;
                    }
                    if (pellet.alpha === undefined) pellet.alpha = 1;
                    if (pellet.drawOffsetX === undefined) pellet.drawOffsetX = 0;
                    pellets.push(pellet);
                    setProcessPhase("Material Input");
                }
            } else {
                alert('Please enter a multiple of 1000 kg between 1000 and 6000 kg.');
            }
        });
        massInputPopup.appendChild(button);
        document.body.appendChild(massInputPopup);
    }

    function drawMassIndicator() {
        if (initialMassKg === 0) {
            ctx.save();
            ctx.fillStyle = '#3366cc';
            ctx.font = 'bold 14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Click to input BaSO₄ mass', conveyor.x + conveyor.length / 2, conveyor.y - 20);
            ctx.restore();
        } else {
            ctx.save();
            ctx.fillStyle = '#2c2c2c';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`${initialMassKg} kg BaSO₄`, conveyor.x + conveyor.length / 2, conveyor.y - 10);
            ctx.restore();
        }
    }

    function drawIoTConnections() {
        ctx.save();
        ctx.strokeStyle = "#0066cc";
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 6]);

        // Data flow animation offset
        const flowOffset = Date.now() * 0.01;
        ctx.lineDashOffset = flowOffset % 14;

        // Vertical connection from kiln to IoT node
        ctx.beginPath();
        ctx.moveTo(kiln.x + kiln.width / 2, kiln.y + kiln.height + 5);
        ctx.lineTo(iotNode.x, iotNode.y - 20);
        ctx.stroke();

        // Horizontal connection from IoT node to IoT hub
        ctx.beginPath();
        ctx.moveTo(iotNode.x + 20, iotNode.y);
        ctx.lineTo(iotHub.x - 30, iotHub.y);
        ctx.stroke();

        // Data packet animation
        const packetProgress = (Date.now() * 0.002) % 1;
        const totalDistance = (iotHub.x - 30) - (iotNode.x + 20);
        const packetX = iotNode.x + 20 + (totalDistance * packetProgress);

        ctx.setLineDash([]);
        ctx.fillStyle = "#00ff88";
        ctx.beginPath();
        ctx.arc(packetX, iotNode.y, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    class ValidatingControlPoint extends ControlPoint {
    constructor(x, y, deviceName, parameters, validator) {
        super(x, y, deviceName, parameters);
        this.validator = validator;
        this.isValid = false;
    }

        showControlPanel(event) {
            super.showControlPanel();

            if (this.popup) {
                const status = document.createElement('div');
                status.id = `${this.deviceName.toLowerCase().replace(/\s+/g, '-')}-status`;
                this.updateValidationStatus(status);
                this.popup.insertBefore(status, this.popup.lastChild);

                // Position popup relative to mouse cursor
                if (event) {
                    const clickX = event.clientX;
                    const clickY = event.clientY;

                    // Temporarily make visible to measure size
                    this.popup.style.position = "absolute";
                    this.popup.style.visibility = "hidden";
                    this.popup.style.display = "block";

                    const popupRect = this.popup.getBoundingClientRect();

                    let left = clickX + 15;
                    let top = clickY + 15;

                    if (left + popupRect.width > window.innerWidth) {
                        left = clickX - popupRect.width - 15;
                    }
                    if (top + popupRect.height > window.innerHeight) {
                        top = clickY - popupRect.height - 15;
                    }

                    this.popup.style.left = `${left}px`;
                    this.popup.style.top = `${top}px`;
                    this.popup.style.visibility = "visible";
                }
            }
        }

        updateValidationStatus(element) {
            this.isValid = this.validator();

            // Remove any existing class first
            element.classList.remove('ok', 'error');

            if (this.isValid) {
                element.textContent = '✓ Parameters OK.';
                element.classList.add('ok');
            } else {
                element.textContent = '✗ Check parameters!';
                element.classList.add('error');
            }
        }
    }

    // Define the positions of the control point icons
    let controlPoints = [
        new ValidatingControlPoint(conveyor.x + 100, 200, "Conveyor", deviceParameters.conveyor, validateConveyor),
        new ValidatingControlPoint(blender.x + 150, 270, "Double Cone Blender", deviceParameters.blender, validateBlender),
        new ValidatingControlPoint(hopper.x + 150, 95, "Hopper", deviceParameters.hopper, validateHopper),
        new ValidatingControlPoint(pump.x + pump.width / 2, 580, "Water Pump", deviceParameters.pump, validatePump),
        new ValidatingControlPoint(kiln.x + 100, 200, "Rotary Kiln", deviceParameters.kiln, validateKiln),
        new ValidatingControlPoint(ballmill.x + 110, 400, "Ball Mill", deviceParameters.ballmill, validateBallmill),
        new ValidatingControlPoint(pump2.x + pump2.width / 2 + 50, 100, "Water Pump", deviceParameters.pump2, validatePump2)
    ];

    // Creates the water flow animation from the water pumps
    function animateWaterFlow() {
        if (waterFlowAnimation.active) {
            waterFlowAnimation.progress += 0.0033;
            if (waterFlowAnimation.progress >= 1) {
                waterFlowAnimation.active = false;
                waterFlowAnimation.progress = 0;
                processState.waterFlowing = true;
            }
        }
    }

    // For the second water pump
    function animateWaterFlow2() {
        if (waterFlowAnimation2.active) {
            waterFlowAnimation2.progress += 0.0033;
            if (waterFlowAnimation2.progress >= 1) {
                waterFlowAnimation2.active = false;
                waterFlowAnimation2.progress = 0;
                processState.waterFlowing2 = true;
            }
        }
    }

    // Animation for petroleum coke pellets flowing from the hopper to the blender
    function animatePetCokeFlow() {
        if (petCokeFlowAnimation.active) {
            petCokeFlowAnimation.progress += 0.0033;
            if (petCokeFlowAnimation.progress >= 1) {
                petCokeFlowAnimation.active = false;
                petCokeFlowAnimation.progress = 0;
            }
        }
    }

    function drawPetCokeFlow() {
        if (petCokeFlowAnimation.active) {
            const numPellets = 8;
            const startY = hopper.y + hopper.height;
            const endY = blender.y;
            const distance = endY - startY;
            const baseX = hopper.x + hopper.width / 2;

            for (let i = 0; i < numPellets; i++) {
                const offsetProgress = (petCokeFlowAnimation.progress + i * 0.15) % 1;
                const y = startY + distance * offsetProgress;
                const pipelineWidth = 10;
                const x = baseX;
                const alpha = Math.max(0, 1 - offsetProgress * 0.8);

                ctx.save();
                ctx.globalAlpha = alpha;
                ctx.fillStyle = '#2c2c2c';
                ctx.beginPath();
                ctx.arc(x, y, 4, 0, Math.PI * 2);
                ctx.fill();

                if (i % 2 === 0) {
                    ctx.fillStyle = '#1a1a1a';
                    ctx.beginPath();
                    ctx.arc(x + 2, y - 1, 3, 0, Math.PI * 2);
                    ctx.fill();
                }

                ctx.restore();
            }
        }
    }

    // Introduced so that pellets did not overlap during motion
    function handleCollisions() {
        if (pellets.length < 2) return;
        pellets.sort((a, b) => a.x - b.x);
        for (let i = pellets.length - 2; i >= 0; i--) {
            const rear = pellets[i];
            const front = pellets[i + 1];
            const minDist = (rear.radius || 10) + (front.radius || 10) + 5;
            const dist = front.x - rear.x;
            if (dist < minDist) {
                rear.x = front.x - minDist;
            }
        }
    }

    // All functions listed below path the movement of pellets
    function setBlenderTarget(pellet) {
        const total = processState.initialMass;
        const entryIndex = numEnteredBlender - 1;
        const left = blender.x + 20;
        const right = blender.x + blender.width - 20;
        const spaceAvail = right - left;
        let targetX;
        if (total === 1) {
            targetX = left + spaceAvail / 2;
        } else {
            const spacing = spaceAvail / (total - 1);
            targetX = right - entryIndex * spacing;
        }
        pellet.setTarget(targetX, pellet.y);
    }

    function setBallmillTarget(pellet) {
        const total = processState.initialMass;
        const entryIndex = numEnteredBallMill - 1;
        const left = ballmill.x + 20;
        const right = ballmill.x + ballmill.width - 20;
        const spaceAvail = right - left;
        let targetX;
        if (total === 1) {
            targetX = left + spaceAvail / 2;
        } else {
            const spacing = spaceAvail / (total - 1);
            targetX = right - entryIndex * spacing;
        }
        pellet.setTarget(targetX, pellet.y);
    }

    function animatePellets() {
        for (let i = pellets.length - 1; i >= 0; i--) {
            const pellet = pellets[i];
            if (pellet.processed) {
                pellets.splice(i, 1);
                continue;
            }

            pellet.drawOffsetX = 0;
            pellet.update();

            if (!pellet.inBlender && !pellet.toKiln && !pellet.inKiln && !pellet.toBall && !pellet.inBallMill) {
                if (pellet.targetX === null || pellet.targetX === undefined) {
                    if (validateConveyor()) {
                        pellet.setTarget(conveyor.x + conveyor.length, pellet.y);
                    }
                }
                const conveyorEndX = conveyor.x + conveyor.length;
                if (Math.abs(pellet.x - conveyorEndX) < 10 && (pellet.targetX === conveyorEndX || pellet.targetX === null)) {
                    if (validatePump() && validateBlender() && validateHopper()) {
                        pellet.setTarget(blender.x, pellet.y);
                        if (!waterFlowAnimation.active && !processState.waterFlowing) {
                            waterFlowAnimation.active = true;
                        }
                        if (!petCokeFlowAnimation.active) {
                            petCokeFlowAnimation.active = true;
                        }
                    } else {
                        pellet.setTarget(conveyorEndX, pellet.y);
                    }
                }
                const blenderEntranceX = blender.x;
                if (Math.abs(pellet.x - blenderEntranceX) < 10 && pellet.targetX === blenderEntranceX) {
                    pellet.inBlender = true;
                    numEnteredBlender++;

                    // Update process phase when first pellet enters the blender
                    if (numEnteredBlender === 1) {
                        setProcessPhase("Slurry Processing");
                    }

                    setBlenderTarget(pellet);
                    if (numEnteredBlender === processState.initialMass && blendingStartTime === null) {
                        blendingStartTime = Date.now();
                    }
                }
            }

            if (pellet.inBlender) {
                if (pellet.targetX !== null && Math.abs(pellet.x - pellet.targetX) > 5) {
                } else {
                    if (blendingStartTime !== null) {
                        const elapsed = Date.now() - blendingStartTime;
                        if (elapsed < 12000) {
                            const shake = Math.sin(elapsed / 100 + pellet.id * 0.5) * 3;
                            pellet.drawOffsetX = shake;
                            const progress = elapsed / 12000;
                            pellet.color = lerpColor('#ffffff', '#d3d3d3', progress);
                            pellet.alpha = 0.9 + 0.1 * (1 - progress);
                        } else {
                            pellet.inBlender = false;
                            pellet.toKiln = true;
                            pellet.transform('Slurry');
                            pellet.setTarget(kiln.x, pellet.y);
                            if (pellet.speed !== undefined) {
                                pellet.speed = pellet.originalSpeed / 3;
                            }
                        }
                    }
                }
            }

            if (pellet.toKiln) {
                const kilnEntranceX = kiln.x;
                if (Math.abs(pellet.x - kilnEntranceX) < 10) {
                    if (validateKiln()) {
                        pellet.toKiln = false;
                        pellet.inKiln = true;
                        pellet.setTarget(kiln.x + kiln.width, pellet.y);

                        // Update process phase when first pellet enters the kiln
                        if (!processState.kilnProcessing) {
                            setProcessPhase("Reduction");
                            processState.kilnProcessing = true;
                        }

                        if (pellet.speed !== undefined) {
                            pellet.speed = pellet.originalSpeed / 2;
                        }
                        pellet.kilnStartX = pellet.x;
                    } else {
                        pellet.setTarget(kilnEntranceX, pellet.y);
                    }
                } else {
                    pellet.setTarget(kilnEntranceX, pellet.y);
                }
            }

            if (pellet.inKiln) {
                const totalDist = (kiln.x + kiln.width) - pellet.kilnStartX;
                const traveled = pellet.x - pellet.kilnStartX;
                const progress = Math.min(1, traveled / totalDist);
                pellet.color = lerpColor('#d3d3d3', '#000000', progress);
                if (Math.abs(pellet.x - (kiln.x + kiln.width)) < 10) {
                    pellet.inKiln = false;
                    pellet.toBall = true;
                    pellet.transform('BaS');
                    pellet.setTarget(ballmill.x, pellet.y);
                    if (pellet.speed !== undefined) {
                        pellet.speed = pellet.originalSpeed / 3;
                    }
                }
            }

            if (pellet.toBall) {
                const ballEntranceX = ballmill.x;
                if (Math.abs(pellet.x - ballEntranceX) < 10) {
                    if (validateBallmill() && validatePump2()) {
                        pellet.toBall = false;
                        pellet.inBallMill = true;
                        numEnteredBallMill++;
                        setBallmillTarget(pellet);

                        // Update process phase when first pellet enters the ball mill
                        if (numEnteredBallMill === 1) {
                            setProcessPhase("Crushing");
                        }

                        if (numEnteredBallMill === processState.initialMass && ballStartTime === null) {
                            ballStartTime = Date.now();
                        }
                        if (!waterFlowAnimation2.active && !processState.waterFlowing2) {
                            waterFlowAnimation2.active = true;
                        }
                    } else {
                        pellet.setTarget(ballEntranceX, pellet.y);
                    }
                } else {
                    pellet.setTarget(ballEntranceX, pellet.y);
                }
            }

            if (pellet.inBallMill) {
                if (pellet.targetX !== null && Math.abs(pellet.x - pellet.targetX) > 5) {
                } else {
                    if (ballStartTime !== null) {
                        const elapsed = Date.now() - ballStartTime;
                        if (elapsed < 5000) {
                            const shake = Math.sin(elapsed / 100 + pellet.id * 0.5) * 3;
                            pellet.drawOffsetX = shake;
                            const progress = elapsed / 5000;
                            pellet.color = lerpColor('#000000', '#a9a9a9', progress);
                            pellet.alpha = 0.9 + 0.1 * (1 - progress);
                        } else {
                            pellet.inBallMill = false;
                            setProcessPhase("Complete");
                            pellet.transform('CrushedBaS');
                            pellet.setTarget(canvasWidth + 50, pellet.y);
                            if (pellet.speed !== undefined) {
                                pellet.speed = pellet.originalSpeed / 3;
                            }
                            processState.millingComplete = true;
                        }
                    }
                }
            }

            if (pellet.x > canvasWidth) {
                pellet.processed = true;
            }
        }
        handleCollisions();
    }

    function drawWaterFlow() {
        if (waterFlowAnimation.active) {
            ctx.save();
            ctx.strokeStyle = "rgba(0, 191, 255, 1)";
            ctx.lineWidth = 3;
            ctx.setLineDash([5, 5]);
            ctx.lineDashOffset = -waterFlowAnimation.progress * 50;
            ctx.beginPath();
            ctx.moveTo(pump.x + pump.width / 2, pump.y);
            ctx.lineTo(pump.x + pump.width / 2, blender.y + blender.height);
            ctx.stroke();
            ctx.restore();
        }
    }

    function drawWaterFlow2() {
        if (waterFlowAnimation2.active) {
            ctx.save();
            ctx.strokeStyle = "rgba(0, 191, 255, 1)";
            ctx.lineWidth = 3;
            ctx.setLineDash([5, 5]);
            ctx.lineDashOffset = -waterFlowAnimation2.progress * 50;
            ctx.beginPath();
            ctx.moveTo(pump2.x + pump2.width / 2, pump2.y + pump2.height);
            ctx.lineTo(pump2.x + pump2.width / 2, ballmill.y - ballmill.height / 2);
            ctx.stroke();
            ctx.restore();
        }
    }

    function drawBlenderTimer() {
        if (blendingStartTime !== null) {
            const elapsed = Date.now() - blendingStartTime;
            if (elapsed < 12000) {
                const remaining = Math.ceil((12000 - elapsed) / 1000);
                ctx.save();
                ctx.fillStyle = '#3366cc';
                ctx.font = 'bold 16px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(`${remaining}s`, blender.x + blender.width / 2 - 20, blender.y - 20);
                ctx.restore();
            }
        }
    }

    function drawBallmillTimer() {
        if (ballStartTime !== null) {
            const elapsed = Date.now() - ballStartTime;
            if (elapsed < 5000) {
                const remaining = Math.ceil((5000 - elapsed) / 1000);
                ctx.save();
                ctx.fillStyle = '#3366cc';
                ctx.font = 'bold 16px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(`${remaining}s`, ballmill.x + ballmill.width / 2, ballmill.y + ballmill.height + 35);
                ctx.restore();
            }
        }
    }

    function drawScene() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawMassIndicator();
        conveyorToBlender.draw(ctx);
        pumpToBlenderVertical.draw(ctx);
        hopperToBlenderVertical.draw(ctx);
        blenderToKiln.draw(ctx);
        kilnToBallmill.draw(ctx);
        pumpToBallmillVertical.draw(ctx);
        ballmillToExit.draw(ctx);

        // Draw IoT connections
        drawIoTConnections();

        drawWaterFlow();
        drawWaterFlow2();
        drawPetCokeFlow();
        conveyor.draw(ctx);
        blender.draw(ctx);
        hopper.draw(ctx);
        kiln.draw(ctx);
        ballmill.draw(ctx);
        pump.draw(ctx);
        pump2.draw(ctx);

        // Draw IoT components
        iotNode.draw(ctx);
        iotHub.draw(ctx);

        drawBlenderTimer();
        drawBallmillTimer();

        pellets.forEach(pellet => {
            ctx.save();
            if (pellet.drawOffsetX !== undefined && pellet.drawOffsetX !== 0) {
                ctx.translate(pellet.drawOffsetX, 0);
            }
            if (pellet.alpha !== undefined && pellet.alpha < 1) {
                ctx.globalAlpha = pellet.alpha;
            }
            pellet.draw(ctx);
            ctx.restore();
        });

        controlPoints.forEach(point => {
            point.isValid = point.validator();
        });
        controlPoints.forEach(point => {
            point.draw(ctx);
            ctx.save();
            ctx.fillStyle = point.isValid ? "#4CAF50" : "#F44336";
            ctx.beginPath();
            ctx.arc(point.x + 12, point.y - 12, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });

        // Draw tooltip last (on top)
        tooltip.draw(ctx);

        if (processState.conveyorActive) {
            conveyor.animate();
        }
        blender.animate();
        kiln.animate();
        ballmill.animate();
        iotNode.animate();
        iotHub.animate();
        animateWaterFlow();
        animateWaterFlow2();
        animatePetCokeFlow();
        animatePellets();

        if (validateConveyor() && !processState.conveyorActive && initialMassKg > 0) processState.conveyorActive = true;

        requestAnimationFrame(drawScene);
    }

    function setupInteractions() {
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            // Check IoT components for hover
            let showTooltip = false;

            if (iotNode.containsPoint(mouseX, mouseY)) {
                tooltip.show(mouseX, mouseY, "IoT Sensor Node", "Collects temperature & pressure data");
                showTooltip = true;
                iotNode.isHovered = true;
            } else {
                iotNode.isHovered = false;
            }

            if (iotHub.containsPoint(mouseX, mouseY)) {
                tooltip.show(mouseX, mouseY, "IoT Data Hub", "Processes & transmits sensor data to cloud");
                showTooltip = true;
                iotHub.isHovered = true;
            } else {
                iotHub.isHovered = false;
            }

            if (!showTooltip) {
                for (const pellet of pellets) {
                    const dx = mouseX - pellet.x;
                    const dy = mouseY - pellet.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist <= pellet.radius + 5) {
                        let description;
                        switch (pellet.type) {
                            case 'BaSO4':
                                description = "Unprocessed BaSO₄ pellets";
                                break;
                            case 'Slurry':
                                description = "50% BaSO₄ + Pet Coke slurry";
                                break;
                            case 'BaS':
                                description = "BaS pellets";
                                break;
                            case 'CrushedBaS':
                                description = "BaS solution (aq)";
                                break;
                            default:
                                description = "Unknown material";
                        }
                        tooltip.show(mouseX, mouseY, "Material State", description);
                        showTooltip = true;
                        break; // Stop checking after first pellet found under cursor
                    }
                }
            }

            if (!showTooltip) {
                tooltip.hide();
            }

            controlPoints.forEach(point => {
                point.isHovered = point.containsPoint(mouseX, mouseY);
                if (point.popup) point.updateValidationStatus(document.getElementById(`${point.deviceName.toLowerCase().replace(/\s+/g, '-')}-status`));
            });

            const isOverInteractive = controlPoints.some(point => point.containsPoint(mouseX, mouseY)) ||
                                    iotNode.containsPoint(mouseX, mouseY) ||
                                    iotHub.containsPoint(mouseX, mouseY);
            canvas.style.cursor = isOverInteractive ? 'pointer' : 'default';
        });

        canvas.addEventListener('click', (e) => {
            e.stopPropagation();
            const rect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            if (initialMassKg === 0 && mouseX > conveyor.x - 20 && mouseX < conveyor.x + conveyor.length + 20 && mouseY > conveyor.y - 30 && mouseY < conveyor.y) {
                createMassInputPopup();
                return;
            }
            controlPoints.forEach(point => {
                if (point.containsPoint(mouseX, mouseY)) point.showControlPanel(e);
            });
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.control-panel-popup') && !e.target.closest('.mass-input-popup')) {
                controlPoints.forEach(point => point.hideControlPanel());
                if (massInputPopup) { document.body.removeChild(massInputPopup); massInputPopup = null; }
            }
        });
    }

    setupInteractions();
    drawScene();
};
