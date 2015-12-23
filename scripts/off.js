#!/usr/bin/env node
'use strict'

var bash = require('child_process').execSync
var pfctlStatus = require('./pfctl-status')

module.exports = function () {
  if (pfctlStatus.enabled()) {
    // pfctl really sucks; this is the only way to get this work.
    bash('sudo pfctl -d &>/dev/null')
    bash('sudo pfctl -f /etc/pf.conf &>/dev/null')
  }
  bash('sudo cp /usr/local/lib/rdr/backup/hosts /etc/hosts')
  process.stdout.write('\n  rdr inactive\n\n')
}
