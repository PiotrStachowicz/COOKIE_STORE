let server = require('../app.js')
let https = require('https')
var fs = require('fs')
let port = 1024


async function start_server(){
    var pfx = await fs.promises.readFile('./server/certificate.pfx')
    https.createServer(
        {
            pfx: pfx,
            passphrase: 'zadanie2'
        },
        server
    ).listen(port);
}


start_server()
console.log(`server live on https://localhost:${port}`)