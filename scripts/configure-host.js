#!/usr/bin/env node
'use strict'

var bash = require('child_process').execSync
var fs = require('fs')
var spaces = require('./spaces')
var HOSTS_JSON = '/usr/local/lib/rdr/configuration/hosts.json'

/**
 * Parses the existing hosts file into an object array.
 * @function
 * @param {String} file
 * @return {Array}
 */
function parseHosts(file) {
  var parsed = {}
  return file.split('\n').filter(function (line) {
    return line && !/^\s*#/.test(line)
  }).map(function (line) {
    line = line.split(/\s+/)
    return {
      src: line[1],
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
function findIp(hosts, src) {

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

function getExistingFwdIp(hosts, host) {
  var ip = null
  hosts.forEach(function (entry) {
    if (entry.src.replace(/\s/g, '') === host) {
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

  var write
    , hosts
    , newline

  // Safely retrieve or create hosts.json.
  hosts = fs.readFileSync(HOSTS_JSON, 'utf8')
  if (!hosts.length) {
    hosts = parseHosts(fs.readFileSync('/etc/hosts', 'utf8'))
  } else {
    hosts = JSON.parse(hosts)
  }

  var ip = getExistingFwdIp(hosts, host)
  if (ip) return ip

  // Create the new entry and insert it.
  newline = {
    src: host + spaces(20-host.length),
    dst: findIp(hosts, host)
  }
  hosts.splice(1, 0, newline)
  fs.writeFileSync(HOSTS_JSON, JSON.stringify(hosts, null, '  '))
  return newline.dst
}
