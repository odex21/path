const path = require('path')
const p = path.resolve(__dirname, './source')
module.exports = {
  root: path.resolve('./visual'),
  alias: {
    '/@PathFinding/': p,
    '/@/': __dirname,
    'spritejs': 'spritejs/dist/spritejs.esm.js'
  }
}
