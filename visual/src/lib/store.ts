import localforage from 'localforage'


export const getStore = (name = 'kkdy-path') => {
  return localforage.createInstance({ name })
}

export const GRID = 'grid'
