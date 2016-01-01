#!/usr/bin/env node
'use strict'

var fs = require('fs')
var bash = require('child_process').execSync
var pfctlStatus = require('./pfctl-status')
var CMN = require('./common')

/**
 * Copies the configured hosts file to /etc/hosts
 * @function
 * @return {}
 */
function activateHosts() {
  var hosts = fs.readFileSync(CMN.FILE.HOSTS, 'utf8')
  var confHosts = fs.readFileSync(CMN.FILE.HOSTS_DB, 'utf8')
  if (confHosts.length && hosts.length) {
    fs.writeFileSync('/etc/hosts', hosts)
    return true
  }
}


/**
 * Adds a single port forwarding rule to ANCHORS.
 * @function
 * @param {}
 * @return {}
 */
function addPfConfRule(rule) {
  var rules = fs.readFileSync(CMN.FILE.ANCHORS, 'utf8')
  if (rules.indexOf(rule) === -1) {
    rules += rule + '\n'
    fs.writeFileSync(CMN.FILE.ANCHORS, rules)
  }
}


/**
 * Activates the rules stored in the ANCHORS_DB.
 * @function
 * @return {}
 */
function activateAnchors() {
  var anchors = CMN.safeJSON(fs.readFileSync(CMN.FILE.ANCHORS_DB, 'utf8'), [])
  if (anchors.length) {
    anchors.forEach(function (rule) {
      addPfConfRule(rule)
    })
    return true
  }
}


module.exports = function () {
  if (CMN.isRoot()) {
    var hostsConfigured = activateHosts()
    var portsConfigured = activateAnchors()
    if (hostsConfigured && portsConfigured) {
      if (pfctlStatus.enabled()) {
        bash('sudo pfctl -f ' + CMN.FILE.PFCONF + ' &>/dev/null')
      } else {
        bash('sudo pfctl -ef ' + CMN.FILE.PFCONF + ' &>/dev/null')
      }
    } else if (!hostsConfigured && !portsConfigured) {
      CMN.stdout('No forwarding rules have been setup.')
    } else {
      process.stderr.write('\n  Configuration error.\n\n')
    }
  }
}
