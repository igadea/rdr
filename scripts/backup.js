#!/usr/bin/env node
'use strict'

var fs = require('fs')
var DIR = '/usr/local/lib/node_modules/rdr'
var HOSTS_BACKUP = DIR + '/backup/hosts'

module.exports = function () {
  var hosts = fs.readFileSync('/etc/hosts', 'utf8')
  if (!fs.readFileSync(HOSTS_BACKUP, 'utf8').length) {
    var write = fs.writeFileSync(HOSTS_BACKUP, hosts)
    if (write instanceof Error) {
      process.stderr.write(
        '\nERROR - Could not backup /etc/hosts/:\n\n'+
        '\n' + write.stack + '\n\n'
      )
    } else {
      process.stdout.write(
        '\n'+
        '  Backed up hosts file to: ' + HOSTS_BACKUP + '\n'+
        '  You can use "rdr reset" to restore both.\n\n'

      )
    }
  }
}
