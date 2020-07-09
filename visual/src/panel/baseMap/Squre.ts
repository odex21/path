import { Sprite, Node } from 'spritejs'
import { merge, omit } from 'ramda'
import { squreStyle } from './style'
import { pics } from '../../assets/cube/loadPic'

interface BaseSqureConfig {
  pos: [ number, number ]
  size?: [ number, number ]
  bgcolor?: string
  borderWidth?: number
  borderRadius?: number
  tileKey: string
  texture: string
}

const defaultBaseSqureConfig = {
  pos: [ 20, 300 ],
  borderWidth: 1,
  borderRadius: 0,
  size: [ 30, 30 ],
  id: 'squre',
  ...squreStyle.normal
}

let mapTextures: {
  [ index: string ]: string
} | undefined

export const enum ReactiveFlags {
  skip = '__v_skip',
  isReactive = '__v_isReactive',
  isReadonly = '__v_isReadonly',
  raw = '__v_raw',
  reactive = '__v_reactive',
  readonly = '__v_readonly'
}

export const initBaseSqure = async (baseSqureConfig: BaseSqureConfig) => {
  const config = merge(defaultBaseSqureConfig, baseSqureConfig)
  const { tileKey } = config
  const squre = new Sprite({
    anchor: [ 0.5, 0.5 ],
    ...config,
  })
  return squre
}

/**
 * @param  {Node} target
 * @param  {boolean} isWalkable 
 */
export const setSqureWalkable = (target: Node, isWalkable: boolean) => {
  const style = isWalkable ? squreStyle.normal : squreStyle.blocked
  target.attr(style)
}
