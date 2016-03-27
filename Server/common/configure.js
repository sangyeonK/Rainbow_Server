var path = require('path');
var Constants = require('./constants.js');

this.env = process.env.NODE_ENV || 'development';
this.settings = {};

module.exports.get = function ( key ) {
  return this.settings[key];
}

module.exports.set = function ( key, val ) {
  if (arguments.length === 1) {
    return this.settings[key];
  }

  this.settings[key] = val;

  return this;
}

function loadConfig( key, val ) {
  val = require("../config/" + val);

  this.set(key, val[this.env]);
}


loadConfig.call(this, "mysql", "mysql.json");
loadConfig.call(this, "server", "server.json");
