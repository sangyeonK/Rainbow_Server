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
        params = util.checkParameter( [] , req.query );
    else if(req.method == "POST")
        params = util.checkParameter( [] , req.body );
    
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
            
            var query = 'select GroupSN from `Account` where UserSN=' + session.user_sn;
            
            connection.query( query , this );
        },
        function(err, rows, fields)
        {
            if( err ) throw err;
            
            if( rows.length == 0) throw new Error("INVALID_ACCOUNT");
            
            
            
            var groupSN = rows[0].GroupSN;
            
            result.group = {};
            
            result.group.id = groupSN;
            
            if( groupSN == 0 )
            {
                result.group.active = 0;
                result.group.member = [];

                return null;
            }
            else 
            {
                var query = 'select OwnerSN, PartnerSN, Active from `Group` where GroupSN = ' + groupSN;
                connection.query( query, this );
            }
        },
        function (err, rows, fields)
        {
            if( err ) throw err;
            
            if( rows == null ) return null;

            result.group.active = rows[0].Active;            
            
            query = 'select UserID from `Account` where UserSN in (' + rows[0].OwnerSN + ' , ' + rows[0].PartnerSN + ')';
            connection.query(query, this);
            
        },
        function (err, rows, fields)
        {
            if( err ) throw err;
            
            if( rows == null ) return null;
                
            var userIDs = [];
            for( var i = 0 ; i < rows.length ; i++ )
            {
                userIDs.push( rows[i].UserID );
            }
            
            result.group.member = userIDs;
            
            return null;
        },
        //function GroupInvite..
        function ( err, contents )
        {
            responsor( err, res, result );
            if(connection)
                connection.release();
            
            return null;
        }
    );
};