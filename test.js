const path = require('path')
const fs = require('fs')
const arr = fs.readdirSync(path.resolve(__dirname, './visual/src/assets/cube/pic'))
let str = arr.map(el => [ el.replace('.png', ''), `import('/src/assets/cube/pic/${el}')` ])
  .reduce((res, [ key, imp ]) => {
    res += `
      ${key}:  ${imp},
    `
    return res
  }, `const pics = {
    `)
str += `
  }`

console.log(str)



