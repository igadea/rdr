#!/usr/bin/env node
'use strict'

// ERROR MESSAGES --------------------------------------------------------------
var INVALID_SRC_PORT = ''+
  'A source port is required (you probably meant 80).\n'
var INVALID_DEST_PORT = ''+
  'A destination port is required (you probably want a port 3000-3099).\n'
var INVALID_SRC_HOST = ''+
  'You must specify a source host.\n'
var INVALID_DEST_IP = ''+
  'You must forward traffic to an IP address.\n'
// -----------------------------------------------------------------------------

module.exports = function ($1, $3) {
  var srcHost =   $1.split(':').shift()
  var srcPort =   $1.split(':').pop()
  var destHost =  $3.split(':').shift()
  var destPort =  $3.split(':').pop()
  // Validate
  var rPort =     /^\d{2,5}$/
  var rIp =       /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/
  var rDomain =   /^[A-z0-9-\.]+$/
  if (!rDomain.test(srcHost)) process.stderr.write(INVALID_SRC_HOST)
  if (!rPort.test(srcPort))   process.stderr.write(INVALID_SRC_PORT)
  if (!rIp.test(destHost))    process.stderr.write(INVALID_DEST_IP)
  if (!rPort.test(destPort))  process.stderr.write(INVALID_DEST_PORT)
  return {
    srcHost: srcHost,
    srcPort: srcPort,
    destHost: destHost,
    destPort: destPort
  }
}
