const path = require( 'path' )
const p = path.resolve( __dirname, './source' )
module.exports = {
  alias: {
    'PathFinding': p,
    'spritejs': 'spritejs/dist/spritejs.esm.js'
  }
}
