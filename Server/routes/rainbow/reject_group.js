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
        params = util.checkParameter( ["group_invite_idx"] , req.query );
    else if(req.method == "POST")
        params = util.checkParameter( ["group_invite_idx"] , req.body );
    
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
            
            var query = 'call spRejectGroupInvite(' + session.user_sn + ',' + params.group_invite_idx + ')';
            
            connection.query( query , this );
        },
        function(err, rows, fields)
        {
            if( err ) throw err;
            
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