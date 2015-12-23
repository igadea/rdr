#!/usr/bin/env node
'use strict'

var bash = require('child_process').execSync

function enabled () {
  var output = bash('sudo pfctl -s info')
  return /Status:\sEnabled/.test(output)
}

function disabled () {
  return !enabled()
}

module.exports = {
  enabled: enabled,
  disabled: disabled
}
