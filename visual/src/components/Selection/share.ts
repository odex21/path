import mitt from 'mitt'
import { inject, provide, InjectionKey, Ref } from 'vue'
import { generatePrefix } from '/src/components/prefix'

export const createEmiiter = () => mitt()

interface SelectionProvideData {
  msg: string | Ref<string>
  selectedId: Ref<number>
  emiiter: mitt.Emitter
}
const key: InjectionKey<SelectionProvideData> = Symbol('Selection')

export const useProvide = (data: SelectionProvideData) => {
  provide(key, data)
}

export const useInject = () => inject(key)
