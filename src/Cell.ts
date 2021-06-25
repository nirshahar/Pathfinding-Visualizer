import p5 from "p5";
import { GraphNode } from "./Graph";

export class Cell extends GraphNode {
    weight: number;

    isBlocked: boolean = false;

    constructor(x: number, y: number, cellSize: number, weight: number = 1) {
        super(x, y, cellSize);
        this.nodeSize = cellSize;
        this.weight = weight;
    }

    override draw(p: p5): void {
        const inXpos: boolean = this.x - this.nodeSize / 2 < p.mouseX && p.mouseX < this.x + this.nodeSize / 2;
        const inYpos: boolean = this.y - this.nodeSize / 2 < p.mouseY && p.mouseY < this.y + this.nodeSize / 2;

        if (this.isBlocked){
            p.fill(0);
        } else if (inXpos && inYpos) {
            if (p.mouseIsPressed){
                this.isBlocked = true;
            }
            p.fill(255, 0, 0);
        } else {
            p.fill(255);
        }

        p.rect(this.x, this.y, this.nodeSize, this.nodeSize);
    }

    
}