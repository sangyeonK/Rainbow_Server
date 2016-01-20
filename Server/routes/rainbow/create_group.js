var logger = require( '../../common/logger.js' );
var mysql = require( '../../common/mysql.js' );
var responsor = require('../../common/responsor.js');
var util = require('../../common/util.js');
var auth = require('../../common/auth.js');

module.exports = function(req, res) {

    var params, session;

    if(req.headers['rs'] == undefined )
    {
        res.send( responsor(0,"INVALID_SESSION",{}) );
        return;
    }
    
    var session = auth.decrypt(req.headers['rs']);
    if(session == undefined)
    {
        res.send( responsor(0,"INVALID_SESSION",{}) );
        return;
    }
    
    if(req.method == "GET")
        params = util.checkParameter( [] , req.query );
    else if(req.method == "POST")
        params = util.checkParameter( [] , req.body );
    
    if( params == undefined || params == false )
    {
        res.send( responsor( 0, "BAD_REQUEST", {} ) );
        return;
    }
    
    mysql.getConnection(res,function( err, connection) {
        var query = 'select GroupSN from `Account` where UserSN=' + session.user_sn;
        connection.query(query, function(err, rows, fields) {
            if (err)
            {
                logger.error(err.message);
                res.send( responsor(0,"DATABASE_ERROR",{}) );
                connection.release();
                return;
            }
            if(rows.length == 0 )
            {
                res.send( responsor(0,"INVALID_ACCOUNT",{}) );
                connection.release();
                return;
            }
            var groupSN = rows[0].GroupSN;
            if( groupSN != 0 )
            {
                res.send( responsor(0,"ALREADY_BELONG_GROUP",{}) );
                connection.release();
                return;                
            }
            
            query = 'insert into `Group` (`CreateTimestamp`,`OwnerSN`) values ( ' + util.getUnixTime() + ', ' + session.user_sn + ')';
            connection.query(query, function(err, rows,fields) {
                if (err)
                {
                    logger.error(err.message);
                    res.send( responsor(0,"DATABASE_ERROR",{}) );
                    connection.release();
                    return;
                }
                var groupSN = rows.insertId;
                query = 'update `Account` set `GroupSN` = '+ groupSN + ' where `UserSN` = ' + session.user_sn;
                connection.query(query, function(err, rows, fields) {
                    if (err)
                    {
                        logger.error(err.message);
                        res.send( responsor(0,"DATABASE_ERROR",{}) );
                        connection.release();
                        return;
                    }
                    res.send( responsor( 1, "", { group:{id:groupSN,member:[session.user_id],active:0} } ) );
                    connection.release();
                    return;
                });
            });
        });
    });
};