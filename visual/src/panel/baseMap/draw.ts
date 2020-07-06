import { Ref, ref } from 'vue'
import { Scene, Node, Polyline } from 'spritejs'
import { initBaseSqure, setSqureWalkable } from './Squre'
import { DiagonalMovement, Heuristic, AStarFinder, Node as GridNode, smoothenPath, Pos, Path, compressPath, JumpPointFinder, Grid } from '/@/source/'
import { merge, curry, flatten, mergeWith } from 'ramda'
import { isSamePos, getRectArr, coorToPos, posToCoor, sleep, mmap } from '../utils'
import { squreStyle } from './style'
import { TrackedGrid } from '/@/source/core/Grid'
import { MapCube } from '../convert'


type CurrentActionMode = 'idle' | 'draggingStart' | 'draggingEnd' | 'drawingWall' | 'erasingWall'
export type WatchPos = Ref<Pos>
export type WatchNum = Ref<number>

export interface InitMapConfig {
  nodeSize: number
  stepInterval: WatchNum
  mapCubes: MapCube[][]
  mapGrid: Grid
}

export type PartialInitMapConfig = Partial<InitMapConfig>

const defaultInitMapConfig = {
  nodeSize: 30,
  stepInterval: ref(17) as WatchNum
}


export const initSprite = (container: Element, initConfig: PartialInitMapConfig = {}) => {
  // config  
  const config = merge(defaultInitMapConfig, initConfig)
  const { nodeSize, stepInterval, mapCubes, mapGrid } = config

  // helper
  const toCoor = curry(posToCoor)(nodeSize)
  const toPos = curry(coorToPos)(nodeSize)

  // status 
  const pathMap = new Map<Path, Node>()

  //? init pathfinding
  let resultPath: Polyline
  let running = false

  let grid = mapGrid
  let mapArr: Pos[][]
  mapArr = getRectArr(nodeSize, Math.floor(container.clientHeight / nodeSize), Math.floor(container.clientWidth / nodeSize,))
  const gridArr = mapArr.map(rows => rows.map(e => 0))
  //! ts 的参数判断有问题

  // init sprite
  const scene = new Scene({
    container,
    width: container.clientWidth,
    height: container.clientHeight,
    mode: 'stickyLeft'
  })
  const layer = scene.layer()

  mapArr.forEach((rows) => {
    rows.forEach(pos => {
      layer.append(initBaseSqure({
        pos,
        size: [ nodeSize - 2, nodeSize - 2 ]
      }))
    })
  })


  /**
   * find path
   */
  const drawPath = async (path: Path) => {
    running = true

    resultPath = new Polyline({
      pos: [ 0, 0 ],
      points: flatten(path.map((points: Pos) => toPos(...points))),
      strokeColor: 'blue',
      lineWidth: 3,
    })


    layer.append(resultPath)
    // console.log(grid.operations)


    running = false
    return path
  }

  /**
   * remove map status
   */
  const remove = () => {
    layer.childNodes.forEach(node => node.remove())
  }

  /**
   * remove path from map
   */
  const removePath = async (path: Path) => {
    const target = pathMap.get(path)
    if (!target) throw new Error('no path')
    await target.animate([
      {
        scale: [ 0.8, 0.8 ],
      },
      {
        scale: [ 1.2, 1.2 ]
      }
    ], {
      duration: 1
    })
    target.remove()
    pathMap.delete(path)
  }

  /**
   * function
   */
  const setGrid = (newGrid: TrackedGrid) => {


    grid = newGrid
  }


  // handler event


  return {
    grid,
    scene,
    drawPath,
    remove,
    setGrid
  }
}

