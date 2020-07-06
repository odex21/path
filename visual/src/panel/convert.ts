import { Pos, Grid, JumpPointFinder, DiagonalMovement, Heuristic } from '/@/source/'

import { default as mapdata } from '/src/assets/map/raw/level_main_07-08.json'
import { loadPic, pics, tileKeys } from '/src/assets/cube/loadPic'


export const changeMapPos = (pos: { col: number, row: number }): [ number, number ] => [ pos.col, pos.row ]
export const changeStartAndEnd = (start: MapPosition, end: MapPosition) =>
  [ start, end ].map(el => changeMapPos(el)).flat() as [ number, number, number, number ]


interface MapPosition {
  col: number
  row: number
}

export interface MapCube {
  tileKey: string
  heightType: number
  buildableType: number
  passableMask: number
  blackboard: null
  effects: null
}

export const convertMapData = (data: typeof mapdata) => {

  const { mapData, routes } = data || mapdata
  /**
   * 地图地板数组
   */
  const mapCubes = mapData.map.map(rows => rows.map((index) => mapData.tiles[ index ]))

  const grid = new Grid(mapCubes.map(rows => rows.map(el => {
    const { passableMask, tileKey } = el
    return !/end|hole/.test(tileKey) && passableMask === 3 ? 0 : 1
  })))

  const finder = JumpPointFinder({
    diagonalMovement: DiagonalMovement.OnlyWhenNoObstacles,
    heuristic: Heuristic.octile,
    trackJumpRecursion: false
  })

  return {
    mapCubes,
    grid,
    finder
  }
}
