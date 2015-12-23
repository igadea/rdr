#!/usr/bin/env node
'use strict'

var fs = require('fs')
var bash = require('child_process').execSync
var spaces = require('./spaces')
var pfctlStatus = require('./pfctl-status')

var COMMENT = ''+
  '##\n'+
  '# Host Database\n'+
  '#\n'+
  '# localhost is used to configure the loopback interface\n'+
  '# when the system is booting.  Do not change this entry.\n'+
  '#\n'+
  '# rdr: This file is being managed by rdr. You can still edit it,\n'+
  '# but don\'t remove this comment. To reset it, use "rdr reset".\n'+
  '##\n'

/**
 *
 * @function
 * @return {}
 */
function activateHosts() {
  var hosts = JSON.parse(
    fs.readFileSync('/usr/local/lib/rdr/configuration/hosts.json', 'utf8') || '[]'
  )
  if (hosts.length) {
    hosts = COMMENT + hosts.map(function (line) {
      return line.dst + spaces(20 - line.dst.length) + line.src
    }).join('\n')
    fs.writeFileSync('/etc/hosts', hosts)
  } else {
    process.stdout.write('\n  No hosts configured.\n')
  }
}

/**
 *
 * @function
 * @param {}
 * @return {}
 */
function addPfConfRule(rule) {
  var ANCHOR = '/etc/pf.anchors/rdr'
  var rules = fs.readFileSync(ANCHOR, 'utf8')
  if (rules.indexOf(rule) === -1) {
    rules += rule + '\n'
    // process.stdout.write(rules)
    fs.writeFileSync(ANCHOR, rules)
  }
}

/**
 *
 * @function
 * @return {}
 */
function activateAnchors() {
  var anchors = JSON.parse(
    fs.readFileSync('/usr/local/lib/rdr/configuration/anchors.json', 'utf8') || '[]'
  )
  if (anchors.length) {
    anchors.forEach(function (rule) {
      addPfConfRule(rule)
    })
  } else {
    process.stdout.write('\n  No ports configured.\n\n')
  }
}

module.exports = function () {
  activateHosts()
  activateAnchors()
  if (pfctlStatus.enabled()) {
    bash('sudo pfctl -f /usr/local/lib/rdr/pf.conf &>/dev/null')
  } else {
    bash('sudo pfctl -ef /usr/local/lib/rdr/pf.conf &>/dev/null')
  }
  process.stdout.write(
    '\n  rdr active\n\n'
  )
}
