#!/usr/bin/env node
'use strict'

var fs = require('fs')
var CMN = require('../common')

/**
 * Parses the existing hosts file into an object array.
 * @function
 * @param {String} file
 * @return {Array}
 */
function parseHosts(file) {
  return file.split('\n').map(function (line) {
    return line.replace(/^(.*?)#.*?$/m, '$1')
  }).filter(function (line) {
    return !!line
  }).map(function (line) {
    line = line.replace(/\s/, '@@@').split('@@@')
    var src = line[1].split(/\s+/g).filter(function (dstStr) {
      return !!dstStr
    })
    return {
      src: src,
      dst: line[0]
    }
  })
}


/**
 * Searches the existing hosts file to determine what IP to use to forward
 * traffic.
 * @function
 * @param {Array} hosts
 * @return {}
 */
function findIp(hosts) {

  var ip
    , finalOctet

  do {
    if (!finalOctet) finalOctet = 2
    ip = '127.0.0.' + finalOctet++
  } while (hosts.some(function (line) {
    return line.dst === ip
  }))
  return ip
}


/**
 * Returns an IP is there is already a fwd for it; null otherwise.
 * @function
 * @param {Array} hosts
 * @param {String} host
 * @return {String|Null}
 */
function getExistingFwdIp(hosts, host) {
  var ip = null
  hosts.forEach(function (entry) {
    if (entry.src.indexOf(host) !== -1) {
      ip = entry.dst
    }
  })
  return ip
}

/**
 * Adds a line to /etc/hosts for a given domain, smartly determining which IP to
 * use, to avoid collisions.
 * @function
 * @param {String} host - a hostname
 * @return {String} - an IP address
 */
module.exports = function (host) {

  var confHosts   // {Array}
    , etcHosts    // {String}
    , _etcHosts   // {Array}
    , ip

  etcHosts = fs.readFileSync('/etc/hosts', 'utf8').replace(CMN.REG.HOSTS_BLOCK, '')
  _etcHosts = parseHosts(etcHosts)
  confHosts = CMN.safeJSON(fs.readFileSync(CMN.FILE.HOSTS_DB, 'utf8'), [])
  ip = getExistingFwdIp(_etcHosts, host)
  if (!ip) ip = getExistingFwdIp(confHosts, host)
  if (ip) return ip
  ip = findIp(confHosts)
  confHosts.push({dst:ip, src:[host]})
  fs.writeFileSync(CMN.FILE.HOSTS_DB, JSON.stringify(confHosts))
  return ip
}
