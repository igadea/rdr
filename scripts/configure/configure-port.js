#!/usr/bin/env node
'use strict'

var fs = require('fs')
var CMN = require('../common')

module.exports = function (srcIp, rule) {
  rule = (
    'rdr pass inet proto tcp from any to ' + srcIp + ' port ' + rule.srcPort +
    ' -> ' + rule.destHost + ' port ' + rule.destPort
  )
  var anchors = CMN.safeJSON(fs.readFileSync(CMN.FILE.ANCHORS_DB, 'utf8'), [])
  if (anchors.indexOf(rule) === -1) {
    anchors.push(rule)
    fs.writeFileSync(CMN.FILE.ANCHORS_DB, JSON.stringify(anchors, null, '  '))
  }
}
