import { Ref } from 'vue'

/**
 * return ref's value 
 */
export const useRef = <T> (x: Ref<T>) => {
  if (x.value === null) throw new Error("ref's value is null!")
  return x.value!
}
export const setRef = <T> (x: Ref<T>, v: T) => x.value = v
