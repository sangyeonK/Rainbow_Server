
var step = require('step');
//var validator = require('validator');
//var logger = require( '../../common/logger.js' );
var mysql = require( '../../common/mysql.js' );
//var responsor = require('../../common/responsor.js');
//var common = require('../../common/common.js');
//var Constants = require('../../common/constants.js');

function main()
{
    var connection;
    step(
        function (){
            
        mysql.getConnection( this );
        },
        function (err, conn)  {
            if( err ) throw err;
            
            connection = conn;
            var query = 'select * from Account limit 5';
            
            connection.query( query, this );
        },
        function(err, rows, fields){

            console.log(err);
            console.log(rows);
            
            connection.release();
            return 1;
              console.log("ww2222w");
              e();
        }
    )
    e();
    return 999;
    
}


var a = main();

console.log(a);


/*
var mysql      = require('mysql');
var pool  = mysql.createPool({
  host     : 'localhost',
  user     : 'rainbow',
  password : '1q2w3e'
});

pool.getConnection(function(err, connection) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('connected as id ' + connection.threadId);
  pool.end();
  console.log("www");
});
*/