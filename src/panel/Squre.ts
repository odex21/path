import { Sprite, Node } from 'spritejs'
import { merge, omit } from 'ramda'
import { squreStyle } from './style'

interface BaseSqureConfig {
  pos: [ number, number ]
  size?: [ number, number ]
  bgcolor?: string
  borderWidth?: number
  borderRadius?: number
}

const defaultBaseSqureConfig = {
  pos: [ 20, 300 ],
  borderWidth: 1,
  borderRadius: 0,
  size: [ 30, 30 ],
  id: 'squre',
  ...squreStyle.normal
}

export const initBaseSqure = (baseSqureConfig: BaseSqureConfig) => {
  const config = merge(defaultBaseSqureConfig, baseSqureConfig)

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
