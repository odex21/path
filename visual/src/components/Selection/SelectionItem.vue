<template>
  <div :class="prefix('selection-item-wrapper')" @click="handleClick">
    <slot>{{ props.value }}</slot>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType, computed } from 'vue'
import { useInject } from './share'
import { prefix } from '../prefix'

export default defineComponent({
  props: {
    value: {
      default: 'd',
      type: [ String, Number ] as PropType<string | number>
    }
  },
  setup (props, { emit }) {
    const injectData = useInject()
    if (!injectData) throw new Error('SelectionItem only can use in Selection')
    const msg = computed(() => injectData.msg)

    const handleClick = () => {
      injectData.emiiter.emit('selected', props.value)
    }

    return {
      props,
      handleClick,
      msg,
      prefix
    }
  }
})
</script>