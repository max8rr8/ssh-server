const chalk = require('chalk');
const { parseAndExecute } = require('./parserExec')
const marked = require('marked');
const TerminalRenderer = require('marked-terminal');
 
marked.setOptions({
  renderer: new TerminalRenderer()
});

function getNick(nick) {
  let hash = 0;
  for (var i = 0; i < nick.length; i++) hash += nick.charCodeAt(i) - 32;

  return chalk.hsv((hash + 160) % 360, 90, 90)(chalk.bold(nick));
}

module.exports.format = function(nick, message) {
  const nickSpace = '\r  ' + ' '.repeat(nick.length);
  nick = getNick(nick) + ': ';

  message = message.replace(/\\n/gm, '\n');
  message = parseAndExecute(message)
  message = marked(message)

  message = message
    .split('\n')
    .filter(e=>e.length!==0)
    .map((e, i) => '' + (i !== 0 ? nickSpace : '') + e)
    .join('\n');

  return nick + message;
};

module.exports.formatNick = getNick