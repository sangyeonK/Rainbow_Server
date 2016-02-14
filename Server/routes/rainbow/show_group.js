var step = require('step');
var logger = require( '../../common/logger.js' );
var mysql = require( '../../common/mysql.js' );
var responsor = require('../../common/responsor.js');
var util = require('../../common/util.js');
var auth = require('../../common/auth.js');

module.exports = function(req, res) {

    var params, session;

    if(req.headers['token'] == undefined )
    {
        return responsor( util.error(2) , res , {} );
    }
    
    var session = auth.decrypt(req.headers['token']);
    if(session == undefined)
    {
        return responsor( util.error(2) , res , {} );
    }
    
    if(req.method == "GET")
        params = util.checkParameter( [] , req.query );
    else if(req.method == "POST")
        params = util.checkParameter( [] , req.body );
    
    if( params == undefined || params == false )
    {
        return responsor( util.error(3) , res , {} );
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
            
            var query = 'call spShowGroups(' + session.user_sn +')';
            
            connection.query( query , this );
        },
        function(err, rows, fields)
        {
            if( err ) throw err;
            
            if( rows[0].length == 0 || rows[0][0].$result == -1 ) throw util.error(5);
            
            var userNames = [];
            if( rows[0][0].$ownerName != null )
                userNames.push( rows[0][0].$ownerName );
            if( rows[0][0].$partnerName != null)
                userNames.push( rows[0][0].$partnerName );
            
            result.group = { sn:rows[0][0].$groupSN , member:userNames, active:rows[0][0].$active};
            
            return null;
        },
        function(err, contents)
        {
            if( err ) throw err;
            
            var query = 'call spShowGroupInvite(' + session.user_sn +')';
            
            connection.query( query , this );
        },
        function(err, rows, fields)
        {
            if( err ) throw err;
            
            result.invite = [];
            
            for(var i = 0 ; i < rows[0].length ; i++ )
            {
                result.invite.push({idx:rows[0][i].Idx, userID:rows[0][i].UserID, groupSN:rows[0][i].GroupSN});
            }
            
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