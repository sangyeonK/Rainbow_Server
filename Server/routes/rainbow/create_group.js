var step = require('step');
var logger = require( '../../common/logger.js' );
var mysql = require( '../../common/mysql.js' );
var responsor = require('../../common/responsor.js');
var util = require('../../common/util.js');

module.exports = function(req, res) {

    var reqAnalysis = util.checkRequest( req, [] );
    
    if( reqAnalysis.err !== undefined )
        return responsor( reqAnalysis.err, res, {} );
    
    var params = reqAnalysis.params, session = reqAnalysis.session, connection, result = {};
    
    function createGroupHandler(err,rows,fields) {
        if( err ) throw err;
        
        if( rows[0].length == 0 || rows[0][0].$result == -1 ) throw new Error("INVALID_ACCOUNT");
        else if( rows[0][0].$result == -2 ) throw new Error("ALREADY_IN_THE_GROUP");
        else if( rows[0][0].$result == -3 )
        {
            var query = 'call spCreateGroup(' + session.user_sn +', '+ mysql.escape( util.generateInviteCode() ) + ')';
            console.log(query);
            connection.query( query , this );
            return;
        }
        else if( rows[0][0].$result != 1) throw new Error("GENERAL_ERROR");

        return rows;
    }
    
    step(
        function () 
        {
            mysql.getConnection( this );
        },
        function (err, conn) 
        {
            if( err ) throw err;
            
            connection = conn;
                     
            var query = 'call spCreateGroup(' + session.user_sn +', '+ mysql.escape( util.generateInviteCode() ) + ')';
            
            connection.query( query , this );
        },
        createGroupHandler,
        createGroupHandler,
        createGroupHandler,
        function (err,rows,fields) {
            if( err ) throw err;
            
            if( rows[0].length == 0 || rows[0][0].$result == -1 ) throw new Error("INVALID_ACCOUNT");
            else if( rows[0][0].$result == -2 ) throw new Error("ALREADY_IN_THE_GROUP");
            else if( rows[0][0].$result == -3 ) throw new Error("GENERAL_ERROR");
            else if( rows[0][0].$result != 1) throw new Error("GENERAL_ERROR");
            
            var userNames = [];
            if( rows[0][0].$ownerName != null )
                userNames.push( rows[0][0].$ownerName );
            if( rows[0][0].$partnerName != null)
                userNames.push( rows[0][0].$partnerName );
                        
            result = { sn:rows[0][0].$groupSN , member:userNames, inviteCode:rows[0][0].$inviteCode, active:rows[0][0].$active};
            
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

