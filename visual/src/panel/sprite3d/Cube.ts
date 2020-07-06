import { Layer3d, shaders, Attrs3d, Cube, Program } from './sprite-ext-3d'
import { Pos } from '/@/source'


const baseColors = 'red red orange orange  blue blue'
const boxImages = [
  'https://p1.ssl.qhimg.com/d/inn/b61950e9faba/posx.jpg',
  'https://p5.ssl.qhimg.com/d/inn/b61950e9faba/negx.jpg',
  'https://p1.ssl.qhimg.com/d/inn/b61950e9faba/posy.jpg',
  'https://p4.ssl.qhimg.com/d/inn/b61950e9faba/negy.jpg',
  'https://p0.ssl.qhimg.com/d/inn/b61950e9faba/posz.jpg',
  'https://p1.ssl.qhimg.com/d/inn/b61950e9faba/negz.jpg',
]


interface CreateCubeConfigRaw {
  x: number
  y: number
  z: number
  texture?: string,
  convert: (p: Pos) => Pos
  layer: Layer3d,
  height?: number
}

type CreateCubeConfig = Omit<CreateCubeConfigRaw, 'z' | 'x' | 'y'>

const programMap = new Map<string, Program>()

const appendCubeRaw = async (config: CreateCubeConfigRaw) => {
  const { z, texture: _pic, layer, convert, height } = config
  let { x, y, } = config
  let program: Program
  if (programMap.has(_pic || 'none')) {
    program = programMap.get(_pic || 'none')!
  } else {
    const texture = _pic ? layer.createTexture(_pic) : undefined
    const progromConfig = _pic ? shaders.NORMAL_TEXTURE : shaders.NORMAL_GEOMETRY
    program = layer.createProgram({
      ...progromConfig,
      texture,
      cullFace: null,
    })
    programMap.set(_pic || 'none', program)
  }

  [ x, y ] = convert([ x, y ])

  const cubeAttrs = {
    colors: _pic ? undefined : z ? baseColors : [ 'grey' ],
    pos: [ x, z, y ],
    id: 'cube',
    height: height || 1,
  } as unknown as Attrs3d
  const cube = new Cube(program, cubeAttrs)
  layer.append(cube)
}

export const appendCube = (x: number, y: number, config: CreateCubeConfig) => appendCubeRaw({ ...config, z: 0, x, y })
export const appendCubeHeight = (x: number, y: number, config: CreateCubeConfig, z = 0.5) => appendCubeRaw({ ...config, x, y, z })



