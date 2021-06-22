import p5 from "p5";

export type Graph = NamedGraph<number>;
/**
 * A graph, containing nodes and edges between them.
 * @param T a type specifying the object "name" type of the graph nodes. I.e, every graph node will have some "name" with this type `T`.
 */
export class NamedGraph<T> {
    nameToNode: Map<T, GraphNode> = new Map<T, GraphNode>();
    nodeToName: Map<GraphNode, T> = new Map<GraphNode, T>();

    /**
     * Creates a new empty graph
     */
    constructor() { }

    /**
     * Adds a new node to the graph, with the specified name and coordiantes
     * @param x x-coordinate of the new node
     * @param y y-coordinate of the new node
     * @param nodeName the name of the new node
     */
    addNode(x: number, y: number, nodeName: T): void {
        if (this.nameToNode.has(nodeName)) {
            throw "Node with name: " + nodeName + " already exists in graph.";
        }

        const newNode = new GraphNode(x, y);

        this.nameToNode.set(nodeName, newNode);
        this.nodeToName.set(newNode, nodeName);
    }

    /**
     * Tries to remove the node with the specified name from the graph.
     * @param nodeName The name of the node to remove
     * @returns boolean `true` if succeeds, `false` otherwise.
     */
    removeNode(nodeName: T): boolean {
        if (this.nameToNode.has(nodeName)) {
            let node: GraphNode = this.nameToNode.get(nodeName)!;

            node.edges.forEach(edge => {
                edge.disconnect();
            });

            let ret: boolean = this.nameToNode.delete(nodeName);
            ret &&= this.nodeToName.delete(node);

            return ret;
        }
        return false;
    }

    /**
     * Adds an edge between two nodes, with the specified weight. The weight defaults to 1.
     * @param firstNodeName the name of the first node
     * @param secondNodeName the name of the second node
     * @param weight the weight of the created edge
     * @throws when there aren't nodes with the specified names in the graph.
     */
    addEdge(firstNodeName: T, secondNodeName: T, weight: number = 1) {
        let firstNode: GraphNode;
        let secondNode: GraphNode;

        if (this.nameToNode.has(firstNodeName)) {
            firstNode = this.nameToNode.get(firstNodeName)!;
        } else {
            throw "Graph node with name " + firstNodeName + " does not exist in the graph.";
        }

        if (this.nameToNode.has(secondNodeName)) {
            secondNode = this.nameToNode.get(secondNodeName)!;
        } else {
            throw "Graph node with name " + secondNodeName + " does not exist in the graph.";
        }

        GraphEdge.connect(firstNode, secondNode, weight);
    }

    /**
     * Draws the entire graph
     * @param p canvas to draw on
     */
    draw(p: p5) {
        let node: GraphNode;

        for (node of this.nameToNode.values()) {
            node.draw(p);
        }
    }
}

/**
 * A node within a graph.
 */
export class GraphNode {
    static readonly NODE_SIZE: number = 10;

    x: number;
    y: number;

    edges: GraphEdge[];

    constructor(x: number, y: number, neighbors: GraphNode[] = []) {
        this.x = x;
        this.y = y;

        this.edges = [];
        neighbors.forEach(neighbor => {
            GraphEdge.connect(this, neighbor);
        });
    }

    /**
     * Resets the edges `wasDrawn` value.
     */
    resetEdgeDrawing(): void {
        this.edges.forEach(edge => {
            edge.wasDrawn = false;
        })
    }

    /**
     * Draws the node and all of its edges.
     */
    draw(p: p5): void {
        this.drawNode(p);
        this.edges.forEach(edge => {
            edge.draw(p);
        });
    }

    /**
     * Defines how the node should be rendered. It should draw only the node itself
     */
    drawNode(p: p5): void {
        p.circle(this.x, this.y, GraphNode.NODE_SIZE);
    }
}

/**
 * An edge connecting two nodes.
 */
export class GraphEdge {
    private otherEdge: GraphEdge = this;

    readonly sourceNode: GraphNode;
    readonly targetNode: GraphNode;

    private _weight: number;

    get weight(): number {
        return this._weight;
    }
    set weight(weight: number) {
        this._weight = weight;
        this.otherEdge._weight = weight;
    }

    private _wasDrawn: boolean = false;
    get wasDrawn(): boolean {
        return this._wasDrawn;
    }

    set wasDrawn(wasDrawn: boolean) {
        this._wasDrawn = wasDrawn;
        this.otherEdge._wasDrawn = wasDrawn;
    }

    /**
     * Private constructor. Creates an edge object, without assigning the `otherEdge` property.
     * @param sourceNode first node in the edge
     * @param targetNode second node in the edge
     * @param weight the weight ofthe edge. Defaults to 1.
     */
    private constructor(sourceNode: GraphNode, targetNode: GraphNode, weight: number = 1) {
        this.sourceNode = sourceNode;
        this.targetNode = targetNode;
        this._weight = weight;
    }

    /**
     * Disconnects the edge, removing if from both neighbors.
     */
    disconnect(): void {
        let index: number = this.sourceNode.edges.indexOf(this, 0);
        if (index > -1) {
            this.sourceNode.edges.splice(index, 1);
        }

        index = this.targetNode.edges.indexOf(this.otherEdge, 0);
        if (index > -1) {
            this.targetNode.edges.splice(index, 1);
        }
    }

    /**
     * Draws the edge.
     */
    draw(p: p5): void {
        if (!this.wasDrawn) {
            this.wasDrawn = true;

            p.line(this.sourceNode.x, this.sourceNode.y, this.targetNode.x, this.targetNode.y);
        }
    }

    /**
     * Creates an edge between firstNode and secondNode with the specified weight
     * @param firstNode The first node in the edge
     * @param secondNode The second node in the edge
     * @param weight The weight of the edge. Unless specified, weight = 1.
     */
    static connect(firstNode: GraphNode, secondNode: GraphNode, weight: number = 1): void {
        let firstEdge = new GraphEdge(firstNode, secondNode, weight);
        let secondEdge = new GraphEdge(secondNode, firstNode, weight);

        firstEdge.otherEdge = secondEdge;
        secondEdge.otherEdge = firstEdge;

        firstNode.edges.push(firstEdge);
        secondNode.edges.push(secondEdge);
    }
}