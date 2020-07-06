import { Polyline3d, Layer3d, shaders } from './sprite-ext-3d'
import { getCoorTransform } from '../utils'
import { Pos } from '/@/source'

const { convertCoorToPos3d } = getCoorTransform(10, 8)

interface CreatePolyLineConfig {
  convert: (p: Pos) => Pos
  color?: string
}

export const createPolyline3d = (layer: Layer3d, path: Pos[], config: CreatePolyLineConfig) => {
  const program = layer.createProgram({
    ...shaders.POLYLINE,
  }, {
    uniforms: {
      uThickness: {
        value: 10
      },
    },
  })

  const convert = config.convert
  const color = config.color || 'red'
  const points = convertPathTo3d(path, 0.6, convert)

  const polyline = new Polyline3d({
    pos: [ 0, 0, 0 ],
    points,
    colors: color,
    width: 30,
    program
  })
  return polyline
}

const convertPathTo3d = (path: Pos[], heigth: number, convert: (p: Pos) => Pos) => {
  return path.map(el => {
    const [ x, y ] = convert(el)
    return [ x, heigth, y ]
  })
}
