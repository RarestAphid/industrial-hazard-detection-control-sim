// static/scripts/ControlPoint.js

export class ControlPoint {
    constructor(x, y, deviceName, parameters) {
        this.x = x;
        this.y = y;
        this.radius = 8;
        this.deviceName = deviceName;
        this.parameters = parameters;
        this.isHovered = false;
        this.popup = null;
    }

    draw(ctx) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(this.x, this.y - this.radius);
        ctx.lineTo(this.x - this.radius, this.y + this.radius);
        ctx.lineTo(this.x + this.radius, this.y + this.radius);
        ctx.closePath();

        ctx.fillStyle = this.isHovered ? '#ffcc00' : '#ffdd00';
        ctx.fill();
        ctx.strokeStyle = '#cc6600';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = '#cc6600';
        ctx.font = `${this.radius * 1.2}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('!', this.x, this.y);

        ctx.restore();
    }

    containsPoint(x, y) {
        const distance = Math.sqrt((x - this.x) ** 2 + (y - this.y) ** 2);
        return distance <= this.radius;
    }

    /**
     * @param {MouseEvent} event - Mouse click event
     */
    showControlPanel(event) {
        if (this.popup) this.hideControlPanel();

        this.popup = document.createElement('div');
        this.popup.className = 'control-panel-popup';
        this.popup.style.position = 'absolute';
        this.popup.style.visibility = 'hidden';
        this.popup.style.display = 'block';
        this.popup.style.background = 'white';
        this.popup.style.border = '2px solid #3366cc';
        this.popup.style.borderRadius = '10px';
        this.popup.style.padding = '15px';
        this.popup.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
        this.popup.style.zIndex = 9999;
        this.popup.style.fontFamily = 'Arial, sans-serif';
        this.popup.style.minWidth = '220px';

        // Title
        const title = document.createElement('h3');
        title.className = 'control-panel-title';
        title.textContent = `${this.deviceName} Control`;
        this.popup.appendChild(title);

        // Parameters
        Object.entries(this.parameters).forEach(([paramName, paramConfig]) => {
            const container = document.createElement('div');
            container.className = 'parameter-container';

            const label = document.createElement('label');
            label.textContent = paramConfig.label;
            label.className = 'parameter-label';

            const input = document.createElement('input');
            input.type = 'number';
            input.value = paramConfig.value;
            input.min = paramConfig.min;
            input.max = paramConfig.max;
            input.step = paramConfig.step || 1;
            input.className = 'parameter-input';

            input.addEventListener('change', (e) => {
                paramConfig.value = parseFloat(e.target.value);
                console.log(`${this.deviceName} ${paramName} set to: ${paramConfig.value}`);
            });

            const unit = document.createElement('span');
            unit.className = 'parameter-unit';
            unit.textContent = ` ${paramConfig.unit}`;

            container.appendChild(label);
            container.appendChild(input);
            container.appendChild(unit);
            this.popup.appendChild(container);
        });

        // Close button
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Apply & Close';
        closeButton.className = 'control-panel-close';
        closeButton.addEventListener('click', () => this.hideControlPanel());
        this.popup.appendChild(closeButton);

        document.body.appendChild(this.popup);

        // === Position popup relative to mouse, prevent overflow ===
        if (event) {
            const clickX = event.pageX;
            const clickY = event.pageY;

            const popupRect = this.popup.getBoundingClientRect();

            let left = clickX + 15;
            let top = clickY + 15;

            // Check right/bottom overflow
            if (left + popupRect.width > window.scrollX + window.innerWidth) {
                left = clickX - popupRect.width - 15;
            }
            if (top + popupRect.height > window.scrollY + window.innerHeight) {
                top = clickY - popupRect.height - 15;
            }

            this.popup.style.left = `${left}px`;
            this.popup.style.top = `${top}px`;
            this.popup.style.visibility = 'visible';
        }
    }

    hideControlPanel() {
        if (this.popup) {
            document.body.removeChild(this.popup);
            this.popup = null;
        }
    }
}
