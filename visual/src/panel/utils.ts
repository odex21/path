export type Pos = [ number, number ]

export const posToCoor = (nodeSize: number, pageX: number, pageY: number): [ number, number ] => {
  return [
    Math.floor(pageX / nodeSize),
    Math.floor(pageY / nodeSize)
  ]
}

export const coorToPos = (nodeSize: number, gridX: number, gridY: number): [ number, number ] => {
  return [
    gridX * nodeSize + nodeSize / 2,
    gridY * nodeSize + nodeSize / 2
  ]
}

export const isSamePos = (p1: Pos, p2: Pos) => {
  return p1[ 0 ] === p2[ 0 ] && p1[ 1 ] === p2[ 1 ]
}


export const getRectArr = (size: number, rows: number, cols: number) => {
  return Array.from({ length: rows }, (v, r) => {
    return Array.from({ length: cols }, (v, c) => coorToPos(size, c, r))
  })
}

export const buildSvgPath = (nodeSize: number, path: number[][]) => {
  const strs = [], size = nodeSize

  strs.push('M' + (path[ 0 ][ 0 ] * size + size / 2) + ' ' +
    (path[ 0 ][ 1 ] * size + size / 2))
  for (let i = 1; i < path.length; ++i) {
    strs.push('L' + (path[ i ][ 0 ] * size + size / 2) + ' ' +
      (path[ i ][ 1 ] * size + size / 2))
  }

  return strs.join('')
}

export const sleep = (time: number) => {
  return new Promise(resolve => {
    setTimeout(() => resolve(), time)
  })
}
