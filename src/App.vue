<template>
  <!-- <img alt="Vue logo" src="./assets/logo.png" /> -->
  <!-- <HelloWorld msg="Hello Vue 3.0 + Vite" /> -->
  <div id="container" ref="container" />
  <div class="status">
    <div
      v-for="(coor, key) in mapConfig"
      :key="key"
      class="status-coor"
      :class="key"
      @click="changeStart"
    >
      {{ key }}
      <span>x: {{ coor[0] }}, y: {{ coor[1] }}</span>
    </div>
    <div class="status-controller">
      <button @click="startFind">findPath</button>
      <button @click="resetMap">reset</button>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, defineComponent, Ref, ref, reactive, toRefs } from 'vue'
import { initSprite, InitMapConfig } from './panel/draw'
import { Pos } from './panel/utils'
import { find } from 'ramda'

export default defineComponent({
  name: 'App',
  components: {
  },
  setup () {
    const container: Ref<HTMLCanvasElement> = ref(null)


    const mapConfig = reactive({
      startCoor: [ 20, 10 ],
      endCoor: [ 35, 10 ]
    }) as InitMapConfig

    const findPath = ref(async () => [ [ 0 ] ])
    const resetMap = ref(() => { })
    onMounted(() => {
      if (container.value) {
        const { scene, findPath: v_findPath, reset } = initSprite(container.value, toRefs(mapConfig))
        findPath.value = v_findPath
        resetMap.value = reset
      }
    })

    const changeStart = () => {
      // startCoor = [ 2, 1 ]
    }

    const startFind = async () => {
      const path = await findPath.value()
      console.log(path)
    }
    return {
      container,
      mapConfig,
      startFind,
      resetMap
    }
  }
})
</script>
<style lang="stylus" scoped>
#container {
  width: 100vw
  height: 100vh
}

.status {
  position: absolute
  z-index: 10
  bottom: 40px
  right: 20px
  background-color: rgba(0, 0, 0, 0.3)
  border-radius: 30px
  height: 300px
  width: 500px
  color: #fff

  &-coor {
    margin: 20px
  }
}
</style>
