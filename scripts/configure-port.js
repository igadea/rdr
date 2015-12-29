#!/usr/bin/env node
'use strict'

var bash = require('child_process').execSync
var fs = require('fs')
var DIR = '/usr/local/lib/node_modules/rdr'

module.exports = function (srcIp, rule) {

  var anchorFile
    , rule

  rule = (
    'rdr pass inet proto tcp from any to ' + srcIp + ' port ' + rule.srcPort +
    ' -> ' + rule.destHost + ' port ' + rule.destPort
  )
  try {
    anchorFile = JSON.parse(
      fs.readFileSync(
        DIR + '/configuration/anchors.json', 'utf8'
      ) || '[]'
    )
  } catch(err) {
    process.stderr.write(err.stack)
    process.exit(1)
  }
  if (anchorFile.indexOf(rule) === -1) {
    anchorFile.push(rule)
    fs.writeFileSync(
      DIR + '/configuration/anchors.json',
      JSON.stringify(anchorFile, null, '  ')
    )
  }
}
