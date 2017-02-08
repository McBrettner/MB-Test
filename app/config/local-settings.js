'use strict'
/*
 * Parse VCAP_SERVICES and process enviroment variables from Blumix variable
 * dump obtained by `cf env <APLICATION_NAME> ./app/config/app_env`
 */

let winston = require('winston')
let fs = require('fs')

let BLUEMIX_EOL = '\n'

let VCAP_SERVICES
try {
  // Parse segment delimiled by empty line
  let segments = fs.readFileSync('./app/config/app_env').toString()
    .split(BLUEMIX_EOL + BLUEMIX_EOL)

  // Parse VCAP_SERVICES from Bluemix variable dump
  let servicesSegment = segments
      .filter(x => { return x.includes('System-Provided:') })[0]
      .replace(new RegExp(BLUEMIX_EOL, 'g'), '')
      .replace('System-Provided:', '')
  VCAP_SERVICES = JSON.parse(servicesSegment).VCAP_SERVICES

    // Parse user defined variables from Bluemix variable dump
  let uservars = segments
      .filter(x => { return x.includes('User-Provided:') })[0]
      .replace('User-Provided:', '')
      .split(BLUEMIX_EOL)
      .filter(x => { return x /* filter empty strings */ })
  uservars.forEach(x => {
    let tokens = x.split(':')
    let varName = tokens[0].trim()
    let varValue = tokens[1].trim()

    if (process.env[varName] === undefined) {
      process.env[varName] = varValue
    } else {
      throw new Error('There is already used process var in bluemix vars export.')
    }
  })
} catch (e) {
  winston.error('Failed loading enviroment variable from Bluemix export. Did you run `cf env <APLICATION_NAME> > ./app/config/app_env`? See Readme.MD for more information' + e)
  throw e
}

if (VCAP_SERVICES.speech_to_text === undefined) {
  VCAP_SERVICES.speech_to_text = [{}]
  winston.warn('There is no sst service in Bluemix variables dump.')
}

if (VCAP_SERVICES.text_to_speech === undefined) {
  VCAP_SERVICES.text_to_speech = [{}]
  winston.warn('There is no tss service in Bluemix variables dump.')
}

let appEnv = {
  services: VCAP_SERVICES
}

module.exports = {
  server: {
    port: 8080
  },
  conversation: {
    url: process.env.CONVERSATION_URL,
    password: process.env.CONVERSATION_PASSWORD,
    username: process.env.CONVERSATION_USERNAME,
    workspace_id: process.env.WORKSPACE_ID
  },
  stt: VCAP_SERVICES.speech_to_text[0].credentials,
  tts: VCAP_SERVICES.text_to_speech[0].credentials,
  confidenceRate: process.env.CONFIDENCE_RATE,
  cloudantData: {
    url: process.env.CLOUDANT_DATA_URL || appEnv.services.cloudantNoSQLDB[0].credentials.url,
    db: process.env.CLOUDANT_DATA_DB_NAME,
    key: process.env.CLOUDANT_DATA_SEARCH_KEY,
    headers: {
      Authorization: 'Basic ' + new Buffer(
        (process.env.CLOUDANT_DATA_USERNAME || appEnv.services.cloudantNoSQLDB[0].credentials.username) + ':' +
        (process.env.CLOUDANT_DATA_PASSWORD || appEnv.services.cloudantNoSQLDB[0].credentials.password)
      ).toString('base64')
    }
  },
  cloudant: {
    username: appEnv.services.cloudantNoSQLDB[0].credentials.username,
    password: appEnv.services.cloudantNoSQLDB[0].credentials.password
  }
}
