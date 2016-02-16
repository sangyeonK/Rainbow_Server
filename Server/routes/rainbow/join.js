var step = require('step');
var validator = require('validator');
var logger = require( '../../common/logger.js' );
var mysql = require( '../../common/mysql.js' );
var responsor = require('../../common/responsor.js');
var util = require('../../common/util.js');
var auth = require('../../common/auth.js');

module.exports = function(req, res) {

    function spJoinHandler(err,rows,fields) {
        if( err ) throw err;
        
        if( rows[0].length == 0 || rows[0][0].$result == -1 ) throw util.error(4);
        else if( rows[0][0].$result == -3 )
        {
            var query = 'CALL spJoin(' + params.userId + ', ' + params.userName + ', ' + params.password + ', ' + mysql.escape( util.generateInviteCode() ) + ')';
            
            connection.query( query , this );
            return;
        }
        else if( rows[0][0].$result != 1) throw util.error(999);

        return rows;
    }
    
    var params;

    if(req.method == "GET")
        params = util.checkParameter( ['userId','userName','password'] , req.query );
    else if(req.method == "POST")
        params = util.checkParameter( ['userId','userName','password'] , req.body );
    
    if( params == undefined || params == false )
    {
        return responsor( util.error(3) , res , {} );
    }
	
	if( !validator.isEmail( validator.trim(params.userId,"'") ) )
	{
		return responsor( util.error(10) , res , {} );
	}
    
    var connection, result = {};
    step(
        function () {
            mysql.getConnection( this );
        },
        function (err, conn) {
            if( err ) throw err;
            
            connection = conn;
            
            var query = 'CALL spJoin(' + params.userId + ', ' + params.userName + ', ' + params.password + ', ' + mysql.escape( util.generateInviteCode() ) + ')';
            
            connection.query( query , this );
        },
        spJoinHandler,
        spJoinHandler,
        spJoinHandler,
        function ( err, rows, fields )
        {
            if( err ) throw err;
            
            if( rows[0][0].$result == -1 ) throw util.error(4);
                        
            result.token = auth.encrypt({user_id:rows[0][0].$userID, user_sn:rows[0][0].$userSN});
            result.userId = rows[0][0].$userID;
            result.userName = rows[0][0].$userName;
            result.group = { sn:rows[0][0].$groupSN , member:[rows[0][0].$userName,""], inviteCode:rows[0][0].$inviteCode, active:0};
            
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