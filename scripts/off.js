#!/usr/bin/env node
'use strict'

var bash = require('child_process').execSync
var pfctlStatus = require('./pfctl-status')
var DIR = '/usr/local/lib/node_modules/rdr'

module.exports = function () {
  if (pfctlStatus.enabled()) {
    // pfctl really sucks; this is the only way to get this work.
    bash('sudo pfctl -d &>/dev/null')
    bash('sudo pfctl -f /etc/pf.conf &>/dev/null')
  }
  bash('sudo cp ' + DIR + '/backup/hosts /etc/hosts')
  process.stdout.write('\n  rdr inactive\n\n')
}
