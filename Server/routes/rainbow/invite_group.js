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
        responsor( util.error(2) , res , {} );
        return;
    }
    
    var session = auth.decrypt(req.headers['token']);
    if(session == undefined)
    {
        responsor( util.error(2) , res , {} );
        return;
    }
    
    if(req.method == "GET")
        params = util.checkParameter( ["group_sn","invited_user_id"] , req.query );
    else if(req.method == "POST")
        params = util.checkParameter( ["group_sn","invited_user_id"] , req.body );
    
    if( params == undefined || params == false )
    {
        responsor( util.error(3) , res , {} );
        return;
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
            
            var query = 'call spInviteGroup(' + session.user_sn + ',' + params.group_sn + ', ' + params.invited_user_id + ')';
            
            connection.query( query , this );
        },
        function(err, rows, fields)
        {
            if( err ) throw err;
            
            if( rows[0][0].$result == -1 ) throw util.error(5);
            else if( rows[0][0].$result == -2 ) throw util.error(7);
            else if( rows[0][0].$result == -3 ) throw util.error(5);
            else if( rows[0][0].$result == -4 ) throw util.error(8);
            else if( rows[0][0].$result != 1 ) throw util.error(999);
                        
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