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
      <p>
        <button @click="startFind">findPath</button>
        <button @click="resetMap">reset</button>
      </p>
      <p>
        <button @click="saveGrid">saveGrid</button>
        <button @click="useGrid">useGrid</button>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, defineComponent, Ref, ref, reactive, toRefs } from 'vue'
import { initSprite, InitMapConfig } from './panel/draw'
import { Pos } from './panel/utils'
import { find } from 'ramda'
import { Grid, Node } from '/@/source'
import { getStore, GRID } from './lib/store'
import { TrackedGrid } from '../../source/core/Grid'

export default defineComponent({
  name: 'App',
  components: {
  },
  setup () {
    const container: Ref<HTMLCanvasElement | null> = ref(null)
    let grid: TrackedGrid
    let setGridFunc: (g: TrackedGrid) => void
    const localStore = getStore()

    const mapConfig = {
      startCoor: ref([ 11, 10 ]) as Ref<Pos>,
      endCoor: ref([ 17, 10 ]) as Ref<Pos>
    }

    const findPath = ref(async () => [ [ 0 ] ])
    const resetMap = ref(() => { })
    onMounted(() => {
      if (!container.value) throw new Error('can not find canvas element')
      const { scene, findPath: v_findPath, reset, grid: _g, setGrid } = initSprite(container.value, mapConfig)
      findPath.value = v_findPath
      resetMap.value = reset
      grid = _g
      setGridFunc = setGrid
    })


    const startFind = async () => {
      const path = await findPath.value()
      console.log(path)
    }

    const saveGrid = () => {
      const arr = grid.nodes.map((rows) => rows.map(n => n.walkable ? 0 : 1))
      localStore.setItem(GRID, arr)
    }

    const useGrid = async () => {
      const matrix: number[][] = await localStore.getItem(GRID)
      if (matrix && setGridFunc) {
        grid = new TrackedGrid(matrix)
        setGridFunc(grid)
      }
    }


    return {
      container,
      mapConfig,
      startFind,
      resetMap,
      saveGrid,
      useGrid
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
