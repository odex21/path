<template>
  <div class="base-map-panel">
    <div id="base-map" ref="mapContainer"></div>
    <div class="map-controller">
      <selection
        v-model:selectedId="selectedRouteIndex"
        msg="hello inject"
        @change="testChange"
      >
        <selection-item
          v-for="(route, index) in routes"
          :key="index"
          :value="index"
        >
          {{ index }}
        </selection-item>
      </selection>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, Ref, ref, onMounted, watchEffect } from 'vue'
import { convertMapData, Route } from '../panel/convert'
import { default as mapdata } from '/src/assets/map/raw/level_main_07-08.json'
import { initSprite, DrawPath, RemovePath } from '../panel/baseMap/draw'
import { useRef } from '../utils/share'
import { findPath } from '../panel/findPath'
import { sleep } from '../panel/utils'
import SelectionItem from '/src/components/Selection/SelectionItem.vue'
import Selection from '/src/components/Selection/Selection.vue'
import { Path } from '/@/source'

export default defineComponent({
  components: {
    Selection,
    SelectionItem,
  },
  setup () {
    const mapContainer: Ref<null | Element> = ref(null)
    const { mapCubes, grid, finder, routes } = convertMapData(mapdata)
    const selectedRouteIndex = ref(0)
    let drawPath: DrawPath
    let removePath: RemovePath
    let curRoute: Route | undefined
    let curPath: Path | undefined

    onMounted(async () => {
      const w = mapContainer.value?.clientWidth || 0
      const { drawPath: dp, init, scene, removePath: rp } = await initSprite(useRef(mapContainer), {
        mapCubes,
        nodeSize: w / mapCubes[ 0 ].length,
        mapGrid: grid,
      })
      drawPath = dp
      removePath = rp
    })



    const renderRoute = (index: number) => {
      if (!drawPath) return
      if (curPath) removePath(curPath)

      console.log('begin render route ', index)
      curRoute = routes[ index ] as Route | undefined
      if (!curRoute) throw new Error('no this route')
      curPath = findPath(curRoute, grid, finder)
      drawPath(curPath)
    }

    watchEffect(() => {
      renderRoute(useRef(selectedRouteIndex))
    })

    const testChange = (value: number) => {
      console.log('test change ', value, selectedRouteIndex.value)
    }


    return {
      mapContainer,
      routes,
      selectedRouteIndex,
      testChange
    }
  }
})
</script>
<style lang="stylus" scoped>
.base-map-panel {
  width: 100vw
  height: 100vh
  display: grid
  grid-template-columns: 1fr 300px
  grid-column: 1
}

#base-map {
  grid-column: 1 / 2
}
</style>
