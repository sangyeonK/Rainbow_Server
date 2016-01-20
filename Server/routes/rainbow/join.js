var step = require('step');
var logger = require( '../../common/logger.js' );
var mysql = require( '../../common/mysql.js' );
var responsor = require('../../common/responsor.js');
var util = require('../../common/util.js');

module.exports = function(req, res) {

    var params;
    
    if(req.method == "GET")
        params = util.checkParameter( ['user_id','password'] , req.query );
    else if(req.method == "POST")
        params = util.checkParameter( ['user_id','password'] , req.body );
    
    if( params == undefined || params == false )
    {
        return responsor( new Error("BAD_REQUEST") , res , {} );
    }
    
    var connection, result = {};
    step(
        function () {
            mysql.getConnection( this );
        },
        function (err, conn) {
            if( err ) throw err;
            
            connection = conn;
            
            var query = 'select UserSN from Account where UserID=' + mysql.escape(params.user_id);
            
            connection.query( query , this );
        },
        function ( err, rows, fields ) {
            if( err ) throw err;
            
            if( rows.length > 0 ) throw new Error("ALREADY_EXIST_ID");
            
            var query = 'insert into Account (`UserID`, `Password` ) values ( ' + mysql.escape(params.user_id) + ', ' + mysql.escape(params.password) + ')';
            connection.query(query, this );
        },
        function ( err, contents )
        {
            responsor( err, res, result );
            if(connection)
                connection.release();
            
            return null;
        }
    );
};