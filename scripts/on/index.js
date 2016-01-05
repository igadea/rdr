#!/usr/bin/env node
'use strict'

var bash = require('child_process').execSync
var CMN = require('../common')
var off = require('../off')
var pfctlStatus = require('../pfctl-status')
var anchorsOn = require('./anchors')
var hostsOn = require('./hosts')

/**
 * Activates the current configuration.
 * @function
 * @return {}
 */
module.exports = function () {
  if (CMN.isRoot()) {
    off()
    var hostsConfigured = hostsOn()
    var portsConfigured = anchorsOn()
    if (hostsConfigured && portsConfigured) {
      if (pfctlStatus.disabled()) {
        bash('pfctl -F all -ef ' + CMN.FILE.PFCONF)
      } else {
        bash('pfctl -F all -f ' + CMN.FILE.PFCONF)
      }
    } else if (!hostsConfigured && !portsConfigured) {
      CMN.stdout('No forwarding rules have been setup.')
    } else {
      process.stderr.write('\n  Configuration error.\n\n')
    }
  }
}
