var mysql = require( 'mysql' );
var util = require('util');
var logger = require( './logger.js' );
var responsor = require('./responsor.js');
var configure = require('./configure.js');

var connectionPool = mysql.createPool( configure.get("mysql") );

module.exports.getConnection = function( callback ) {
  connectionPool.getConnection( callback );
}

module.exports.makeQuery = function() {
  for( var i = 1 ; i < arguments.length ; i++ )
    if(typeof(arguments[i]) == "string")
      arguments[i] = mysql.escape( arguments[i] );

  return util.format.apply(null,arguments);
}
