#!/usr/bin/env node
'use strict'

var fs = require('fs')
var CMN = require('../common')

/**
 * Activates the rules stored in the ANCHORS_DB by adding them to ANCHORS.
 * @function
 * @return {}
 */
function anchorsOn() {
  var anchors = CMN.safeJSON(fs.readFileSync(CMN.FILE.ANCHORS_DB, 'utf8'), [])
  if (anchors.length) {
    fs.writeFileSync(CMN.FILE.ANCHORS, anchors.join('\n') + '\n')
    return true
  } else {
    fs.writeFileSync(CMN.FILE.ANCHORS, '')
  }
}

module.exports = anchorsOn
