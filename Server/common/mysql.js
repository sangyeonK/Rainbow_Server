var mysql = require( 'mysql' );

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

module.exports.escape = function( str ) {

    return mysql.escape( str );
}