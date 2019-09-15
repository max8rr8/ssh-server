const { createServer, setConnectCallback } = require('./lobby');
const { getStream, getCommunicator } = require('./utils');
const { addListener, delListener, broadcast, getCache } = require('./broadcaster');
const { format, formatNick } = require('./format');
const { registerMethod } = require('./parserExec')
const bot = require('./bot')

bot.onMessage((nick, msg)=>{
  setTimeout(()=>broadcast(format(nick, msg) + '\n'), 0);
})

module.exports = function({ lobby = 'Hi' } = {}) {
  const server = createServer({
    lobby
  });

  setConnectCallback((client, nick) => {
    console.log('Client authenticated!');
    let id = null;
    getStream(
      client,
      stream => {
        const write = getCommunicator(
          stream,
          msg => {
            if (msg == '') return;
            try {
              broadcast(format(nick, msg) + '\n');
              bot.message(nick, msg)
            } catch (e) {console.error(e)}
          },
          () => {}
        );

        id = addListener(write);
        write('\033c' + getCache());
        broadcast(formatNick(nick) + ' connected\n');
        bot.connect(nick)
      },
      () => {

        delListener(id);
        broadcast(formatNick(nick) + ' disconnected\n')
        bot.disConnect(nick)
      }
    );
  });

  server.listen(8022);
};

registerMethod('bot', function(name, command){
  bot.command(name, command)
  return 'Hey, ' + name + '! Do ' + command
})

module.exports.registerMethod = registerMethod
module.exports.registerBot = bot.registerBot