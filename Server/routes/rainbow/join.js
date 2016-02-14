var step = require('step');
var logger = require( '../../common/logger.js' );
var mysql = require( '../../common/mysql.js' );
var responsor = require('../../common/responsor.js');
var util = require('../../common/util.js');
var auth = require('../../common/auth.js');

module.exports = function(req, res) {

    var params;
    
    if(req.method == "GET")
        params = util.checkParameter( ['userId','userName','password'] , req.query );
    else if(req.method == "POST")
        params = util.checkParameter( ['userId','userName','password'] , req.body );
    
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
            
            var query = 'CALL spJoin(' + params.userId + ', ' + params.userName + ', ' + params.password + ' )';
            
            connection.query( query , this );
        },
        function ( err, rows, fields )
        {
            if( err ) throw err;
            
            if( rows[0][0].$result == -1 ) throw new Error("ALREADY_EXIST_ID");
                        
            result.rs = auth.encrypt({user_id:rows[0][0].$userID, user_sn:rows[0][0].$userSN});
            result.userId = rows[0][0].$userID;
            result.userName = rows[0][0].$userName;
            result.group = { sn:0 , member:["",""], inviteCode:"", active:0};
            
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