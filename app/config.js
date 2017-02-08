'use strict'
const cfenv = require('cfenv')

module.exports = function () {
  if (cfenv.getAppEnv().isLocal) {
    return require('./config/local-settings.js')
  } else {
    return require('./config/server-settings.js')
  }
}
