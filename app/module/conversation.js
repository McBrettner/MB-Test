'use strict'

let config = require('./../config.js')()
let ConversationV1 = require('watson-developer-cloud/conversation/v1')
// let rnrSearch = require('./rnrSearch.js')
let getFromDB = require('./cloudantView.js')

let conversation = new ConversationV1({
  username: config.conversation.username,
  password: config.conversation.password,
  version_date: '2016-07-01'
})

let messageParser = (response) => {
  return {
    type: 'plain/text',
    data: response.output.text,
    context: response.context
  }
}

function getMonthlyBill (month) {
  let months = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember']
  let result

  if (month.toLowerCase() === 'previous month' || month.toLowerCase() === 'last month') {
    let indexOfMonth = (new Date()).getMonth() - 1
    result = indexOfMonth >= 0 ? months[indexOfMonth] : months[months.length + indexOfMonth]
  } else if (month.toLowerCase() === 'this month') {
    let indexOfMonth = (new Date()).getMonth()
    result = months[indexOfMonth]
  } else if (month.toLowerCase() === 'january') {
    result = months[0]
  } else if (month.toLowerCase() === 'february') {
    result = months[1]
  } else if (month.toLowerCase() === 'march') {
    result = months[2]
  } else if (month.toLowerCase() === 'april') {
    result = months[3]
  } else if (month.toLowerCase() === 'may') {
    result = months[4]
  } else if (month.toLowerCase() === 'june') {
    result = months[5]
  } else if (month.toLowerCase() === 'july') {
    result = months[6]
  } else if (month.toLowerCase() === 'august') {
    result = months[7]
  } else if (month.toLowerCase() === 'september') {
    result = months[8]
  } else if (month.toLowerCase() === 'october') {
    result = months[9]
  } else if (month.toLowerCase() === 'november') {
    result = months[10]
  } else if (month.toLowerCase() === 'december') {
    result = months[11]
  }

  return 'Rechnung ' + result
}

module.exports = function (req, res) {
  let body = JSON.parse(req.body)

  conversation.message({
    input: { text: body.data[0] },
    context: body.context,
    workspace_id: config.conversation.workspace_id
  }, function (err, response) {
    if (err) {
      console.error(err)
    } else {
      /* console.log('January: ' + getMonthlyBill('January'))
      console.log('February: ' + getMonthlyBill('FEBRUARY'))
      console.log('March: ' + getMonthlyBill('march'))
      console.log('April: ' + getMonthlyBill('apriL'))
      console.log('May: ' + getMonthlyBill('may'))
      console.log('June: ' + getMonthlyBill('June'))
      console.log('July: ' + getMonthlyBill('jUlY'))
      console.log('August: ' + getMonthlyBill('august'))
      console.log('September: ' + getMonthlyBill('September'))
      console.log('October: ' + getMonthlyBill('October'))
      console.log('November: ' + getMonthlyBill('November'))
      console.log('December: ' + getMonthlyBill('December'))
      console.log('This month: ' + getMonthlyBill('This Month'))
      console.log('Last month: ' + getMonthlyBill('last month'))
      console.log('Previous month: ' + getMonthlyBill('Previous month'))
      */
      // if (response.intents.length === 0 || response.intents[0].confidence > config.confidenceRate) {
      let match = null
      let myRegexp = /<js-query>([\S\s]*)<\/js-query>/
      for (let responseIndex = 0; responseIndex < response.output.text.length; ++responseIndex) {
        match = myRegexp.exec(response.output.text[responseIndex])
        if (match) {
          let jscript = match[1]
          let jsQueryResponse
          jscript = jscript.replace(/\n/g, ' ')
          eval(jscript)
          response.output.text[responseIndex] = response.output.text[responseIndex].replace(myRegexp, jsQueryResponse)
        }
      }

      res.send(messageParser(response))
      // } else {
      //  rnrSearch(body.data[0], res, response.context)
      // }

      console.log('====================')
    }
  })
}
