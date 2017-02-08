'use strict'

let config = require('./../config.js')()
let syncRequest = require('sync-request')

function getFromDB (table, property) {
  let result = null

  let url = config.cloudantData.url + config.cloudantData.db + '/_design/' +
      table + '/_view/' + property + '?key=' + '"' + config.cloudantData.key + '"'
  let headers = config.cloudantData.headers

  let res = syncRequest(
    'GET',
    url,
    {
      headers: headers
    }
  )

  result = JSON.parse(res.getBody())

  return result.rows
}

module.exports = getFromDB
