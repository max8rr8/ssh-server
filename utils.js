
const { createInterface } = require('readline');

module.exports.getStream = function(client, onStream, onEnd){
  client
    .on('session', function(accept, reject) {
      accept()
        .on('pty', accept => accept & accept())
        .on('shell', accept => onStream(accept()));
    })
    .on('end', () => onEnd());
}

module.exports.getCommunicator = function(stream, onMessage, onEnd){

  let readline = createInterface({
    input: stream,
    output: stream,
    prompt: '> ',
    historySize: 0,
    terminal: true
  })
  readline.prompt()

  readline.on('close', ()=>{
    radline = null;
    onEnd()
    stream.end()
  })

  readline.on('line', (msg)=>{
    stream.write('\033[s\033[1A\033[1K\r')
    onMessage(msg)
    readline.prompt()
  })
  
  return msg=>{
    stream.write('\033[1K\r' + msg)
    readline.prompt()
  }
}