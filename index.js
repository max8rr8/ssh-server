const { createServer, setConnectCallback } = require('./lobby');
const { getStream, getCommunicator } = require('./utils');
const { addListener, delListener, broadcast, getCache } = require('./broadcaster');
const { format, getNick } = require('./format');


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
            } catch (e) {}
          },
          () => {}
        );

        id = addListener(write);
        write('\033c' + getCache());
        broadcast(getNick(nick) + ' connected\n');
      },
      () => {

        delListener(id);
        broadcast(getNick(nick) + ' disconnected\n')
      }
    );
  });

  server.listen(8022);
};

module.exports.addMethod = function(name,func){
  
}