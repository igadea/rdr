#!/usr/bin/env node
'use strict'

var fs = require('fs')
var CMN = require('../common')
var parseRule = require('../parse-rule')
var backup = require('../backup')
var configureHost = require('./configure-host')
var configurePort = require('./configure-port')
var reset = require('./reset')

/**
 * Adds a line to both HOSTS_DB and ANCHORS_DB (and that is all).
 * @function
 * @param {String} $1
 * @param {String} $3
 * @return {}
 */
function addRule($1, $3) {
  if (CMN.isRoot()) {
    var rule = parseRule($1, $3)
    var mappedIp = configureHost(rule.srcHost)
    configurePort(mappedIp, rule)
  }
}

/**
 * Clobbers existing configuration with a new one (either passed directly or
 * from ./.rdr config file).
 * @function
 * @param {Array|}
 * @return {}
 */
function configure(rules) {
  var conf
  if (CMN.isRoot()) {
    backup()
    reset()
    if (rules && Array.isArray(rules)) {
      conf = rules
    } else {
      try {
        conf = fs.readFileSync('./.rdr', 'utf8')
          .split('\n')
          .filter(function (line) {
            return line.length && !/^\s*#/.test(line)
          })
      } catch (err) {
        process.stderr.write(err.stack)
        process.exit(1)
      }
    }
    conf.forEach(function (rule) {
      rule = rule.split(/\s+to\s+/)
      addRule(rule[0], rule[1])
    })
  }
}

module.exports = configure
