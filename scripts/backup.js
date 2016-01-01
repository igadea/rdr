#!/usr/bin/env node
'use strict'

var fs = require('fs')
var CMN = require('./common')

module.exports = function () {
  var hosts = fs.readFileSync('/etc/hosts', 'utf8')
  try {
    fs.readFileSync(CMN.FILE.BACKUP, 'utf8')
  } catch (e) {
    var write = fs.writeFileSync(CMN.FILE.BACKUP, hosts)
    if (write instanceof Error) {
      process.stderr.write(
        '\nERROR - Could not backup /etc/hosts/:\n\n'+
        '\n' + write.stack + '\n\n'
      )
    } else {
      CMN.stdout('Backed up hosts file to: ' + CMN.FILE.BACKUP)
    }
  }
}
