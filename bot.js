let bots = [];

let onWrite = () => {};

function getWrite(bot) {
  return msg => {
    onWrite(bot.name, msg);
  };
}

module.exports.message = function message(nick, message) {
  bots.forEach(bot => {
    try {
      bot.onMessage(nick, message, getWrite(bot));
    } catch (e) {
      console.error(e);
    }
  });
};

module.exports.connect = function message(nick) {
  bots.forEach(bot => {
    try {
      bot.onConnect(nick, getWrite(bot));
    } catch (e) {
      console.error(e);
    }
  });
};

module.exports.disConnect = function message(nick) {
  bots.forEach(bot => {
    try {
      bot.onDisconnect(nick, message, getWrite(bot));
    } catch (e) {
      console.error(e);
    }
  });
};

module.exports.command = function message(name, message) {
  bots.forEach(bot => {
    if (bot.name == name) {
      try {
        bot.onCommand(message, getWrite(bot));
      } catch (e) {
        console.error(e);
      }
    }
  });
};

module.exports.registerBot = function(bot) {
  bots.push(bot);
  return getWrite(bot)
};

module.exports.onMessage = func => {
  onWrite = func;
};
