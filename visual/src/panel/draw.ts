import { Ref, ref } from 'vue'
import { Scene, Node, Polyline } from 'spritejs'
import { initBaseSqure, setSqureWalkable } from './Squre'
import { DiagonalMovement, Heuristic, AStarFinder, } from '/@/source/'
import { merge, curry, flatten, mergeWith } from 'ramda'
import { isSamePos, Pos, getRectArr, coorToPos, posToCoor, sleep } from './utils'
import { squreStyle } from './style'
import { TrackedGrid } from '/@/source/core/Grid'
import { Operation } from '/@/source/core/Node'


type CurrentActionMode = 'idle' | 'draggingStart' | 'draggingEnd' | 'drawingWall' | 'erasingWall'
type WatchPos = Ref<Pos>
type WatchNum = Ref<number>

export interface InitMapConfig {
  nodeSize: number
  startCoor: WatchPos
  endCoor: WatchPos
  stepInterval: WatchNum
}

type PartialInitMapConfig = Partial<InitMapConfig>

const defaultInitMapConfig = {
  nodeSize: 30,
  startCoor: ref([ 0, 0 ]) as WatchPos,
  endCoor: ref([ 1, 1 ]) as WatchPos,
  stepInterval: ref(17) as WatchNum
}


export const initSprite = (container: HTMLCanvasElement, initConfig: PartialInitMapConfig = {}) => {
  // config  
  const config = merge(defaultInitMapConfig, initConfig)
  const { nodeSize, stepInterval } = config
  let { endCoor, startCoor } = config
  let currtMode: CurrentActionMode = 'idle'

  // helper
  const toCoor = curry(posToCoor)(nodeSize)
  const toPos = curry(coorToPos)(nodeSize)



  //? init pathfinding
  let resultPath: Polyline

  const mapArr = getRectArr(nodeSize, Math.floor(container.clientHeight / nodeSize), Math.floor(container.clientWidth / nodeSize,))
  const gridArr = mapArr.map(rows => rows.map(e => 0))
  //! ts 的参数判断有问题
  let grid = new TrackedGrid(gridArr)

  console.log('grid', grid)

  const finder = new AStarFinder({
    // allowDiagonal: true,
    diagonalMovement: DiagonalMovement.OnlyWhenNoObstacles,
    heuristic: Heuristic.manhattan,
    weight: 0.5,
    // dontCrossCorners: true
  })


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

  // start and end Point
  const startSqure = initBaseSqure({
    pos: coorToPos(nodeSize, ...startCoor.value!),
    size: [ nodeSize - 2, nodeSize - 2 ],
    ...squreStyle.start
  })
  const endSqure = initBaseSqure({
    pos: coorToPos(nodeSize, ...endCoor.value),
    size: [ nodeSize - 2, nodeSize - 2 ],
    ...squreStyle.end
  })
  layer.append(startSqure)
  layer.append(endSqure)



  // function
  const findPath = async () => {
    if (resultPath) {
      resultPath.remove()
    }
    const start = startCoor.value
    const end = endCoor.value
    const path = finder.findPath(start[ 0 ], start[ 1 ], end[ 0 ], end[ 1 ], grid.clone()) as [ number, number ][]

    resultPath = new Polyline({
      pos: [ 0, 0 ],
      points: flatten(path.map((points: Pos) => coorToPos(nodeSize, ...points))),
      strokeColor: 'blue',
      lineWidth: 3,
    })


    layer.append(resultPath)
    // console.log(grid.operations)
    for (const op of grid.operations) {
      if (op.attr in squreStyle) {
        const target: Node = layer.childNodes.find((e: Node) => isSamePos(e.attributes.pos, toPos(op.x, op.y)))
        if (target) {
          target.attr(squreStyle[ op.attr ])
        }
      }

      await sleep(stepInterval.value)
    }

    return path
  }

  const reset = () => {
    layer.childNodes.forEach(node => {
      changeSqureState(node, true)
    })
    grid.operations.forEach(op => {
      const target: Node = layer.childNodes.find((e: Node) => isSamePos(e.attributes.pos, toPos(op.x, op.y)))
      if (target) setSqureWalkable(target, true)
    })
    grid.operations = []
    if (resultPath) resultPath.remove()
  }

  const setGrid = (newGrid: TrackedGrid) => {
    newGrid.nodes.forEach(rows => {
      rows.forEach(node => {
        if (!node.walkable) {
          const target = layer.childNodes.find((child: Node) => isSamePos(child.attributes.pos, toPos(node.x, node.y)))
          changeSqureState(target, false)
        }
      })
    })
    grid = newGrid
  }


  // handler event
  const dragStartOrEnd = (target: Node, pos: Pos) => {
    target.attr({ pos: toPos(...pos) })
  }

  const changeSqureState = (target: Node, isWalkable?: boolean) => {
    const [ x, y ] = toCoor(...target.attributes.pos)
    // skip start | end Point
    if (isSamePos([ x, y ], startCoor.value) || isSamePos([ x, y ], endCoor.value)) return

    const curWalkable = grid.isWalkableAt(x, y)
    if (curWalkable === isWalkable) return
    if (isWalkable === undefined)
      isWalkable = !curWalkable

    grid.setWalkableAt(x, y, isWalkable)
    setSqureWalkable(target, isWalkable)
  }



  layer.addEventListener('mousedown', (ev) => {
    if (ev.target.id === 'squre') {
      const curPos = toCoor(...ev.target.attributes.pos)
      const where = (p: Pos) => isSamePos(curPos, p)
      if (currtMode === 'idle') {
        if (where(startCoor.value)) {
          currtMode = 'draggingStart'
        }
        else if (where(endCoor.value)) {
          currtMode = 'draggingEnd'
        }
        else if (grid.isWalkableAt(...curPos)) {
          currtMode = 'drawingWall'
        }
        else {
          currtMode = 'erasingWall'
        }
      }
    }
  })

  layer.addEventListener('mouseup', (ev) => {
    currtMode = 'idle'
  })

  layer.addEventListener('mousemove', (ev) => {
    if (currtMode !== 'idle' && ev.target.id === 'squre') {
      if (currtMode === 'draggingStart') {
        startCoor.value = toCoor(...ev.target.attributes.pos)
        dragStartOrEnd(startSqure, startCoor.value)
        return
      }

      if (currtMode === 'draggingEnd') {
        endCoor.value = toCoor(...ev.target.attributes.pos)
        dragStartOrEnd(endSqure, endCoor.value)
        return
      }

      // drawWall
      const isWalkable = currtMode === 'drawingWall' ? false : true
      changeSqureState(ev.target, isWalkable)
    }
  })

  return {
    grid,
    scene,
    findPath,
    reset,
    setGrid
  }
}

