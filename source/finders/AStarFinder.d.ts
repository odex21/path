import { Grid } from '../core/Grid'

export class Finder {
  findPath (startX: number, startY: number, endX: number, endY: number, matrix: Grid): number[][]
}

export enum DiagonalMovement {
  Always = 1,
  Never = 2,
  IfAtMostOneObstacle = 3,
  OnlyWhenNoObstacles = 4
}

export interface Heuristic {
  heuristic?: (dx: number, dy: number) => number
}

// interface Grid {
//   new(width: number, height: number): Grid
//   new(matrix: number[][]): Grid

//   setWalkableAt (x: number, y: number, walkable: boolean): void

//   clone (): Grid

//   getNodeAt (x: number, y: number): Node
//   getNeighbors (node: Node, diagonalMovement: DiagonalMovement): Node[]
//   isWalkableAt (x: number, y: number): boolean
//   isInside (x: number, y: number): boolean

//   width: number
//   height: number
// }

export interface FinderOptions extends Heuristic {
  diagonalMovement?: DiagonalMovement
  weight?: number
}

export class AStarFinder extends Finder {
  // new (): AStarFinder
  constructor (opt?: FinderOptions)
}

