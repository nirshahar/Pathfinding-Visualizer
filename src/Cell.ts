import p5 from "p5";

export class Cell {
    cellSize: number;
    row: number;
    col: number;

    weight: number;

    constructor(cellSize: number, row: number, col: number, weight: number = 1) {
        this.cellSize = cellSize;
        this.row = row;
        this.col = col;
        this.weight = weight;
    }

    draw(p: p5): void {
        p.rect(this.row * this.cellSize, this.col * this.cellSize, this.cellSize, this.cellSize);
    }
}