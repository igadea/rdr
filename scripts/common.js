#!/usr/bin/env node
'use strict'
var fs = require('fs')
var stdoutBuffer = ''

var BLOCK_OPEN =  '###### <START RDR RULES> ######'
var BLOCK_CLOSE = '###### <END RDR RULES> ########'
var BLOCK_PATTERN = '(' + BLOCK_OPEN + ')[\\s\\S]*?(' + BLOCK_CLOSE + ')'
var HOSTS_BLOCK = new RegExp(BLOCK_PATTERN)

var PREFIX = '/usr/local/lib/node_modules/rdr'
var PFCONF = PREFIX + '/pf.conf'
var BACKUP = process.env.HOME + '/.hosts.bak'
var HOSTS = PREFIX + '/configuration/hosts'
var HOSTS_DB = HOSTS + '.json'
var ANCHORS = '/etc/pf.anchors/rdr'
var ANCHORS_DB = PREFIX + '/configuration/anchors.json'
var HELP_TXT = PREFIX + '/help.txt'
var HELP = '\n' + fs.readFileSync(HELP_TXT, 'utf8') + '\n'
var VERSION = '\n' + '  v' + require(PREFIX + '/package.json').version + '\n\n'

function safeJSON(str, deflt) {
  try {
    return JSON.parse(str)
  } catch(e) {
    if (deflt) return deflt
    return {}
  }
}

function stdout(msg) {
  stdoutBuffer += '  ' + msg + '\n'
  return stdout
}

stdout.blankline = function () {
  stdoutBuffer += '\n'
}

stdout.write = function () {
  if (stdoutBuffer.length) {
    process.stdout.write('\n' + stdoutBuffer + '\n')
    stdoutBuffer = ''
  }
}

function isRoot() {
  if (process.geteuid() === 0) return true
  stdout('Administrator privileges required (try the command again with sudo).')
  return false
}

module.exports = {
  REG: {
    HOSTS_BLOCK: HOSTS_BLOCK
  },
  STRING: {
    VERSION: VERSION,
    BLOCK_OPEN: BLOCK_OPEN,
    BLOCK_CLOSE: BLOCK_CLOSE,
    HELP: HELP
  },
  FILE: {
    PREFIX: PREFIX,
    PFCONF: PFCONF,
    BACKUP: BACKUP,
    HOSTS_DB: HOSTS_DB,
    ANCHORS: ANCHORS,
    ANCHORS_DB: ANCHORS_DB,
    HELP_TXT: HELP_TXT
  },
  safeJSON: safeJSON,
  isRoot: isRoot,
  stdout: stdout
}
