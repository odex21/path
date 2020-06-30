import { Node } from '/@/source'
import { squreStyle } from './style'

export interface Controller {
  operations: {
    x: number
    y: number
    attr: keyof typeof squreStyle
    value: boolean
  }[]
}

export const trackNode = (Controller: Controller) => {

  Node.prototype = {
    get opened () {
      return this._opened
    },
    set opened (v) {
      this._opened = v
      Controller.operations.push({
        x: this.x,
        y: this.y,
        attr: 'opened',
        value: v
      })
    },
    get closed () {
      return this._closed
    },
    set closed (v) {
      this._closed = v
      Controller.operations.push({
        x: this.x,
        y: this.y,
        attr: 'closed',
        value: v
      })
    },
    get tested () {
      return this._tested
    },
    set tested (v) {
      this._tested = v
      Controller.operations.push({
        x: this.x,
        y: this.y,
        attr: 'tested',
        value: v
      })
    },
  }
}
