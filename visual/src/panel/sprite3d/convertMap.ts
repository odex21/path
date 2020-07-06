import { Scene, Event } from 'spritejs'
import { shaders, Cube, Layer3d, Geometry, } from './sprite-ext-3d'
import { Pos, Grid, JumpPointFinder, DiagonalMovement, Heuristic } from '/@/source'
import { getCoorTransform, sleep } from '../utils'
import { createPolyline3d } from './path3d'
import { appendCube, appendCubeHeight } from './Cube'



import { default as mapdata } from '/src/assets/map/raw/level_main_07-08.json'
import { loadPic, pics, tileKeys } from '../../assets/cube/loadPic'

const { mapData, routes } = mapdata

/**
 * 地图地板数组
 */
const mapCubes = mapData.map.map(rows => rows.map((index) => mapData.tiles[ index ]))


const grid = new Grid(mapCubes.map(rows => rows.map(el => {
  const { passableMask, tileKey } = el
  return !/end|hole/.test(tileKey) && passableMask === 3 ? 0 : 1
})))

const getPos = (pos: { col: number, row: number }): [ number, number ] => [ pos.col, pos.row ]
const { startPosition, endPosition } = routes[ 1 ]!
const finder = JumpPointFinder({
  diagonalMovement: DiagonalMovement.OnlyWhenNoObstacles,
  heuristic: Heuristic.octile,
  trackJumpRecursion: false
})

interface MapPosition {
  col: number
  row: number
}
const changeStartAndEnd = (start: MapPosition, end: MapPosition) =>
  [ start, end ].map(el => getPos(el)).flat() as [ number, number, number, number ]

const [ startX, startY, endX, endY ] = changeStartAndEnd(startPosition, endPosition)
grid.setWalkableAt(endX, endY, true)
const path = finder.findPath(startX, startY, endX, endY, grid.clone())
console.log(startPosition, endPosition, startX, startY, endX, endY, grid)
console.log(path)

interface Draw3dConfig {
  width: number
  height: number
}


export const initMap3d = async (container: Element, config?: Draw3dConfig) => {
  const { width, height } = config || { width: mapCubes[ 0 ].length, height: mapCubes.length }
  const { convertCoorToPos3d } = getCoorTransform(width, height)

  console.log(container.clientWidth, container.clientHeight, width, height)

  const scene = new Scene({
    container,
    displayRatio: 2,
    mode: 'stickyLeft',
  })
  const layer = scene.layer3d('test-3d', {
    camera: {
      fov: 45,
    }
  }) as Layer3d

  layer.camera.attributes.pos = [ 0, 10, 10 ]

  const createCubeConfig = { layer, convert: convertCoorToPos3d }

  const mapTextures = await Object.entries(pics).reduce(async (p, cur) => {
    const res = await p
    res[ cur[ 0 ] ] = (await cur[ 1 ]).default
    return res
  }, {} as any) as { [ index: string ]: string }

  /**
   * floor 地板
   */
  const floor = mapCubes//Array.from({ length: 8 }, () => Array.from({ length: 10 }))
  floor.forEach((row, rowIndex) => {
    row.forEach((cube, colIndex) => {
      if (cube.heightType === 0) {
        const texture = mapTextures[ cube.tileKey ]
        if ([ 'tile_start', 'tile_end' ].includes(cube.tileKey)) {
          appendCubeHeight(colIndex, rowIndex, { ...createCubeConfig, texture, height: 1 }, 1)
        } else {
          appendCube(colIndex, rowIndex, { ...createCubeConfig, texture })
        }
      }
    })
  })

  floor.forEach((row, rowIndex) => {
    row.forEach((cube, colIndex) => {
      if (cube.heightType === 1) {
        const texture = mapTextures[ cube.tileKey ]
        appendCubeHeight(colIndex, rowIndex, { ...createCubeConfig, texture })
      }
    })
  })

  layer.setOrbit()
  layer.setRaycast()

  const polyline = createPolyline3d(layer, path, { convert: convertCoorToPos3d })
  layer.append(polyline)

  const changeCubeColor = (evt: Event) => {
    if (evt.target.id = 'cube') {
      const colors = []
      for (let i = 0; i < 3; i++) {
        const randomColor = `hsl(${Math.floor(360 * Math.random())}, 50%, 50%)`
        colors.push(randomColor, randomColor)
      }
      evt.target.attributes.colors = colors
    } else if (evt.target !== layer) {
      evt.target.attributes.colors = `hsl(${Math.floor(360 * Math.random())}, 50%, 50%)`
    }
  }
  // layer.addEventListener('click', changeCubeColor)
  // layer.addEventListener('touchstart', changeCubeColor)

  return {
    layer
  }
}


