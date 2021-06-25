import p5 from "p5";


/**
 * A graph, containing nodes and edges between them.
 * @param T a type specifying the object "name" type of the graph nodes. I.e, every graph node will have some "name" with this type `T`.
 */
export class NamedGraph<T> {
    
    nameToNode: Map<T | string, GraphNode> = new Map<T | string, GraphNode>();
    nodeToName: Map<GraphNode, T> = new Map<GraphNode, T>();

    private readonly useStringNames: boolean;
    /**
     * Creates a new empty graph
     * @param useStringNames if set to "true", the graph will use JSON.stringify() to transform the node's names into strings. Otherwise, they will be used as objects
     */
    constructor(useStringNames: boolean = false) {
        this.useStringNames = useStringNames;
    }

    /**
     * Transforms the `name` either into a string or keeps it as is, depending on the variable `useStringNames`
     * @param name the name to transform
     * @returns `JSON.stringify(name)` if `useStringNames` is true, and `name` otherwise
     */
    private transformName(name: T): T | string {
        if (this.useStringNames) { 
            return JSON.stringify(name);
        }
        return name;
    }

    /**
     * Adds a new node to the graph, with the specified name and coordiantes
     * @param x x-coordinate of the new node
     * @param y y-coordinate of the new node
     * @param nodeName the name of the new node
     */
    addNode(x: number, y: number, nodeName: T, node?: GraphNode): void {
        let transformedNodeName = this.transformName(nodeName);

        if (this.nameToNode.has(transformedNodeName)) {
            throw new Error("Node with name: " + nodeName + " already exists in graph.");
        }
        let newNode: GraphNode;
        if (node === undefined) {
            newNode = new GraphNode(x, y);
        } else {
            newNode = node;
        }
        this.nameToNode.set(transformedNodeName, newNode);
        this.nodeToName.set(newNode, nodeName);
    }

    /**
     * Tries to remove the node with the specified name from the graph.
     * @param nodeName The name of the node to remove
     * @returns boolean `true` if succeeds, `false` otherwise.
     */
    removeNode(nodeName: T): boolean {
        let transformedNodeName = this.transformName(nodeName);

        if (this.nameToNode.has(transformedNodeName)) {
            let node: GraphNode = this.nameToNode.get(transformedNodeName)!;

            node.edges.forEach(edge => {
                edge.disconnect();
            });

            let ret: boolean = this.nameToNode.delete(transformedNodeName);
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
     * @param drawEdge set to `false` if you don't want the edge to be drawn
     * @throws when there aren't nodes with the specified names in the graph.
     */
    addEdge(firstNodeName: T, secondNodeName: T, weight: number = 1, drawEdge: boolean = true) {
        let firstTransformedNodeName = this.transformName(firstNodeName);
        let secondTransformedNodeName = this.transformName(secondNodeName);

        let firstNode: GraphNode;
        let secondNode: GraphNode;

        if (this.nameToNode.has(firstTransformedNodeName)) {
            firstNode = this.nameToNode.get(firstTransformedNodeName)!;
        } else {
            throw new Error("Graph node with name " + firstTransformedNodeName + " does not exist in the graph.");
        }

        if (this.nameToNode.has(secondTransformedNodeName)) {
            secondNode = this.nameToNode.get(secondTransformedNodeName)!;
        } else {
            throw new Error("Graph node with name " + secondTransformedNodeName + " does not exist in the graph.");
        }

        GraphEdge.connect(firstNode, secondNode, weight, drawEdge);
    }

    /**
     * Draws the entire graph
     * @param p canvas to draw on
     */
    draw(p: p5) {
        let node: GraphNode;

        for (node of this.nodeToName.keys()) {
            node.resetEdgeDrawing();
        }

        for (node of this.nodeToName.keys()) {
            node.draw(p);
        }

        for (node of this.nodeToName.keys()) {
            node.drawEdges(p);
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
    nodeSize: number;

    edges: GraphEdge[];

    constructor(x: number, y: number, nodeSize: number = GraphNode.NODE_SIZE, neighbors: GraphNode[] = []) {
        this.x = x;
        this.y = y;
        this.nodeSize = nodeSize;

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
     * Draws the node's edges.
     */
    drawEdges(p: p5): void {
        this.edges.forEach(edge => {
            edge.draw(p);
        });
    }

    /**
     * Defines how the node should be rendered.
     */
    draw(p: p5): void {
        p.circle(this.x, this.y, this.nodeSize);
    }
}

/**
 * An edge connecting two nodes.
 */
export class GraphEdge {
    private otherEdge: GraphEdge = this;

    readonly sourceNode: GraphNode;
    readonly targetNode: GraphNode;
    private readonly drawEdge: boolean;

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
     * @param drawEdge set to `false` if you don't want the edge to be drawn
     */
    private constructor(sourceNode: GraphNode, targetNode: GraphNode, weight: number = 1, drawEdge: boolean = true) {
        this.sourceNode = sourceNode;
        this.targetNode = targetNode;
        this._weight = weight;
        this.drawEdge = drawEdge;
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
        if (this.drawEdge && !this.wasDrawn) {
            this.wasDrawn = true;

            p.line(this.sourceNode.x, this.sourceNode.y, this.targetNode.x, this.targetNode.y);
        }
    }

    /**
     * Creates an edge between firstNode and secondNode with the specified weight
     * @param firstNode The first node in the edge
     * @param secondNode The second node in the edge
     * @param weight The weight of the edge. Unless specified, weight = 1.
     * @param drawEdge set to `false` if you don't want the edge to be drawn
     */
    static connect(firstNode: GraphNode, secondNode: GraphNode, weight: number = 1, drawEdge: boolean = true): void {
        let firstEdge = new GraphEdge(firstNode, secondNode, weight, drawEdge);
        let secondEdge = new GraphEdge(secondNode, firstNode, weight, drawEdge);

        firstEdge.otherEdge = secondEdge;
        secondEdge.otherEdge = firstEdge;

        firstNode.edges.push(firstEdge);
        secondNode.edges.push(secondEdge);
    }
}