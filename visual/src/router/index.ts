import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import Home from '/src/views/Home.vue'
import Dev from '/src/views/Dev.vue'
import RealMap from '/src/views/Map.vue'
import BaseMap from '/src/views/BaseMap.vue'

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      component: Home,
      name: 'Home'
    },
    {
      path: '/dev',
      component: Dev,
      name: 'Dev'
    },
    {
      path: '/map',
      component: RealMap,
      name: 'RealMap'
    },
    {
      path: '/baseMap',
      component: BaseMap,
      name: 'BaseMap'
    }
  ]
})
