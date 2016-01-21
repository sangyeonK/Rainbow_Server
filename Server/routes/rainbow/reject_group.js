var step = require('step');
var logger = require( '../../common/logger.js' );
var mysql = require( '../../common/mysql.js' );
var responsor = require('../../common/responsor.js');
var util = require('../../common/util.js');
var auth = require('../../common/auth.js');

module.exports = function(req, res) {

    var params, session;

    if(req.headers['rs'] == undefined )
    {
        responsor( new Error("INVALID_SESSION") , res , {} );
        return;
    }
    
    var session = auth.decrypt(req.headers['rs']);
    if(session == undefined)
    {
        responsor( new Error("INVALID_SESSION") , res , {} );
        return;
    }
    
    if(req.method == "GET")
        params = util.checkParameter( ["group_invite_idx"] , req.query );
    else if(req.method == "POST")
        params = util.checkParameter( ["group_invite_idx"] , req.body );
    
    if( params == undefined || params == false )
    {
        responsor( new Error("BAD_REQUEST") , res , {} );
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
            responsor( err, res, result );
            if(connection)
                connection.release();
            
            return null;
        }
    );
};