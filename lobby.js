const { Server } = require('ssh2');
const { readFileSync } = require('fs');

const hostKey = readFileSync('./ssh');
const users = JSON.parse(readFileSync('./users.json'));

let connectionCallback = () => {};

module.exports.createServer = function createServer({ lobby }) {
  const server = new Server(
    {
      banner: lobby,
      hostKeys: [hostKey]
    },
    function(client) {
      nick = '';
      client
        .on('authentication', ctx => {
          if (ctx.method !== 'password') return ctx.reject();
          if (ctx.password !== users[ctx.username]) ctx.reject();
          nick = ctx.username;
          ctx.accept();
        })
        .on('ready', function() {
          connectionCallback(client, nick);
        });
    }
  );

  return server
};

module.exports.setConnectCallback = callback => {
  connectionCallback = callback;
};
