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
        return responsor( new Error("INVALID_SESSION") , res , {} );
    }
    
    var session = auth.decrypt(req.headers['rs']);
    if(session == undefined)
    {
        return responsor( new Error("INVALID_SESSION") , res , {} );
    }
    
    if(req.method == "GET")
        params = util.checkParameter( ["group_invite_idx"] , req.query );
    else if(req.method == "POST")
        params = util.checkParameter( ["group_invite_idx"] , req.body );
    
    if( params == undefined || params == false )
    {
        return responsor( new Error("BAD_REQUEST") , res , {} );
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
            
            var query = 'call spAcceptGroupInvite(' + session.user_sn + ',' + params.group_invite_idx + ')';
            
            connection.query( query , this );
        },
        function(err, rows, fields)
        {
            if( err ) throw err;
            
            if( rows[0][0].$result == -1 ) throw new Error("INVALID_ACCOUNT");
            else if( rows[0][0].$result == -2 ) throw new Error("INVALID_GROUP");
            else if( rows[0][0].$result == -3 ) throw new Error("ALREADY_IN_THE_GROUP");
            
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