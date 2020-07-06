<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import { RouterView } from 'vue-router'

export default defineComponent({
  name: 'App',
  components: {
    RouterView
  },
  setup () {
    onMounted(() => {
      console.log('hello vue3')
    })
  }
})
</script>
<style lang="stylus" scoped></style>
