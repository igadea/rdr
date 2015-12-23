#!/usr/bin/env node
'use strict'

/**
 * Creates a string of space characters of specified length.
 * @function
 * @param {Number} num
 * @return {String}
 * @note This keeps the hosts file looking tidy, with tab-like alignment.
 */
module.exports = function spaces(num) {
  var spaces = ''
  for (var i = 0; i < num; i++) {
    spaces += ' '
  }
  return spaces
}
