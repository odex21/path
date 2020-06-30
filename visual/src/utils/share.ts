import { Ref } from 'vue'

export const useRef = <T> (x: Ref<T>) => x.value
export const setRef = <T> (x: Ref<T>, v: T) => x.value = v
