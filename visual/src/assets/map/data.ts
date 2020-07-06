export interface PosObj {
  x: number
  y: number
}

interface Effect {
  key: string,
  offset: {
    x: number,
    y: number,
    z: number
  },
  direction: number
}

interface RoutePos {
  col: number
  row: number
}

interface PathPoint {
  type: number
  time: number
  position: RoutePos
  reachOffset: PosObj
  randomizeReachOffset: boolean
  reachDistance: number
}

interface Route {
  motionMode: number
  startPosition: RoutePos
  endPosition: RoutePos
  spawnRandomRange: PosObj
  spawnOffset: PosObj
  checkpoints: PathPoint[]
  allowDiagonalMove: boolean
}


interface Tiles {
  tileKey: string
  heightType: number
  buildableType: number
  passableMask: number
  blackboard: any
  effects: Effect | null
  events?: {
    [ index: string ]: Function[]
  }
  extra?: any
}

interface MapData {
  map: number[][]
  tiles: Tiles[]
  width: number
  height: number
}

type R = Route | null

interface Data {
  mapData: MapData
  routes: R[]
}


export {
  R,
  Data,
  RoutePos,
  Route,
  MapData,
  Tiles
}
