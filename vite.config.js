const path = require('path')
const p = path.resolve(__dirname, './source')
module.exports = {
  root: path.resolve('./visual'),
  alias: {
    '/@PathFinding/': p,
    '/@/': __dirname,
    '/src/': path.resolve(__dirname, '/visual/src'),
    'spritejs': 'spritejs/dist/spritejs.esm.js'
  }
}
