let listeners = [];
let cache = new Array(100).fill('')

module.exports.addListener = write => listeners.push(write) - 1;
module.exports.delListener = id => listeners.splice(id, 1);

module.exports.broadcast = msg => {

  cache.shift()
  cache.push(msg)
  process.stdout.write(msg)
  listeners.forEach(wr => wr(msg));
}

module.exports.getCache = ()=>cache.join('\r\033[2K')