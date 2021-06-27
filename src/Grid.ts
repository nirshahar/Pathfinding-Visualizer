import p5 from "p5";
import { GraphNode, NamedGraph } from "./Graph";


export class Grid extends NamedGraph<[number, number], Cell> {
    width: number;
    height: number;
    cellSize: number;

    constructor(width: number, height: number, cellSize: number) {
        super(true); // TypeScript "tuples" are arrays, hence they are reference-based. Thus, we need to xxfdxuse string names instead.

        this.width = width;
        this.height = height;
        this.cellSize = cellSize;

        // Creates all cells in the grid
        for (let i = 0; i < width; i++) {
            for (let j = 0; j < height; j++) {
                let cell: Cell = new Cell([i, j], (i + 1 / 2) * cellSize, (j + 1 / 2) * cellSize, cellSize);
                this.addNode(cell);
            }
        }

        // Connects the cells together
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

export class Cell extends GraphNode<[number, number], Cell> {
    private _weight: number = 1;

    get weight(): number {
        return this._weight;
    }
    set weight(newWeight: number) {
        this._weight = newWeight;

        this.edges.forEach((edge) => {
            edge.weight = Math.max(edge.targetNode.weight, newWeight);
        })
    }

    isBlocked: boolean = false;

    constructor(cellName: [number, number], x: number, y: number, cellSize: number, weight: number = 1) {
        super(cellName, x, y, cellSize);

        this.weight = weight;
    }

    override draw(p: p5): void {
        const inXpos: boolean = this.x - this.nodeSize / 2 < p.mouseX && p.mouseX < this.x + this.nodeSize / 2;
        const inYpos: boolean = this.y - this.nodeSize / 2 < p.mouseY && p.mouseY < this.y + this.nodeSize / 2;

        if (this.isBlocked) {
            p.fill(0);
        } else if (inXpos && inYpos) {
            if (p.mouseIsPressed && p.mouseButton == p.LEFT) {
                this.weight = Number.POSITIVE_INFINITY;
                this.isBlocked = true;
            }
            p.fill(255, 0, 0);
        } else {
            if (this.wasExplored) {
                p.fill(255, 0, 255);
            } else {
                p.fill(255);
            }
        }

        p.rect(this.x, this.y, this.nodeSize, this.nodeSize);
    }


}