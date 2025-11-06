# BARSS Process Simulation



## Description

The **BARSS Process** is an acronym for 'Barium Ash Reduction and Sodium Sulphide' process. This simulation allows users to interact with the foremost stage of this process, configure equipment, and observe real-time material movement through different equipment, including a double-cone blender, rotary kiln, and ball mill.



### Features

- Interactive visualization of raw material entering the process and moving through each stage.

- Real-time updates of equipment status and process phase.

- Visual animations to simulate chemical transformations, such as blending, reduction, and crushing.

- Safety and operational checks modeled in the simulation (e.g., equipment validation before processing).

- Modular, maintainable JavaScript code for easy extension and modification.



### Background

This project was inspired by my internship at a chemical plant, to provide both educational and industrial insights into chemical process simulation. It demonstrates the conversion of BaSO₄ to BaS in a controlled, interactive environment, combining chemical engineering principles with front-end web development techniques.



Compared to alternatives, this project emphasizes **interactive visual feedback** and **process phase tracking**, providing users with a clear understanding of each stage of the transformation.






---



## Visuals

The simulation features a main canvas showing:

- Pellets moving along conveyors and through pipelines.

- Color transitions and variable changes (displayed using tooltips), representing each processing stage.

- 'Shake' animations and intuitive visuals showcasing the processing of pellets in various machinery.

- Control points placed adjacent to each piece of equipment, describing the type of machinery, and interactive control panels when clicked (with adjustable values).

- Footer containing dynamic status bars showing **Equipment Status**, **Process Phase**, and **IoT Connectivity**.



### Video Demo

Video URL: https://youtu.be/nBUjvFfDcXU




---



## Installation

Follow these steps to get the BARSS Process Simulation running on your local machine. This project uses Flask, so it requires a running Flask server to properly serve the HTML pages and static assets.



### Steps

1.  **Clone the repository**

```bash

git clone https://github.com/your-username/barss-process-simulation.git

cd barss-process-simulation

````



2. **Set up a Python virtual environment** (recommended)



```bash

python -m venv venv

source venv/bin/activate # On Windows: venv\Scripts\activate

```



3. **Install required dependencies**

If your project contains a `requirements.txt` file, run:



```bash

pip install -r requirements.txt

```



If not, at minimum install Flask:



```bash

pip install Flask

```



4. **Run the Flask application**



```bash

export FLASK_APP=app.py # On Windows: set FLASK_APP=app.py

export FLASK_ENV=development # Optional: enables debug mode

flask run

```



This will start the Flask server, typically accessible at:



```

http://127.0.0.1:5000/

```



5. **Open the simulation in a browser**

Navigate to the step1 page using the correct route:



```

http://127.0.0.1:5000/step1

```



The page will now properly load the HTML, CSS, and JS files via Flask's static folder.



6. **Interact with the simulation!**

Once the page loads, you can:


- View the homepage, detailing the importance of the process, and objective of the project.

- Navigate to the main interface, where the interactive simulation takes place.

* Control equipment by clicking on the interface markers.

* Monitor live system indicators such as Equipment Status, Process Phase, and IoT Connectivity.

* Observe the animated transformation of materials through each process phase:

	1. **Material Input (Mass Input)**

	2. **Slurry Processing (Blender)**

	3. **Reduction (Rotary Kiln)**

	4. **Crushing (Ball Mill)**

* Follow visual cues like pellet color transitions and movement to understand the progress of the chemical process in real time.

- View immersive animations, such as water flow through pumps, and petroleum coke pellets through the hopper.



---



## Usage



Once the Flask server is running and you have navigated to the simulation page (`http://127.0.0.1:5000/step1`), you can interact with the BARSS Process Simulation as follows:



### Key Interactions



1. **Configure Equipment Parameters**

	- Click on the interactive equipment markers on the canvas (conveyor, blender, kiln, ball mill).

	- Adjust parameters such as input mass, velocity, pressure, temperature, and flow rates according to the instructions provided in the linked documentation.

	- These changes immediately affect how the simulation behaves, providing real-time feedback on process control decisions.



2. **Observe Pellet Animation Through Process Phases**

	The pellets visually demonstrate the movement and transformation of materials through the industrial process:

	1. **Material Input (Mass Input)** – Raw pellets are loaded onto the conveyor.

	2. **Slurry Processing (Blender)** – Pellets enter the blender, where they mix and undergo initial chemical transformation. Watch for color changes and shaking motion representing blending activity.

	3. **Reduction (Rotary Kiln)** – Pellets enter the kiln for reduction. Observe the gradual color shift from gray to black, simulating chemical conversion.

	4. **Crushing (Ball Mill)** – The final phase where the reduced material is crushed into its final form. The pellet color lightens slightly to indicate finished product.



