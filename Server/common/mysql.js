var mysql = require( 'mysql' );
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
/*
module.exports.getConnection = function( res, callback ) {

    connectionPool.getConnection( function( err, connection ) {
        if( err )
        {
            logger.error(err.message);
            res.send( responsor(0,"DATABASE_ERROR",{}) );
            return;
        }
        else
            callback(err, connection );
        
    });
}
*/

module.exports.escape = function( str ) {

    return mysql.escape( str );
}