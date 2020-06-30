/**
 * @author imor / https://github.com/imor
 */

import Heap from 'heap'
import { expandPath, backtrace, Path, Pos } from '../core/Util'
import { Heuristic, HeuristicFunc } from '../core/Heuristic'
import { Grid } from '../core/Grid'
import { Node } from '../core/Node'

export interface JumpPointFinderBaseOptions {
    heuristic: HeuristicFunc
    trackJumpRecursion: boolean
}


export abstract class JumpPointFinderBase {


    heuristic: HeuristicFunc

    /**
     * ???
     */
    trackJumpRecursion: boolean

    openList?: Heap<Node>

    startNode?: Node

    endNode?: Node

    grid?: Grid


    /**
     * Base class for the Jump Point Search algorithm
     * @param {object} opt
     * @param {function} opt.heuristic Heuristic function to estimate the distance
     *     (defaults to manhattan).
     */
    constructor (opt?: JumpPointFinderBaseOptions) {
        opt = opt || {} as JumpPointFinderBaseOptions
        this.heuristic = opt.heuristic || Heuristic.manhattan
        this.trackJumpRecursion = opt.trackJumpRecursion || false
    }

    /**
     * Find and return the path.
     * @return {Array<Array<number>>} The path, including both start and
     *     end positions.
     */
    findPath (startX: number, startY: number, endX: number, endY: number, grid: Grid): Path {
        this.openList = new Heap((nodeA: Node, nodeB: Node) => {
            return nodeA.f - nodeB.f
        })
        const openList = this.openList

        const startNode = this.startNode = grid.getNodeAt(startX, startY),
            endNode = this.endNode = grid.getNodeAt(endX, endY)

        this.grid = grid


        // set the `g` and `f` value of the start node to be 0
        startNode.g = 0
        startNode.f = 0

        // push the start node into the open list
        openList.push(startNode)
        startNode.opened = true

        // while the open list is not empty
        while (!openList.empty()) {
            // pop the position of node which has the minimum `f` value.
            const node = openList.pop()
            node.closed = true

            if (node === endNode) {
                return expandPath(backtrace(endNode))
            }

            this._identifySuccessors(node)
        }

        // fail to find the path
        return []
    }

    /**
     * Identify successors for the given node. Runs a jump point search in the
     * direction of each available neighbor, adding any points found to the open
     * list.
     * @protected
     */
    _identifySuccessors (node: Node) {
        const grid = this.grid!,
            heuristic = this.heuristic,
            openList = this.openList!

        const { x: endX, y: endY } = this.endNode!
        const x = node.x, y = node.y,
            abs = Math.abs, max = Math.max

        const neighbors = this._findNeighbors(node)
        for (let i = 0, l = neighbors.length; i < l; ++i) {
            const neighbor = neighbors[ i ]
            const jumpPoint = this._jump(neighbor[ 0 ], neighbor[ 1 ], x, y)
            if (jumpPoint) {

                const [ jx, jy ] = jumpPoint
                const jumpNode = grid.getNodeAt(jx, jy)

                if (jumpNode.closed) {
                    continue
                }

                // include distance, as parent may not be immediately adjacent:
                const d = Heuristic.octile(abs(jx - x), abs(jy - y))
                const ng = node.g + d // next `g` value

                if (!jumpNode.opened || ng < jumpNode.g) {
                    jumpNode.g = ng
                    jumpNode.h = jumpNode.h || heuristic(abs(jx - endX), abs(jy - endY))
                    jumpNode.f = jumpNode.g + jumpNode.h
                    jumpNode.parent = node

                    if (!jumpNode.opened) {
                        openList.push(jumpNode)
                        jumpNode.opened = true
                    } else {
                        openList.updateItem(jumpNode)
                    }
                }
            }
        }
    }

    protected abstract _findNeighbors (node: Node): Pos[]
    protected abstract _jump (x1: number, y1: number, x2: number, y2: number): Pos | null
}
