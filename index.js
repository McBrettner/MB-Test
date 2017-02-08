'use strict'

let server = require('./app/server.js')
let config = require('./app/config.js')()

server.listen(config.server.port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${config.server.port}`)
})

