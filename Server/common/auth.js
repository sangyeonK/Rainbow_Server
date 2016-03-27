var crypto = require('crypto');
var serialize = require('node-serialize');
var configure = require('./configure.js');

var sessionBaseKey = configure.get("server").sessionBaseKey;
var passwordSecretKey = configure.get("server").passwordSecretKey;

var key = crypto.createHash('md5').update(sessionBaseKey).digest('hex');
var iv = crypto.createHash('md5').update(sessionBaseKey + key).digest('hex').slice(0,16);

function generateKey(size) {
  return crypto.randomBytes(size);
}

module.exports.encrypt = function (obj) {
  var data = new Buffer(serialize.serialize(obj), 'utf8');
  var cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  var encodedBuff = Buffer.concat([cipher.update(data),cipher.final()]);
  var encodedText = encodedBuff.toString('base64');
  // Convert normal base64 to urlsafe base64
  var encodedText = encodedText.replace(/\+/g, '-').replace(/\//g, '_');

  return encodedText;
};

module.exports.decrypt = function (text) {
  // Convert urlsafe base64 to normal base64
  var text = text.replace(/\-/g, '+').replace(/_/g, '/');
  // Convert from base64 to binary string
  var edata = new Buffer(text, 'base64');
  // Decipher encrypted data
  try {
    var decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    var decodedBuff = Buffer.concat([decipher.update(edata),decipher.final()]);
    var decodedObj = serialize.unserialize(decodedBuff.toString('utf8'));
  } catch (e) {
    return undefined;
  } finally {
    return decodedObj;
  }
};

module.exports.encryptPasswd = function(text) {
  const hmac = crypto.createHmac('sha512', passwordSecretKey);
  return hmac.update(text).digest('hex');
}
