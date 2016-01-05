#!/usr/bin/env node
'use strict'

var bash = require('child_process').execSync
var CMN = require('./common')

module.exports = function () {
  bash('sudo killall -HUP mDNSResponder')
  CMN.stdout('Chrome users:')
  CMN.stdout(' * chrome://net-internals/#dns and click "Clear hosts cache".')
  CMN.stdout(' * chrome://net-internals/#sockets and click "Flush socket pools".')
}
