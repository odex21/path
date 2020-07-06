<template>
  <div id="container" ref="container"></div>
  <div style="display:none" class="status">
    <div
      v-for="(coor, key) in mapConfigShowed"
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
      <p>
        stepInterval:
        {{ stepInterval }}
        <input
          id="stepInterval"
          v-model="stepInterval"
          :max="300"
          :min="1"
          type="range"
          name="stepInterval"
        />
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, defineComponent, Ref, ref, reactive, toRefs, toRaw } from 'vue'
import { initSprite, InitMapConfig, PartialInitMapConfig, WatchPos } from '../panel/base/draw'
import { find, omit } from 'ramda'
import { Grid, Node, Pos } from '/@/source'
import { getStore, GRID, START_POS, END_POS } from '../lib/store'
import { TrackedGrid } from '/@/source/core/Grid'
import { useRef, setRef } from '../utils/share'
import { init3d, } from '../panel/sprite3d/draw3d'


export default defineComponent({
  name: 'App',
  components: {
  },
  setup () {
    const container: Ref<HTMLCanvasElement | null> = ref(null)
    const stepInterval = ref(30)
    let grid: TrackedGrid
    let setGridFunc: (g: TrackedGrid) => void
    const localStore = getStore()

    const startCoor = ref([ 11, 10 ]) as WatchPos
    const endCoor = ref([ 21, 10 ]) as WatchPos
    const mapConfig = {
      startCoor,
      endCoor,
      stepInterval
    } as PartialInitMapConfig
    const mapConfigShowed = omit([ 'stepInterval' ], mapConfig)

    const findPath = ref(async () => [ [ 0 ] ])
    const resetMap = ref(() => { })
    onMounted(() => {
      if (!container.value) throw new Error('can not find canvas element')
      init3d(container.value)
    })


    const startFind = async () => {
      const path = await findPath.value()
      console.log(path)
    }

    const saveGrid = () => {
      const arr = grid.nodes.map((rows) => rows.map(n => n.walkable ? 0 : 1))
      localStore.setItem(GRID, arr)
      localStore.setItem(START_POS, toRaw(useRef(startCoor)))
      localStore.setItem(END_POS, toRaw(useRef(endCoor)))
    }

    const useGrid = async () => {
      const start: Pos = await localStore.getItem(START_POS)
      const end: Pos = await localStore.getItem(END_POS)
      setRef(startCoor, start)
      setRef(endCoor, end)
      const matrix: number[][] = await localStore.getItem(GRID)
      if (matrix && setGridFunc) {
        grid = new TrackedGrid(matrix)
        setGridFunc(grid)
      }
    }


    return {
      container,
      mapConfigShowed,
      startFind,
      resetMap,
      saveGrid,
      useGrid,
      stepInterval,
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
