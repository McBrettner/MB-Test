'use strict'

var cfenv = require('cfenv')
var vcapServices = JSON.parse(process.env.VCAP_SERVICES)
var appEnv = cfenv.getAppEnv()

// console.log(appEnv.services.conversation[0].credentials.password)
console.log(process.env.WORKSPACE_ID)

let settings = {
  server: {
    port: appEnv.port
  },
  conversation: {
    url: process.env.CONVERSATION_URL,
    password: process.env.CONVERSATION_PASSWORD,
    username: process.env.CONVERSATION_USERNAME,
    workspace_id: process.env.WORKSPACE_ID
  },
  confidenceRate: process.env.CONFIDENCE_RATE,
  cloudantData: {
    url: process.env.CLOUDANT_DATA_URL || appEnv.services.cloudantNoSQLDB[0].credentials.url,
    db: process.env.CLOUDANT_DATA_DB_NAME,
    key: process.env.CLOUDANT_DATA_SEARCH_KEY,
    headers: {
      Authorization: 'Basic ' + new Buffer(
        process.env.CLOUDANT_DATA_USERNAME || appEnv.services.cloudantNoSQLDB[0].credentials.username + ':' +
        process.env.CLOUDANT_DATA_PASSWORD || appEnv.services.cloudantNoSQLDB[0].credentials.password
      ).toString('base64')
    }
  },
  cloudant: {
    username: appEnv.services.cloudantNoSQLDB[0].credentials.username,
    password: appEnv.services.cloudantNoSQLDB[0].credentials.password
  }
}

if (appEnv.services.speech_to_text) {
  settings.stt = vcapServices.speech_to_text[0].credentials
}
if (appEnv.services.text_to_speech) {
  settings.tts = vcapServices.text_to_speech[0].credentials
}

module.exports = settings
