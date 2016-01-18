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
        res.send( responsor( 0, "BAD_REQUEST", {} ) );
        return;
    }
    
    mysql.getConnection(function( err, connection) {
        var query = 'select UserSN from Account where UserID=' + mysql.escape(params.user_id);
        connection.query(query, function(err, rows, fields) {
            if (err)
            {
                logger.error(err.message);
                res.send( responsor(0,"DATABASE_ERROR",{}) );
                connection.release();
                return;
            }
            if(rows.length > 0 )
            {
                res.send( responsor(0,"ALREADY_EXIST_ID",{}) );
                connection.release();
                return;
            }
            
            query = 'insert into Account (`UserID`, `Password` ) values ( ' + mysql.escape(params.user_id) + ', ' + mysql.escape(params.password) + ')';
            connection.query(query, function(err, rows, fields) {
                if (err)
                {
                    logger.error(err.message);
                    res.send( responsor(0,"DATABASE_ERROR",{}) );
                    connection.release();
                    return;
                }
                
                res.send( responsor(1,"",{}) );
                connection.release();
                return;
            });
        });
        

    });
};