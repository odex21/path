import { Pos, Grid } from '/@/source'
import { Route } from './convert'
import { Finder } from '/@/source/'

interface MapPosition {
  col: number
  row: number
  
}
const getPos = (pos: { col: number, row: number }): Pos => [ pos.col, pos.row ]
const changeStartAndEnd = (start: MapPosition, end: MapPosition) =>
    [ start, end ].map(el => getPos(el)).flat() as [ number, number, number, number ]

export const findPath = (target:Route, grid:Grid, finder: Finder) => {
  const { startPosition, endPosition } = target
  const [ startX, startY, endX, endY ] = changeStartAndEnd(startPosition, endPosition)
  grid.setWalkableAt(endX, endY, true)

  const path = finder.findPath(startX, startY, endX, endY, grid.clone())
  console.log(startPosition, endPosition, startX, startY, endX, endY, grid)
  
  return path
}