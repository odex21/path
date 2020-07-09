<template>
  <div :class="prefix('selection')">
    <p>{{ msg }}: {{ selectedId }}?</p>
    <slot></slot>
  </div>
</template>
<script lang="ts">
import { defineComponent, Ref, PropType, ref, toRefs } from 'vue'
import { useProvide, createEmiiter } from './share'
import { setRef } from '../../utils/share'
import { prefix } from '../prefix'

export default defineComponent({
  props: {
    msg: {
      default: '',
      type: [ Object, String ] as PropType<Ref<string> | string>
    },
    selectedId: {
      default: -1,
      type: Number
    }
  },
  setup (props, { emit }) {
    const emiiter = createEmiiter()
    const { selectedId, } = toRefs(props)

    emiiter.on('selected', (id) => {
      emit('update:selectedId', id)
    })

    useProvide({
      msg: props.msg,
      selectedId,
      emiiter,
    })


    return {
      prefix
    }
  }
})
</script>