const chat = require('.')
const { formatNick } = require('./format')

chat({})

chat.registerBot({
  name: 'botBob',
	
  onConnect(nick, write){
    write('@hello{' + nick + '}')
  },

  onDisconnect(nick, write){},

  onMessage(nick, message, write) {
	  if(message == 'botBob!') write('I\'m here')
  },
 
  onCommand(command, write) {
    write('Doing ' + command)
  }
})

chat.registerMethod('hello', function(p, name){
  return 'Hi, ' + formatNick(name) + '!'
})