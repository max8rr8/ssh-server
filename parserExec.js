const chalk = require('chalk');
const boxen = require('boxen');

let methods = {
  color: function(args, text) {
    return chalk.keyword(args)(text);
  },

  bold: function(args, text) {
    return chalk.bold(text);
  },

  underline: function(args, text) {
    return chalk.underline(text);
  },

  hex: function(args, text) {
    return chalk.hex(args)(text);
  },

  box: function(args, text) {
    return boxen(text, {
      borderStyle: 'round',
      padding: 1,
      borderColor: 'blueBright'
    });
  }
};

function parseAndExecute(str) {
  let pos = 0;
  let stage = 0;
  let nS = '';
  let bufs = ['', '', '', ''];
  let level = 0;

  while (pos < str.length) {
    let symbol = str[pos];
    pos++;

    if (symbol == '\\' && '(){}@'.indexOf(str[pos]) !== -1) {
      bufs[stage] += str[pos];
      pos++;
      continue;
    }

    if (stage == 0 && symbol == '@') {
      stage++;
      nS += bufs[0];
      bufs[0] = '';
      continue;
    } else if (stage >= 1) {
      if (symbol == '(')
        if (stage < 2) {
          stage = 2;
        } else {
          level++;
        }

      if (symbol == ')' && stage >= 2 && level > 0) level--;

      if (symbol == '{')
        if (stage != 3) {
          stage = 3;
        } else {
          level++;
        }

      if (symbol == '}') {
        if (level == 0) {
          bufs[3] += '}';

          nS += methods[bufs[1]](bufs[2].slice(1, -1), parseAndExecute(bufs[3].slice(1, -1)));

          bufs = ['', '', '', ''];
          stage = 0;
          continue;
        } else {
          level--;
        }
      }
    }
    bufs[stage] += symbol;
  }
  return nS + bufs[0];
}

// Debug
// console.log(parseAndExecute('hey @a(b\\{gg){c} hey'));
// console.log(parseAndExecute('@a{c}'));
// console.log(parseAndExecute('@a{c} @a{d}'));
// console.log(parseAndExecute('@box{ @box{d} hey }'));

module.exports.parseAndExecute = parseAndExecute;
