<template>
  hello vue3
  <div id="map" ref="container"></div>
</template>
<script lang="ts">
import { defineComponent, ref, Ref, onMounted } from 'vue'
import { initMap3d } from '../panel/sprite3d/convertMap'
import { useRef } from '../utils/share'

export default defineComponent({
  
  setup () {
    const container:Ref<null | Element> = ref(null)

    onMounted(() => {
      if(!container.value) return
      initMap3d(container.value)    
    })

    return {
      container
    }
  }
})
</script>
<style lang="stylus" scoped>
#map {
  width: 100vw
  height: 100vh
}

</style>
