import { Cell } from "./Grid";
import { NamedGraph, GraphNode, GraphEdge } from "./Graph";
import { Wrapper } from "./Wrappers";

export class Astar<T, K extends GraphNode<T, K>> {
    startNode: K;
    targetNode: K;
    metric: (current: K, target: K) => number; // Must be a consistnet heuristic!

    currentNodes: NodeWrapper<T, K>[];

    constructor(
        startNode: K,
        targetNode: K,
        metric: (current: K, target: K) => number
    ) {
        this.startNode = startNode;
        this.targetNode = targetNode;
        this.metric = metric;

        this.currentNodes = [
            new NodeWrapper<T, K>(
                this.startNode,
                0,
                metric(this.startNode, this.targetNode)
            ),
        ];
    }

    doStep(): boolean {
        let nodeWrapper: NodeWrapper<T, K> = this.popBestNode();
        let node: K = nodeWrapper.wrapped;

        if (node === this.targetNode) {
            return true;
        }

        node.wasExplored = true;

        node.edges.forEach((edge: GraphEdge<T, K>) => {
            let neighbor = edge.targetNode;
            if (!neighbor.wasExplored) {
                if (neighbor.isWrapped()) {
                    let neighborWrapper: NodeWrapper<T, K> =
                        neighbor.getWrapper<NodeWrapper<T, K>>();

                    let newDist = nodeWrapper.distance + edge.weight;
                    if (newDist < neighborWrapper.distance) {
                        neighborWrapper.distance = newDist;
                    }
                } else {
                    let wrapper = new NodeWrapper<T, K>(
                        neighbor,
                        nodeWrapper.distance + edge.weight,
                        this.metric(neighbor, this.targetNode)
                    );
                    this.currentNodes.push(wrapper);
                }
            }
        });

        return false;
    }

    popBestNode(): NodeWrapper<T, K> {
        let minDist: number = Number.POSITIVE_INFINITY;
        let minNode: NodeWrapper<T, K>;

        if (this.currentNodes.length == 0) {
            throw new Error("Cant get `best node` for empty queue");
        }

        let tieBreakingDistance = 0;
        this.currentNodes.forEach((nodeWrapper: NodeWrapper<T, K>) => {
            if (
                nodeWrapper.totalDistance < minDist ||
                (nodeWrapper.totalDistance == minDist &&
                    nodeWrapper.distance > tieBreakingDistance)
            ) {
                minDist = nodeWrapper.totalDistance;
                minNode = nodeWrapper;
                tieBreakingDistance = nodeWrapper.distance;
            }
        });
        minNode = minNode!;

        let idx = this.currentNodes.indexOf(minNode);
        this.currentNodes.splice(idx, 1);

        return minNode;
    }
}

class NodeWrapper<T, K extends GraphNode<T, K>> extends Wrapper<K> {
    readonly estimatedDistance: number;
    private _distance: number;
    private _totalDistance: number;

    get totalDistance(): number {
        return this._totalDistance;
    }

    set distance(dist: number) {
        this._distance = dist;
        this._totalDistance = dist + this.estimatedDistance;
    }

    get distance(): number {
        return this._distance;
    }

    constructor(node: K, distance: number, estimatedDistance: number) {
        super(node);

        this.estimatedDistance = estimatedDistance;
        this._distance = distance;
        this._totalDistance = distance + this.estimatedDistance;
    }
}

export function manhatten<K extends GraphNode<[number, number], K>>(
    node1: K,
    node2: K
): number {
    let target = node2.nodeName;
    let start = node1.nodeName;

    return Math.abs(target[0] - start[0]) + Math.abs(target[1] - start[1]);
}

export function euclidean<K extends GraphNode<[number, number], K>>(
    node1: K,
    node2: K
): number {
    return Math.sqrt((node2.nodeName[0] - node1.nodeName[0]) *
        (node2.nodeName[0] - node1.nodeName[0]) +
        (node2.nodeName[1] - node1.nodeName[1]) *
        (node2.nodeName[1] - node1.nodeName[1])
    );
}
