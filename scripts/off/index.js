#!/usr/bin/env node
'use strict'

var fs = require('fs')
var bash = require('child_process').execSync
var pfctlStatus = require('../pfctl-status')
var dumpCache = require('../dump-cache')
var CMN = require('../common')

/**
 * Removes the rdr comment block from HOSTS.
 * @function
 * @return {}
 */
function removeRDRblock() {
  var hosts = fs.readFileSync('/etc/hosts', 'utf8') || ''
  if (CMN.REG.HOSTS_BLOCK.test(hosts)) {
    hosts = hosts.replace(CMN.REG.HOSTS_BLOCK, '')
    fs.writeFileSync('/etc/hosts', hosts)
  }
}

/**
 * Deactivates the current configuration.
 * @function
 * @return {}
 */
module.exports = function () {
  if (CMN.isRoot()) {
    if (pfctlStatus.enabled()) bash('pfctl -F all -f /etc/pf.conf')
    removeRDRblock()
    dumpCache()
  }
}
