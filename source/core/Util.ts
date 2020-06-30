import { Node } from './Node'
import { Grid } from './Grid'
import { DiagonalMovement } from './DiagonalMovement'

export type Pos = [ number, number ]
export type Path = Pos[]

/**
 * Backtrace according to the parent records and return the path.
 * (including both start and end nodes)
 * @param {Node} node End node
 * @return {Array<Array<number>>} the path
 */
export function backtrace (node: Node) {
    var path: Path = [ [ node.x, node.y ] ]
    while (node.parent) {
        node = node.parent
        path.push([ node.x, node.y ])
    }
    return path.reverse()
}

/**
 * Backtrace from start and end node, and return the path.
 * (including both start and end nodes)
 * @param {Node}
 * @param {Node}
 */
export function biBacktrace (nodeA: Node, nodeB: Node) {
    var pathA = backtrace(nodeA),
        pathB = backtrace(nodeB)
    return pathA.concat(pathB.reverse())
}

/**
 * Compute the length of the path.
 * @param {Array<Array<number>>} path The path
 * @return {number} The length of the path
 */
export function pathLength (path: Path) {
    var i, sum = 0, a, b, dx, dy
    for (i = 1; i < path.length; ++i) {
        a = path[ i - 1 ]
        b = path[ i ]
        dx = a[ 0 ] - b[ 0 ]
        dy = a[ 1 ] - b[ 1 ]
        sum += Math.sqrt(dx * dx + dy * dy)
    }
    return sum
}

/**
 * Given the start and end coordinates, return all the coordinates lying
 * on the line formed by these coordinates, based on Bresenham's algorithm.
 * http://en.wikipedia.org/wiki/Bresenham's_line_algorithm#Simplification
 * @param {number} x0 Start x coordinate
 * @param {number} y0 Start y coordinate
 * @param {number} x1 End x coordinate
 * @param {number} y1 End y coordinate
 * @return {Array<Array<number>>} The coordinates on the line
 */
export function interpolate (x0: number, y0: number, x1: number, y1: number) {
    var abs = Math.abs,
        line: Path = [],
        sx, sy, dx, dy, err, e2

    dx = abs(x1 - x0)
    dy = abs(y1 - y0)

    sx = (x0 < x1) ? 1 : -1
    sy = (y0 < y1) ? 1 : -1

    err = dx - dy

    while (true) {
        line.push([ x0, y0 ])

        if (x0 === x1 && y0 === y1) {
            break
        }

        e2 = 2 * err
        if (e2 > -dy) {
            err = err - dy
            x0 = x0 + sx
        }
        if (e2 < dx) {
            err = err + dx
            y0 = y0 + sy
        }
    }

    return line
}

/**
 * Given a compressed path, return a new path that has all the segments
 * in it interpolated.
 * @param {Array<Array<number>>} path The path
 * @return {Array<Array<number>>} expanded path
 */
export function expandPath (path: Path) {
    var expanded: Path = [],
        len = path.length,
        coord0, coord1,
        interpolated,
        interpolatedLen,
        i, j

    if (len < 2) {
        return expanded
    }

    for (i = 0; i < len - 1; ++i) {
        coord0 = path[ i ]
        coord1 = path[ i + 1 ]

        interpolated = interpolate(coord0[ 0 ], coord0[ 1 ], coord1[ 0 ], coord1[ 1 ])
        interpolatedLen = interpolated.length
        for (j = 0; j < interpolatedLen - 1; ++j) {
            expanded.push(interpolated[ j ])
        }
    }
    expanded.push(path[ len - 1 ])

    return expanded
}

/**
 * Smoothen the give path.
 * The original path will not be modified; a new path will be returned.
 * @param {PF.Grid} grid
 * @param {Array<Array<number>>} path The path
 */
export function smoothenPath (grid: Grid, path: Path) {
    var len = path.length,
        x0 = path[ 0 ][ 0 ],        // path start x
        y0 = path[ 0 ][ 1 ],        // path start y
        x1 = path[ len - 1 ][ 0 ],  // path end x
        y1 = path[ len - 1 ][ 1 ],  // path end y
        sx = x0, sy = y0               // current start coordinate

    const newPath: Path = [ [ sx, sy ] ]
    let lastValidCoord

    for (let i = 2; i < len; ++i) {
        const coord = path[ i ]
        // current end coordinate
        const ex = coord[ 0 ], ey = coord[ 1 ]

        const line = interpolate(sx, sy, ex, ey)

        let blocked = false
        for (let j = 1; j < line.length; ++j) {
            const testCoord = line[ j ]

            if (!grid.isWalkableAt(testCoord[ 0 ], testCoord[ 1 ])) {
                blocked = true
                break
            }
        }
        if (blocked) {
            lastValidCoord = path[ i - 1 ]
            newPath.push(lastValidCoord)
            sx = lastValidCoord[ 0 ]
            sy = lastValidCoord[ 1 ]
        }
    }
    newPath.push([ x1, y1 ])

    return newPath
}

/**
 * Compress a path, remove redundant nodes without altering the shape
 * The original path is not modified
 * @param {Array<Array<number>>} path The path
 * @return {Array<Array<number>>} The compressed path
 */
export function compressPath (path: Path) {

    // nothing to compress
    if (path.length < 3) {
        return path
    }

    var compressed: Path = [],
        sx = path[ 0 ][ 0 ], // start x
        sy = path[ 0 ][ 1 ], // start y
        px = path[ 1 ][ 0 ], // second point x
        py = path[ 1 ][ 1 ], // second point y
        dx = px - sx, // direction between the two points
        dy = py - sy, // direction between the two points
        lx, ly,
        ldx, ldy,
        sq, i

    // normalize the direction
    sq = Math.sqrt(dx * dx + dy * dy)
    dx /= sq
    dy /= sq

    // start the new path
    compressed.push([ sx, sy ])

    for (i = 2; i < path.length; i++) {

        // store the last point
        lx = px
        ly = py

        // store the last direction
        ldx = dx
        ldy = dy

        // next point
        px = path[ i ][ 0 ]
        py = path[ i ][ 1 ]

        // next direction
        dx = px - lx
        dy = py - ly

        // normalize
        sq = Math.sqrt(dx * dx + dy * dy)
        dx /= sq
        dy /= sq

        // if the direction has changed, store the point
        if (dx !== ldx || dy !== ldy) {
            compressed.push([ lx, ly ])
        }
    }

    // store the last point
    compressed.push([ px, py ])

    return compressed
}

type PositionAllowArray = [ boolean, boolean, boolean, boolean ]

export const checkDiagonalMovement = (diagonalMovement: DiagonalMovement, offsets: PositionAllowArray): PositionAllowArray => {
    const [ s0, s1, s2, s3 ] = offsets
    let d0 = false
    let d1 = false
    let d2 = false
    let d3 = false

    if (diagonalMovement === DiagonalMovement.Never) {
        throw new Error('If set DiagonalMovement Never, it should not call this function')
    }

    if (diagonalMovement === DiagonalMovement.OnlyWhenNoObstacles) {
        d0 = s3 && s0
        d1 = s0 && s1
        d2 = s1 && s2
        d3 = s2 && s3
    } else if (diagonalMovement === DiagonalMovement.IfAtMostOneObstacle) {
        d0 = s3 || s0
        d1 = s0 || s1
        d2 = s1 || s2
        d3 = s2 || s3
    } else if (diagonalMovement === DiagonalMovement.Always) {
        d0 = true
        d1 = true
        d2 = true
        d3 = true
    } else {
        throw new Error('Incorrect value of diagonalMovement')
    }

    return [ d0, d1, d2, d3 ]
}

