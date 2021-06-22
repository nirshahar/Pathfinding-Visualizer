import p5 from "p5";
import $ from "jquery";
import { Grid } from "./Grid";

const sketch = (p: p5) => {
	const WIDTH = $(window).width()!;
	const HEIGHT = $(window).height()!;
	const CELL_SIZE = 25;

	let grid: Grid = new Grid(Math.floor(WIDTH / CELL_SIZE), Math.floor(HEIGHT / CELL_SIZE), CELL_SIZE);

	p.setup = () => {
		const canvas = p.createCanvas(WIDTH, HEIGHT);
		canvas.parent(document.body);
	};

	p.draw = () => {
		p.background("green");
		p.translate((WIDTH - grid.width * CELL_SIZE) / 2, (HEIGHT - grid.height * CELL_SIZE) / 2);
		grid.update(p);
	};
};

new p5(sketch);
