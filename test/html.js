'use strict';

var assert      = require('assert'),
    justIndent  = require('../');

describe('HTML', function() {
  it('should indent tags on new lines', function() {
    var input    = '<html>\n<b></b>\n</html>',
        expected ='<html>\n\t<b></b>\n</html>';

    assert.equal(justIndent(input, '\t'), expected);
  });
});