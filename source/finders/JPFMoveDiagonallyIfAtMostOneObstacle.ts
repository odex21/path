/**
 * @author imor / https://github.com/imor
 */
import { JumpPointFinderBase } from './JumpPointFinderBase'
import { Pos } from '../core/Util'
import { Node } from '../core/Node'
import { DiagonalMovement } from '../core/DiagonalMovement'

/**
 * Path finder using the Jump Point Search algorithm which moves
 * diagonally only when there is at most one obstacle.
 */
export class JPFMoveDiagonallyIfAtMostOneObstacle extends JumpPointFinderBase {


    /**
     * Search recursively in the direction (parent -> child), stopping only when a
     * jump point is found.
     * @protected
     * @return {Array<Array<number>>} The x, y coordinate of the jump point
     *     found, or null if not found
     */
    protected _jump (x: number, y: number, px: number, py: number): Pos | null {
        const grid = this.grid!
        const dx = x - px, dy = y - py

        if (!grid.isWalkableAt(x, y)) {
            return null
        }

        if (this.trackJumpRecursion === true) {
            grid.getNodeAt(x, y).tested = true
        }

        if (grid.getNodeAt(x, y) === this.endNode) {
            return [ x, y ]
        }

        // check for forced neighbors
        // along the diagonal
        if (dx !== 0 && dy !== 0) {
            if ((grid.isWalkableAt(x - dx, y + dy) && !grid.isWalkableAt(x - dx, y)) ||
                (grid.isWalkableAt(x + dx, y - dy) && !grid.isWalkableAt(x, y - dy))) {
                return [ x, y ]
            }
            // when moving diagonally, must check for vertical/horizontal jump points
            if (this._jump(x + dx, y, x, y) || this._jump(x, y + dy, x, y)) {
                return [ x, y ]
            }
        }
        // horizontally/vertically
        else {
            if (dx !== 0) { // moving along x
                if ((grid.isWalkableAt(x + dx, y + 1) && !grid.isWalkableAt(x, y + 1)) ||
                    (grid.isWalkableAt(x + dx, y - 1) && !grid.isWalkableAt(x, y - 1))) {
                    return [ x, y ]
                }
            }
            else {
                if ((grid.isWalkableAt(x + 1, y + dy) && !grid.isWalkableAt(x + 1, y)) ||
                    (grid.isWalkableAt(x - 1, y + dy) && !grid.isWalkableAt(x - 1, y))) {
                    return [ x, y ]
                }
            }
        }

        // moving diagonally, must make sure one of the vertical/horizontal
        // neighbors is open to allow the path
        if (grid.isWalkableAt(x + dx, y) || grid.isWalkableAt(x, y + dy)) {
            return this._jump(x + dx, y + dy, x, y)
        } else {
            return null
        }
    }

    /**
     * Find the neighbors for the given node. If the node has a parent,
     * prune the neighbors based on the jump point search algorithm, otherwise
     * return all available neighbors.
     * @return {Array<Array<number>>} The neighbors found.
     */
    protected _findNeighbors (node: Node) {
        const parent = node.parent
        const x = node.x, y = node.y
        const grid = this.grid!
        const neighbors: Pos[] = []

        // directed pruning: can ignore most neighbors, unless forced.
        if (parent) {
            const { x: px, y: py } = parent
            // get the normalized direction of travel
            const dx = (x - px) / Math.max(Math.abs(x - px), 1)
            const dy = (y - py) / Math.max(Math.abs(y - py), 1)

            // search diagonally
            if (dx !== 0 && dy !== 0) {
                if (grid.isWalkableAt(x, y + dy)) {
                    neighbors.push([ x, y + dy ])
                }
                if (grid.isWalkableAt(x + dx, y)) {
                    neighbors.push([ x + dx, y ])
                }
                if (grid.isWalkableAt(x, y + dy) || grid.isWalkableAt(x + dx, y)) {
                    neighbors.push([ x + dx, y + dy ])
                }
                if (!grid.isWalkableAt(x - dx, y) && grid.isWalkableAt(x, y + dy)) {
                    neighbors.push([ x - dx, y + dy ])
                }
                if (!grid.isWalkableAt(x, y - dy) && grid.isWalkableAt(x + dx, y)) {
                    neighbors.push([ x + dx, y - dy ])
                }
            }
            // search horizontally/vertically
            else {
                if (dx === 0) {
                    if (grid.isWalkableAt(x, y + dy)) {
                        neighbors.push([ x, y + dy ])
                        if (!grid.isWalkableAt(x + 1, y)) {
                            neighbors.push([ x + 1, y + dy ])
                        }
                        if (!grid.isWalkableAt(x - 1, y)) {
                            neighbors.push([ x - 1, y + dy ])
                        }
                    }
                }
                else {
                    if (grid.isWalkableAt(x + dx, y)) {
                        neighbors.push([ x + dx, y ])
                        if (!grid.isWalkableAt(x, y + 1)) {
                            neighbors.push([ x + dx, y + 1 ])
                        }
                        if (!grid.isWalkableAt(x, y - 1)) {
                            neighbors.push([ x + dx, y - 1 ])
                        }
                    }
                }
            }
        }
        // return all neighbors
        else {
            const neighborNodes = grid.getNeighbors(node, DiagonalMovement.IfAtMostOneObstacle)
            for (let i = 0, l = neighborNodes.length; i < l; ++i) {
                const neighborNode = neighborNodes[ i ]
                neighbors.push([ neighborNode.x, neighborNode.y ])
            }
        }

        return neighbors
    };
}

