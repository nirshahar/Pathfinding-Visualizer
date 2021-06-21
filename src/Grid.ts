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
        for (let i = 0; i < height; i++) {
            this.cells.push([]);
            for (let j = 0; j < width; j++) {
                this.cells[i].push(new Cell(cellSize))
            }
        }
    }

    draw () {
        this.cells.forEach(row => {
            row.forEach(cell => {
                cell.draw();
            });
        });
    }
}