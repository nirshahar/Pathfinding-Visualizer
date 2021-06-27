import p5 from "p5";
import $ from "jquery";
import { Cell, Grid } from "./Grid";
import { Astar, manhatten, euclidean } from "./PathFinder";

const sketch = (p: p5) => {
	const WIDTH = $(window).width()!;
	const HEIGHT = $(window).height()!;
	const CELL_SIZE = 25;

	let grid: Grid = new Grid(Math.floor(WIDTH / CELL_SIZE), Math.floor(HEIGHT / CELL_SIZE), CELL_SIZE);
	let pfinder: Astar<[number, number], Cell>;

	let computeAstar = false;

	p.setup = () => {
		const canvas = p.createCanvas(WIDTH, HEIGHT);
		canvas.parent(document.body);

		p.rectMode(p.CENTER);
		p.ellipseMode(p.CENTER);
		p.frameRate(60);

		pfinder = new Astar<[number, number], Cell>(grid.getNode([10, Math.floor(grid.height / 2)]), grid.getNode([grid.width - 1, Math.floor(grid.height / 2)]), euclidean);

	};

	p.draw = () => {
		if (p.keyIsPressed && p.keyCode == p.RIGHT_ARROW) {
			computeAstar = true;
		}
		p.background("green");
		p.translate((WIDTH - grid.width * CELL_SIZE) / 2, (HEIGHT - grid.height * CELL_SIZE) / 2);

		if (computeAstar) {
			for (let i = 0; i < 10; i++) {
				computeAstar &&= !pfinder.doStep();
			}
		}
		grid.draw(p);
	};
};

new p5(sketch);
