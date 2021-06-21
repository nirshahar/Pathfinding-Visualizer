import p5 from "p5";
export class Cell {
    cellSize: number;
    row: number;
    col: number;

    constructor(cellSize: number, row: number, col: number) {
        this.cellSize = cellSize;
        this.row = row;
        this.col = col;
    }

    draw(p: p5) {
        p.rect(this.row * this.cellSize, this.col * this.cellSize, this.cellSize, this.cellSize);
    }
}