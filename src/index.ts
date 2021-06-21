import p5 from "p5";
import { Grid } from "./Grid";

// Creating the sketch itself
const sketch = (p: p5) => {

	let grid: Grid = new Grid(10, 10, 10);
	// DEMO: Prepare an array of MyCircle instances
	// The sketch setup method 
	p.setup = () => {
		// Creating and positioning the canvas
		const canvas = p.createCanvas(200, 200);
		canvas.parent(document.body);

		// Configuring the canvas
		p.background("white");
	};

	// The sketch draw method
	p.draw = () => {
		grid.draw();
		// DEMO: Let the circle instances draw themselve
	};
};

new p5(sketch);
