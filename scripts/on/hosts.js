#!/usr/bin/env node
'use strict'

var fs = require('fs')
var CMN = require('../common')

/**
 * Clears material from the rdr comment block in the hosts file.
 * @function
 * @param {String} etcHosts
 * @return {String}
 */
function clearRDRblock(etcHosts) {
  if (CMN.REG.HOSTS_BLOCK.test(etcHosts)) {
    etcHosts.replace(CMN.REG.HOSTS_BLOCK, '$1\n$2')
  } else {
    etcHosts += CMN.STRING.BLOCK_OPEN + '\n' + CMN.STRING.BLOCK_CLOSE
  }
  return etcHosts
}


/**
 * Adds lines to the hosts file, inside the rdr comment block.
 * @function
 * @param {String} etcHosts
 * @param {Object} confHosts
 * @return {String}
 */
function addLines(etcHosts, confHosts) {
  var lines = confHosts.map(function (line) {
    return line.dst + '  ' + line.src
  })
  etcHosts = etcHosts.replace(CMN.REG.HOSTS_BLOCK, '$1\n' + lines.join('\n') + '\n$2')
  return etcHosts
}

/**
 * Copies the configured hosts file to /etc/hosts
 * @function
 * @return {}
 */
function hostsOn() {
  var hosts = fs.readFileSync('/etc/hosts', 'utf8')
  var confHosts = CMN.safeJSON(fs.readFileSync(CMN.FILE.HOSTS_DB, 'utf8'), [])
  hosts = clearRDRblock(hosts)
  hosts = addLines(hosts, confHosts)
  fs.writeFileSync('/etc/hosts', hosts)
  return true
}

module.exports = hostsOn
