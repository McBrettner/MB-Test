const express = require('express')
var router = require('./router.js')
var bodyParser = require('body-parser')
const app = express()

app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.text())
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.use('/api', router)

app.use(express.static('public'))

module.exports = app
