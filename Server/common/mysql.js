var mysql = require( 'mysql' );
var util = require('util');
var logger = require( './logger.js' );
var responsor = require('./responsor.js');

var connectionPool = mysql.createPool({
  connectionLimit : 5,
  host      : 'localhost',
  user      : 'rainbow',
  password  : '1q2w3e',
  database  : 'rainbow',
  charset   : 'utf8_general_ci'
});

module.exports.getConnection = function( callback ) {

    connectionPool.getConnection( callback );
}

module.exports.makeQuery = function() {
    
    for( var i = 1 ; i < arguments.length ; i++ )
        if(typeof(arguments[i]) == "string")
            arguments[i] = mysql.escape( arguments[i] );
        
    return util.format.apply(null,arguments);
}