3. **Monitor System Indicators**

	- **Equipment Status:** Tracks whether each piece of equipment is in standby or operational.

	- **Process Phase:** Updates dynamically to reflect the current stage of material processing.

	- **IoT Connectivity:** Confirms active connection between the simulation interface and the backend logic.



4. **Understand Process Logic**

	- The simulation demonstrates how each step of the chemical process depends on the proper operation of equipment upstream.

	- Visual feedback, including pellet movement, color transitions, and animation effects, helps illustrate real-world industrial behavior and process dependencies.

	- Errors or missing configuration inputs are immediately reflected in the pellet behavior, offering an intuitive way to explore industrial automation concepts.



### Example Scenario



1. Load the initial material into the system.

2. Ensure pumps, blenders, and kilns are properly activated.

3. Observe the progression of pellets through the phases while adjusting parameters to optimize throughput.

4. Watch the **Process Phase** indicator update as the simulation moves from **Material Input** → **Slurry Processing** → **Reduction** → **Crushing**.

5. Once all pellets exit the ball mill, the simulation signals completion, showing the fully processed material.



By combining interactive controls with visual and numerical feedback, this simulation provides a hands-on experience in understanding industrial chemical process flow, equipment behavior, and process control logic.



---



## Technical Breakdown

This section details the internal structure and logic of the simulation for developers or curious users.



### File Overview

- **templates/index.html** - The cover-page of the project, built with a theme and design in mind. Contains an overview of the project and explains the importance of the BARSS process.

- **templates/step1.html** – The main HTML page hosting the canvas, UI components, and status indicators.

- **templates/instructions.html** - This page details the necessary set points that must be set by the user within each control panel, in order to make the process flow smoothly.

- **styles.css** – Defines the layout, color schemes, and visual styles for headers, footers, and the simulation canvas.

- **scripts/step1.js** – The core JavaScript module controlling pellet animation, state management, and interaction logic.

- **scripts/models/** - Contains the core building blocks of the simulation, defining how each piece of equipment (blender, rotary kiln, ball mill, etc.) behaves and interacts.



### Key Modules and Logic

1. **Pellet Objects**

- Each pellet represents a unit of material moving through the process.

- Properties track its state: `inBlender`, `toKiln`, `inKiln`, `toBall`, `inBallMill`, and `processed`.

- Methods include `update()`, `setTarget()`, and `transform()` to change state and appearance.



2. **Process State**

- Central object `processState` tracks the overall simulation status:

- `waterFlowing`, `waterFlowing2` – Tracks water animations in the blender and ball mill.

- `initialMass` – Number of pellets initially injected.

- `millingComplete` – Marks when the ball mill phase completes.



3. **Animation Loops**

- `animatePellets()` handles:

- Movement of pellets between equipment.

- Blending, reduction, and crushing animations.

- Color transitions to visualize chemical changes.

- State transitions, including updating the **Process Phase** in the UI.



4. **Validation Functions**

- `validateConveyor()`, `validateBlender()`, `validateKiln()`, `validateBallmill()` ensure equipment conditions are met before a pellet can proceed.

- Simulates realistic operational checks.



5. **UI Updates**

- Real-time indicators in the footer:

- `#equipment-status` – Shows if machinery is operational.

- `#process-phase` – Reflects the current phase of the material. Updates dynamically as pellets transition.



6. **Animations**

- Blender and ball mill shaking using sinusoidal offsets (`drawOffsetX`).

- Gradual color interpolation to indicate chemical changes:

- `lerpColor()` interpolates between two colors for visual effect.



This modular structure ensures maintainability and allows future extension, such as adding new equipment, animations, or adjustable process parameters.



---



## Support

For questions or assistance:

- Open an issue in the project repository for bugs or feature requests.



---



## Roadmap

Possible future improvements include:

- Adding more detailed chemical reaction animations.

- Adding further steps to show how this key precursor is used in the production of other essential barium products (BaCl2, BaCO3, et cetera.)

- Simulating variable input quality and its effect on process outcomes.

- Integrating a more detailed control panel with adjustable process parameters.

- Implementing multi-user collaboration for training scenarios.



---



## Contributing

Contributions are welcome. To get started:

1. Fork the repository.

2. Create a branch for your feature or bug fix.

3. Make changes and test locally.

4. Submit a pull request with a detailed description of your changes.



Ensure all animations and state transitions remain consistent and well-documented to maintain simulation clarity.



---



## Authors and Acknowledgment

- Process flow inspired by an internship at a chemical plant.

- Thanks to the technical team for guidance on chemical process modeling and feedback on simulation design.



---



## License

This project is licensed under the MIT License.



---



## Project Status

Development is complete for the initial simulation. Future expansions and improvements are planned, but the core functionality is stable and fully operational.
