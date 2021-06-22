import p5 from "p5";
import { Cell } from "./Cell";

export class Grid {
    width: number;
    height: number;
    cellSize: number;
    cells: Array<Array<Cell>>;

    constructor(width: number, height: number, cellSize: number) {
        this.width = width;
        this.height = height;
        this.cellSize = cellSize;

        this.cells = [];
        for (let i = 0; i < width; i++) {
            this.cells.push([]);
            for (let j = 0; j < height; j++) {
                this.cells[i].push(new Cell(cellSize, i, j))
            }
        }
    }

    update(p: p5): void {
        this.draw(p);
    }

    draw(p: p5): void {
        this.cells.forEach(row => {
            row.forEach(cell => {
                cell.draw(p);
            });
        });
    }
}