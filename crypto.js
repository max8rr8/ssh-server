const crypto = require('crypto');

function genRandomString(length) {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length);
}

function sha512(password, salt){
  const hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
  hash.update(password);
  const value = hash.digest('hex');
  return value
};

function checkPass(pass, obj){
  return obj.password == sha512(pass, obj.salt)
}

function encodePass(pass){
  const salt = genRandomString(16)
  return JSON.stringify({
    salt,
    password: sha512(pass, salt)
  })
}

module.exports.encodePass = encodePass
module.exports.checkPass = checkPass