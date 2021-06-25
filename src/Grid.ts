import { Cell } from "./Cell";
import { GraphNode, NamedGraph } from "./Graph";


export class Grid extends NamedGraph<[number, number]> {
    width: number;
    height: number;
    cellSize: number;

    constructor(width: number, height: number, cellSize: number) {
        super(true);

        this.width = width;
        this.height = height;
        this.cellSize = cellSize;

        for (let i = 0; i < width; i++) {
            for (let j = 0; j < height; j++) {
                let cell: Cell = new Cell(i * cellSize, j * cellSize, cellSize);
                this.addNode(i * cellSize, j * cellSize, [i, j], cell);
            }
        }

        for (let i = 0; i < width - 1; i++) {
            for (let j = 0; j < height; j++) {
                this.addEdge([i, j], [i + 1, j], undefined, false);
            }
        }

        for (let i = 0; i < width; i++) {
            for (let j = 0; j < height - 1; j++) {
                this.addEdge([i, j], [i, j + 1], undefined, false);
            }
        }
    }
}