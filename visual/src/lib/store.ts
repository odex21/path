import localforage from 'localforage'


export const getStore = (name = 'kkdy-path') => {
  return localforage.createInstance({ name })
}

export const GRID = 'grid'
export const START_POS = 'start_pos'
export const END_POS = 'end_pos'
