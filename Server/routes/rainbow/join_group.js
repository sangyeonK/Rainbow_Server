var step = require('step');
var logger = require( '../../common/logger.js' );
var mysql = require( '../../common/mysql.js' );
var responsor = require('../../common/responsor.js');
var common = require('../../common/common.js');
var auth = require('../../common/auth.js');

module.exports = function(req, res) {
    
    var connection, result = {};
    
    var session = common.checkSession( req );
    if( session.err !== undefined )
        return responsor( session.err, res );
    
    var params = common.checkRequest( req, ['invite_code'] );
    if( params.err !== undefined )
        return responsor( params.err, res );
    
    step(
        function () 
        {
            mysql.getConnection( this );
        },
        function (err, conn) 
        {
            if( err ) throw err;
            
            connection = conn;
            
            var query = mysql.makeQuery('call spJoinGroup(%d,%s)', session.user_sn, params.invite_code );

            connection.query( query , this );
        },
        function(err, rows, fields)
        {
            if( err ) throw err;
            
            if( rows[0][0].$result == -1 ) throw common.error(5);
            else if( rows[0][0].$result == -2 ) throw common.error(7);
            else if( rows[0][0].$result == -3 ) throw common.error(8);
            else if( rows[0][0].$result == -4 ) throw common.error(9);
            else if( rows[0][0].$result != 1) throw common.error(999);
            
            return null;
        },
        function ( err ) 
        {
            if( err ) throw err;
            
            var query = mysql.makeQuery('call spGetUserAccount(%d)', session.user_sn );
            
            connection.query( query , this );
        },
        function ( err, rows, fields ) 
        {
            if( err ) throw err;

            if( rows[0][0].$userSN == null ) throw common.error(6);
            
            var userNames = [];
            if( rows[0][0].$ownerName != null )
                userNames.push( rows[0][0].$ownerName );
            if( rows[0][0].$partnerName != null)
                userNames.push( rows[0][0].$partnerName );
            
            result.token = auth.encrypt({user_id:rows[0][0].$userID, user_sn:rows[0][0].$userSN, group_sn:rows[0][0].$groupSN});
            result.userId = rows[0][0].$userID;
            result.userName = rows[0][0].$userName;
            result.group = { sn:rows[0][0].$groupSN , member:userNames, inviteCode:rows[0][0].$inviteCode, active:rows[0][0].$active};
            
            return null;
        },
        function ( err, contents )
        {
            if(connection)
                connection.release();
            
            return responsor( err, res, result );
        }
    );
};