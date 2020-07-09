import { Pos } from '/@/source'

export const posToCoor = (nodeSize: number, pageX: number, pageY: number): Pos => {
  return [
    Math.floor(pageX / nodeSize),
    Math.floor(pageY / nodeSize)
  ]
}

export const coorToPos = (nodeSize: number, gridX: number, gridY: number): Pos => {
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


export const getCoorTransform = (width: number, height: number) => {
  const center = [ width, height ].map(el => Math.floor(el / 2)) as Pos

  const convertCoorToPos3d = (pos: Pos) => {
    return pos.map((el, index) => el - center[ index ]) as Pos
  }

  const covertPos3dToCoor = (pos: Pos) => {
    return pos.map((el, index) => el + center[ index ]) as Pos
  }

  return {
    convertCoorToPos3d,
    covertPos3dToCoor
  }
}


export const mmap = <T, K>(arr: T[][], func: (o:T, i:number, j:number) => K) => arr.map((a, i) => a.map((e, j) => func(e, i, j)))
export const fforeach = <T, K>(arr: T[][], func: (o:T, i:number, j:number) => K) => arr.forEach((a, i) => a.forEach((e, j) => func(e, i, j)))