var fs = require('fs')
fs.writeFileSync("wake.json", '{"wake":'+new Date().getTime()+'}')