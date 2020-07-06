import { Scene, Layer, Attrs, Node, Event } from 'spritejs'
import { shaders, Cube, Layer3d, Geometry, } from './sprite-ext-3d'
import { Pos } from '/@/source'
import { getCoorTransform, sleep } from '../utils'
import { createPolyline3d } from './path3d'
import { appendCube, appendCubeHeight } from './Cube'

interface Draw3dConfig {
  width: number
  height: number
}


export const init3d = (container: Element, config?: Draw3dConfig) => {
  console.log(container.clientWidth, container.clientHeight)
  const { width, height } = config || { width: 10, height: 8 }
  const { convertCoorToPos3d } = getCoorTransform(width, height)

  const scene = new Scene({
    container,
    displayRatio: 2,
    mode: 'stickyLeft',
  })
  const layer = scene.layer3d('test-3d', {
    camera: {
      fov: 45,
    },
    // ambientColor: 'rgba(255,255,255, 1)',
    // pointLightColor: '#f9f3df',
    // pointLightPosition: [ 5, 3, 6 ],
  }) as Layer3d

  layer.camera.attributes.pos = [ 0, 10, 10 ]


  const createCubeConfig = { layer, convert: convertCoorToPos3d }

  /**
   * floor 地板
   */
  const floor = Array.from({ length: 8 }, () => Array.from({ length: 10 }))
  floor.forEach((row, rowIndex) => {
    row.forEach((col, colIndex) => {
      appendCube(colIndex, rowIndex, createCubeConfig)
    })
  })
  floor.forEach((row, rowIndex) => {
    row.forEach((col, colIndex) => {
      if (Math.random() > 0.7)
        appendCubeHeight(colIndex, rowIndex, createCubeConfig)
    })
  })

  layer.setOrbit()
  layer.setRaycast()

  const polyline = createPolyline3d(layer, [ [ 0, 0 ], [ 5, 5 ], [ 3, 4 ] ], { convert: convertCoorToPos3d })
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
  layer.addEventListener('click', changeCubeColor)
  layer.addEventListener('touchstart', changeCubeColor)

  return {
    layer
  }
}


