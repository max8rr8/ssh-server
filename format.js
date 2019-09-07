const chalk = require('chalk');
const { parseAndExecute } = require('./parserExec')

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

  message = message
    .split('\n')
    .map((e, i) => '' + (i !== 0 ? nickSpace : '') + e)
    .join('\n');

  return nick + message;
};
s