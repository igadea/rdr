#!/usr/bin/env node
'use strict'

var fs = require('fs')
var bash = require('child_process').exec
var CMN = require('./common')

/**
 * Removes the rdr comment block from HOSTS.
 * @function
 * @return {}
 */
function removeRDRblock() {
  var hosts = fs.readFileSync(CMN.FILE.HOSTS, 'utf8') || ''
  if (CMN.REG.HOSTS_BLOCK.test(hosts)) {
    hosts = hosts.replace(CMN.REG.HOSTS_BLOCK, '')
    fs.writeFileSync(CMN.FILE.HOSTS, hosts)
  }
  if (hosts.length) {
    fs.writeFileSync('/etc/hosts', hosts)
  }
}

module.exports = function () {
  if (CMN.isRoot()) {
    var cmd = bash('pfctl -F all -f /etc/pf.conf')
    cmd.on('exit', function () {
      removeRDRblock()
    })
  }
}
