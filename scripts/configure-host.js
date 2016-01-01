#!/usr/bin/env node
'use strict'

var fs = require('fs')
var CMN = require('./common')

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
  return etcHosts.replace(CMN.REG.HOSTS_BLOCK, '$1\n' + lines.join('\n') + '\n$2')
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

  etcHosts = fs.readFileSync(CMN.FILE.HOSTS, 'utf8')
  if (!etcHosts) etcHosts = fs.readFileSync('/etc/hosts', 'utf8')
  confHosts = JSON.parse((fs.readFileSync(CMN.FILE.HOSTS_DB, 'utf8') || '[]'))
  _etcHosts = parseHosts(etcHosts)
  ip = getExistingFwdIp(_etcHosts, host)
  if (!ip) ip = getExistingFwdIp(confHosts, host)
  if (ip) return ip
  ip = findIp(confHosts)

  // Update HOSTS_DB
  confHosts.push({dst:ip, src:[host]})
  fs.writeFileSync(CMN.FILE.HOSTS_DB, JSON.stringify(confHosts))

  // Update HOSTS
  etcHosts = clearRDRblock(etcHosts)
  etcHosts = addLines(etcHosts, confHosts)
  fs.writeFileSync(CMN.FILE.HOSTS, etcHosts)
  return ip
}
