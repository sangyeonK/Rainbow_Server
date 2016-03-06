var step = require('step');
var validator = require('validator');
var logger = require( '../../common/logger.js' );
var mysql = require( '../../common/mysql.js' );
var responsor = require('../../common/responsor.js');
var common = require('../../common/common.js');
var auth = require('../../common/auth.js');

module.exports = function(req, res) {

    function spJoinHandler(err,rows,fields) {
        if( err ) throw err;
        
        if( rows[0].length == 0 || rows[0][0].$result == -1 ) throw common.error(4);
        else if( rows[0][0].$result == -3 )
        {
            var query = mysql.makeQuery('call spJoin(%s,%s,%s,%s)', params.userId, params.userName, params.password, common.generateInviteCode() );
            
            connection.query( query , this );
            return;
        }
        else if( rows[0][0].$result != 1) throw common.error(999);

        return rows;
    }
    
    var connection, result = {};
    var params = common.checkRequest( req, ['userId','userName','password'] );

    
    if( params.err !== undefined )
        return responsor( params.err, res );

	if( !validator.isEmail( validator.trim(params.userId,"'") ) )
	{
		return responsor( common.error(10) , res );
	}
    
    var passwd = params.password.toString();
    if( !validator.isLength( passwd , 6 ) || !validator.matches( passwd, "[a-z]", "i") || !validator.matches( passwd, "[0-9]" ) )
    {
        return responsor( common.error(11) , res );
    }

    step(
        function () {
            mysql.getConnection( this );
        },
        function (err, conn) {
            if( err ) throw err;
            
            connection = conn;
            
            var query = mysql.makeQuery('call spJoin(%s,%s,%s,%s)', params.userId, params.userName, params.password, common.generateInviteCode() );
            
            connection.query( query , this );
        },
        spJoinHandler,
        spJoinHandler,
        spJoinHandler,
        function ( err, rows, fields )
        {
            if( err ) throw err;
            
            if( rows[0][0].$result == -1 ) throw common.error(4);
                        
            result.token = auth.encrypt({user_id:rows[0][0].$userID, user_sn:rows[0][0].$userSN, group_sn:rows[0][0].$groupSN});
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