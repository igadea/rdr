#!/usr/bin/env node
'use strict'

var fs = require('fs')
var CMN = require('../common')

/**
 * Empties configuration files.
 * @function
 * @return {}
 */
module.exports = function reset() {
  if (CMN.isRoot()) {
    fs.writeFileSync(CMN.FILE.ANCHORS, '')
    fs.writeFileSync(CMN.FILE.ANCHORS_DB, '[]')
    fs.writeFileSync(CMN.FILE.HOSTS_DB, '[]')
  }
}
