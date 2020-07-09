import { Ref, ref } from 'vue'
import { Scene, Node, Polyline } from 'spritejs'
import { initBaseSqure, setSqureWalkable } from './Squre'
import { DiagonalMovement, Heuristic, AStarFinder, Node as GridNode, smoothenPath, Pos, Path, compressPath, JumpPointFinder, Grid } from '/@/source/'
import { merge, curry, flatten, mergeWith, omit } from 'ramda'
import { isSamePos, getRectArr, coorToPos, posToCoor, sleep, mmap, fforeach } from '../utils'
import { squreStyle } from './style'
import { TrackedGrid } from '/@/source/core/Grid'
import { MapCube, changeMapPos } from '../convert'
import { pics } from '../../assets/cube/loadPic'


type CurrentActionMode = 'idle' | 'draggingStart' | 'draggingEnd' | 'drawingWall' | 'erasingWall'
export type WatchPos = Ref<Pos>
export type WatchNum = Ref<number>

export interface InitMapConfig {
  nodeSize: number
  mapCubes: MapCube[][]
  mapGrid: Grid
}

export type PartialInitMapConfig = Partial<InitMapConfig>

const defaultInitMapConfig = {
  nodeSize: 30,
  stepInterval: ref(17) as WatchNum
}


export const initSprite = async (container: Element, initConfig: InitMapConfig) => {
  // config  
  const config = merge(defaultInitMapConfig, initConfig)
  const { nodeSize, stepInterval, mapCubes, mapGrid } = config

  // helper
  const toCoor = curry(posToCoor)(nodeSize)
  const toPos = curry(coorToPos)(nodeSize)

  // status 
  const pathMap = new Map<Path, Node>()

  //? init pathfinding
  let resultPathNode: Polyline
  let running = false

  let mapArr = mmap(mapCubes, (cube, i, j) => toPos(j, i))

  // init sprite
  const scene = new Scene({
    container,
    width: container.clientWidth,
    height: container.clientHeight,
    mode: 'stickyLeft'
  })
  const layer = scene.layer()

  const mapTextures = await Object.entries(pics).reduce(async (p, cur) => {
    const res = await p
    res[ cur[ 0 ] ] = (await cur[ 1 ]).default
    return res
  }, {} as any) as { [ index: string ]: string }

  const drawMap = () => fforeach(mapArr, async (pos, i, j) => {
    const curCube = mapCubes[ i ][ j ]
    const squre = await initBaseSqure({
      pos,
      size: [ nodeSize - 2, nodeSize - 2 ],
      tileKey: curCube.tileKey,
      texture: mapTextures[ curCube.tileKey ]
    })
    layer.append(squre)
  })

  const init = () => {
    layer.removeAllChildren()
    drawMap()
  }

  init()

  /**
   * draw path
   */
  const drawPath = async (path: Path) => {
    running = true

    resultPathNode = new Polyline({
      pos: [ 0, 0 ],
      points: flatten(path.map((points: Pos) => toPos(...points))),
      strokeColor: 'blue',
      lineWidth: 3,
    })


    layer.append(resultPathNode)

    pathMap.set(path, resultPathNode)

    running = false
    return resultPathNode
  }


  /**
   * remove path from map
   */
  const removePath = async (path: Path) => {
    const target = pathMap.get(path)
    if (!target) throw new Error('no path')
    const { minX, minY, maxX, maxY } = (target.attributes.points as number[])
      .reduce(({ minX, maxX, minY, maxY }, cur, index) => {
        if (index % 2 !== 0) {
          minY = minY === undefined ? cur : Math.min(minY, cur)
          maxY = maxY === undefined ? cur : Math.max(maxY, cur)
        } else {
          minX = minX === undefined ? cur : Math.min(minX, cur)
          maxX = maxX === undefined ? cur : Math.max(maxX, cur)
        }
        return {
          minX, maxX, minY, maxY
        }
      }, {} as { minX: number, maxX: number, minY: number, maxY: number })
    const middle = (max: number, min: number) => (max + min) / 2
    const pos = [ middle(maxX, minX), middle(maxY, minY) ] as [ number, number ]
    await target.animate([
      {
        scale: 1,
        pos,
        normalize: true,
        opacity: 1
      },
      {
        anchor: 0.5,
        scale: 1.2,
        opacity: 0
      }
    ],
      {
        duration: 700,
        easing: 'ease'
      }).finished
    target.remove()
    pathMap.delete(path)
  }


  return {
    scene,
    drawPath,
    init,
    removePath
  }
}


export type DrawPath = (p: Path) => Promise<Polyline>
export type RemovePath = (p: Path) => Promise<void>
