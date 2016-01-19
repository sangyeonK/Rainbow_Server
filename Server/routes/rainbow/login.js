var logger = require( '../../common/logger.js' );
var mysql = require( '../../common/mysql.js' );
var responsor = require('../../common/responsor.js');
var util = require('../../common/util.js');
var auth = require('../../common/auth.js');

module.exports = function(req, res) {

    var params, session, isAutoLogin;

    //자동 로그인 처리
    if(req.headers['rs'] != undefined )
    {
        var session = auth.decrypt(req.headers['rs']);
        if(session == undefined)
        {
            res.send( responsor(0,"INVALID_SESSION",{}) );
            return;
        }
        
        isAutoLogin = true;
    }
    else
    {
        if(req.method == "GET")
            params = util.checkParameter( ['user_id','password'] , req.query );
        else if(req.method == "POST")
            params = util.checkParameter( ['user_id','password'] , req.body );
        
        if( params == undefined || params == false )
        {
            res.send( responsor( 0, "BAD_REQUEST", {} ) );
            return;
        }
        
        isAutoLogin = false;
    }
    
    mysql.getConnection(function( err, connection) {
        if( isAutoLogin )
            var query = 'select UserID,UserSN,GroupSN from Account where UserSN=' + mysql.escape(session.user_sn);
        else
            var query = 'select UserID,UserSN,GroupSN from Account where UserID=' + mysql.escape(params.user_id) + ' and Password=' + mysql.escape(params.password);
        connection.query(query, function(err, rows, fields) {
            if (err)
            {
                logger.error(err.message);
                res.send( responsor(0,"DATABASE_ERROR",{}) );
                connection.release();
                return;
            }
            if(rows.length == 0 )
            {
                res.send( responsor(0,"INVALID_ID_PASSWORD",{}) );
                connection.release();
                return;
            }
            var rs = auth.encrypt({user_id:rows[0].UserID, user_sn:rows[0].UserSN});
            res.send( responsor(1,"",{rs:rs}) );
            connection.release();
            return;
            
        });
    });
};