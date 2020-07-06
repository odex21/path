export const pics = {

  tile_bigforce: import('/src/assets/cube/pic/tile_bigforce.png'),

  tile_deepwater: import('/src/assets/cube/pic/tile_deepwater.png'),

  tile_defbreak: import('/src/assets/cube/pic/tile_defbreak.png'),

  tile_defup: import('/src/assets/cube/pic/tile_defup.png'),

  tile_defup_h: import('/src/assets/cube/pic/tile_defup_h.png'),

  tile_end: import('/src/assets/cube/pic/tile_end.png'),

  tile_fence: import('/src/assets/cube/pic/tile_fence.png'),

  tile_floor: import('/src/assets/cube/pic/tile_floor.png'),

  tile_flystart: import('/src/assets/cube/pic/tile_flystart.png'),

  tile_forbidden: import('/src/assets/cube/pic/tile_forbidden.png'),

  tile_gazebo: import('/src/assets/cube/pic/tile_gazebo.png'),

  tile_grass: import('/src/assets/cube/pic/tile_grass.png'),

  tile_healing: import('/src/assets/cube/pic/tile_healing.png'),

  tile_hole: import('/src/assets/cube/pic/tile_hole.png'),

  tile_infection: import('/src/assets/cube/pic/tile_infection.png'),

  tile_rcm_crate: import('/src/assets/cube/pic/tile_rcm_crate.png'),

  tile_rcm_operator: import('/src/assets/cube/pic/tile_rcm_operator.png'),

  tile_road: import('/src/assets/cube/pic/tile_road.png'),

  tile_shallowwater: import('/src/assets/cube/pic/tile_shallowwater.png'),

  tile_start: import('/src/assets/cube/pic/tile_start.png'),

  tile_telin: import('/src/assets/cube/pic/tile_telin.png'),

  tile_telout: import('/src/assets/cube/pic/tile_telout.png'),

  tile_volcano: import('/src/assets/cube/pic/tile_volcano.png'),

  tile_volspread: import('/src/assets/cube/pic/tile_volspread.png'),

  tile_wall: import('/src/assets/cube/pic/tile_wall.png'),

  震撼装置: import('/src/assets/cube/pic/震撼装置.png'),

}

export const loadPic = async () => {
  // const tasks = (pics).map(async ([ key, path ]) => {
  //   const res = await import(path)
  //   return {
  //     key,
  //     path: res.default
  //   }
  // })
  // return Promise.all(tasks)
}

export type tileKeys = keyof typeof pics
