var step = require('step');
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
            return responsor( new Error("INVALID_SESSION") , res , {} );
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
            return responsor( new Error("BAD_REQUEST") , res , {} );
        }
        
        isAutoLogin = false;
    }
    
    var connection, result = {};
    step(
        function () 
        {
            mysql.getConnection( this );
        },
        function (err, conn) 
        {
            if( err ) throw err;
            
            connection = conn;
            
            if( isAutoLogin )
                var query = 'call spGetUserAccount('+ session.user_sn +', "", "")';
            else
                var query = 'call spGetUserAccount(0, '+ params.user_id +', '+ params.password +')';
            
            connection.query( query , this );
        },
        function ( err, rows, fields ) 
        {
            if( err ) throw err;

            if( rows[0].length == 0 ) throw new Error("INVALID_ID_PASSWORD");
            
            result.rs = auth.encrypt({user_id:rows[0][0].UserID, user_sn:rows[0][0].UserSN});
            result.user_id = rows[0][0].UserID;
            result.user_name = rows[0][0].UserName;
            result.group_sn = rows[0][0].GroupSN;
            result.group_invite_code = ( rows[0][0].InviteCode !== null ? rows[0][0].InviteCode : "" );
            result.group_active =  ( rows[0][0].Active !== null ? rows[0][0].Active : "" );
            return null;
        },
        function ( err )
        {
            if(connection)
                connection.release();
            
            return responsor( err, res, result );
        }
    );
};