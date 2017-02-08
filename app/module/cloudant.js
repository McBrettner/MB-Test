'use strict'

let Cloudant = require('cloudant')
let config = require('./../config.js')()

let cloudant = Cloudant({
  account: config.cloudant.username,
  password: config.cloudant.password
})

let database = cloudant.db.use('images')

module.exports = function (req, res) {
  database.attachment.get('images', req.params.filename, function (err, body) {
    if (!err) {
      res.send(body)
    } else {
      console.log('not able to get attachment ' + req.params.filename + ' from database')
    }
  })
}
