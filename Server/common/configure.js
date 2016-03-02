var path = require('path');
var Constants = require('./constants.js');

var basePath = path.dirname(require.main.filename);

this.env = process.env.NODE_ENV || 'development';
this.settings = {};




module.exports.get = function (setting) {
    return this.settings[setting];
};

module.exports.set = function (setting, val) {
    
    if (arguments.length === 1)
    {
        return this.settings[setting];
    }
  
    this.settings[setting] = val;
  
    return this;
};

module.exports.loadConfig = function(key, val) {

  val = require("../config/" + val);
  
  this.set(key, val[this.env]);
};

function loadConfig( key, val ) {
  val = require("../config/" + val);
  
  this.set(key, val[this.env]);    
};

console.log(this);
console.log(module.exports);
loadConfig.call(module.exports,"mysql","mysql.json");
loadConfig.call(module.exports,"server","server.json");
