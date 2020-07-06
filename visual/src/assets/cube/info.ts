export interface TileInfo {
  name: string
  description: string
  rewrite?: string
}

export interface TileInfoMap {
  [ index: string ]: TileInfo
}

export const tileInfoMap: TileInfoMap = {
  tile_bigforce: {
    name: '特种战术点',
    description: '置于其中的我方单位在推动或拉动敌方单位时力度增大',
  },
  tile_def: {
    name: '防御符文',
    description: '置于其中的干员获得额外的防御力',
    rewrite: 'tile_defup'
  },
  tile_defup: {
    name: "防御符文",
    description: "置于其中的干员获得额外的防御力",
  },
  tile_fence: {
    name: '围栏',
    description: '可放置近战单位，不可以通行',
  },
  tile_healing: {
    name: '医疗符文',
    description: '置于其中的干员会持续恢复生命',
  },

  tile_rcm_crate: {
    name: '推荐障碍放置点',
    description: 'PRTS推荐的障碍物放置点',
  },
  tile_rcm_operator: {
    name: '推荐干员放置点',
    description: 'PRTS推荐的战术放置点',
  },
  tile_shallowwater: {
    name: '浅水区',
    description: '代表岸边的水地形',
  },

  tile_corrosion: {
    name: '腐蚀地面',
    description: '置于其中的干员防御力减半',
    rewrite: 'tile_corrosion'
  },
  tile_deepwater: {
    name: '深水区',
    description: '代表离岸较远的水地形',
  },

  tile_end: {
    name: '保护目标',
    description: '蓝色目标点，敌方进入后会减少此目标点的耐久',
  },

  tile_floor: {
    name: '不可放置位',
    description: '不可放置单位，可以通行',
  },
  tile_flystart: {
    name: '空袭侵入点',
    description: '敌方飞行单位会从此处进入战场',
  },
  tile_forbidden: {
    name: '禁入区',
    description: '不可放置单位，不可通行',
  },
  tile_gazebo: {
    name: '防空符文',
    description: '置于其中的干员攻击速度略微下降，但在攻击空中单位时攻击力大幅度提升',
  },
  tile_grass: {
    name: '草丛',
    description: '置于其中的干员不会成为敌军远程攻击的目标',
  },

  tile_hole: {
    name: '地穴',
    description: '危险的凹陷地形或地面破洞，经过的敌人会摔落至底部直接死亡',
  },
  tile_infection: {
    name: '活性源石',
    description: '部署的友军和经过的敌军获得攻击力和攻击速度提升的效果，但会持续失去生命',
  },

  tile_road: {
    name: '平地',
    description: '可以放置近战单位，可以通行',
  },

  tile_start: {
    name: '侵入点',
    description: '敌方会从此进入战场',
  },
  tile_telin: {
    name: '通道入口',
    description: '敌方会从此进入通道，从通道出口出现',
  },
  tile_telout: {
    name: '通道出口',
    description: '进入通道的敌方单位会从此处再度出现',
  },
  tile_volcano: {
    name: '热泵通道',
    description: '每隔一段时间便会喷出高温气体，对其上的任何单位造成无视防御和法抗的伤害',
  },
  tile_volspread: {
    name: '岩浆喷射处',
    description: '每隔一段时间会喷出岩浆，对周围8格内的我方单位造成大量伤害且可以融化障碍物',
  },
  tile_wall: {
    name: '高台',
    description: '可以放置远程单位，不可通行',
  },
  tile_defbreak: {
    name: "腐蚀地面",
    description: "置于其中的干员防御力减半",
  }
}
