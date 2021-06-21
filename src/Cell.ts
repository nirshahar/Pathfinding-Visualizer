
export class Cell {
    cellSize: number;


    constructor(cellSize: number) {
        this.cellSize = cellSize;
    }

    draw() {
        console.log("you just tried to draw me, didn't ya? woosh");
    }
}