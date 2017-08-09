'use strict';

var noop = /\belse/i,
    notOpen = /end(if|for|while)/i,
    open = new RegExp(['<[a-z]+', '(<\\?(php)?[\\t\\ ]*)?[a-z]+\\s*\\(.+?\\)\\s*:', '[\\{\\(\\[]'].join('|')),
    close = new RegExp(['</[a-z]+', '/>', '[a-z\'"] *>', '(<\\?(php)?[\\t\\ ]*)?\\bend(if|for|while)', '<\\?(php)?[\\t\\ ]*\\}', '[\\}\\)\\]]'].join('|')),
    regex = new RegExp('(\\n*) *(' + [open.source, close.source, '\n *'].join('|') + ')', 'g');

module.exports = function (content, char) {
  var indentChar = char,
      indent = 0,
      closeIsImplied = false,
      lastHadNewLine = true;

  if (indentChar === undefined) {
    indentChar = '\t';
  }

  return content.replace(regex, function (m, nl, s) {
    var offset = 0,
        hasNewLine = (nl === undefined || nl === null || nl.length < 1);

    if (hasNewLine) {
      nl = '\n';
    }

    // console.log(m);
    if (noop.test(s)) {
      offset = -1;
    } else if (open.test(s) && !notOpen.test(s)) {
      indent++;
      offset = -1;
      closeIsImplied = ([
        'link', 'meta', 'img', 'input', 'br', 'hr'
      ].indexOf(s.toLowerCase().substr(1)) !== -1);
    } else if (close.test(s)) {
      if (s === '/>' || s.charAt(s.length - 1) !== '>' || closeIsImplied) {
        indent--;
      }

      if (s.toLowerCase().indexOf('php') !== -1) {
        // offset = -1;
      }

      if (indent < 0) {
        indent = 0;
      }
    } else {
      return m.replace(/[^\n]+/g, '') + indentChar.repeat(indent);
    }

    if (m.charAt(0) !== '\n') {
      return m;
    }


    offset = indent + offset;

    if (offset < 0) {
      offset = 0;
    }

    // console.log(JSON.stringify(m), JSON.stringify(nl), indent, offset, indent + offset);

    return nl + indentChar.repeat(offset) + s;
  });
}