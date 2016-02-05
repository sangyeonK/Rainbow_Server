var crypto = require('crypto');
var serialize = require('node-serialize');

var password = 'QA4F4UnzKGEfUghW4nJ7U7CcaKuUNd7x';

module.exports.encrypt = function (obj) {
    var m = crypto.createHash('md5');
    m.update(password);
    var key = m.digest('hex');

    m = crypto.createHash('md5');
    m.update(password + key);
    var iv = m.digest('hex');

    var input = serialize.serialize(obj);
    
    var data = new Buffer(input, 'utf8').toString('binary');

    var cipher = crypto.createCipheriv('aes-256-cbc', key, iv.slice(0,16));

    var encrypted = cipher.update(data, 'utf8', 'binary') + cipher.final('binary');
    
    var encoded = new Buffer(encrypted, 'binary').toString('base64');
    // Convert normal base64 to urlsafe base64
    var encoded = encoded.replace(/\+/g, '-').replace(/\//g, '_');
    
    return encoded;
};

module.exports.decrypt = function (input) {
    // Convert urlsafe base64 to normal base64
    var input = input.replace(/\-/g, '+').replace(/_/g, '/');
    // Convert from base64 to binary string
    var edata = new Buffer(input, 'base64').toString('binary')

    // Create key from password
    var m = crypto.createHash('md5');
    m.update(password);
    var key = m.digest('hex');

    // Create iv from password and key
    m = crypto.createHash('md5');
    m.update(password + key );
    var iv = m.digest('hex');

    // Decipher encrypted data
    try
    {
        var decipher = crypto.createDecipheriv('aes-256-cbc', key, iv.slice(0,16));

        var plaintext = (decipher.update(edata, 'binary', 'utf8') + decipher.final('utf8'));

        var decoded = serialize.unserialize(plaintext);
    }
    catch(ex)
    {
        return undefined;
    }
    
    return decoded;
};