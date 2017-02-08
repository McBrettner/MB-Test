'use strict'

let express = require('express')
let router = express.Router()
let conversation = require('./module/conversation.js')
let cloudant = require('./module/cloudant')

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now())
  next()
})

router.post('/converse', conversation)
router.get('/help', function (req, res) {
  res.sendfile('./app/help.json')
})

router.get('/attachments/:filename', cloudant)

module.exports = router
