#!/usr/bin/env node
'use strict'

// Map argv to '$' variables, bash-style.
module.exports = function () {
  for (var i = 0; i < 99; i++) {
    global['$' + i] = null
  }
  process.argv.slice(1).forEach(
    function (arg, index) {global['$' + index] = arg}
  )
}
