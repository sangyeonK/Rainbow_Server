var step = require('step');
var validator = require('validator');
var logger = require( '../../common/logger.js' );
var mysql = require( '../../common/mysql.js' );
var responsor = require('../../common/responsor.js');
var common = require('../../common/common.js');

module.exports = function(req, res) {

    var connection, result = {};
    
    var session = common.checkSession( req );
    if( session.err !== undefined )
        return responsor( session.err, res );
    
    var params = common.checkRequest( req, ["amount","year","month","day","category","comment"] );
    if( params.err !== undefined )
        return responsor( params.err, res );
    
	var userName;
    step(
        function () 
        {
            mysql.getConnection( this );
        },
        function (err, conn) 
        {
            if( err ) throw err;
            
            connection = conn;
            
            var query = mysql.makeQuery( 'call spGetUserAccount(%d)', session.user_sn );
            
            connection.query( query , this );
        },
        function ( err, rows, fields ) 
        {
            if( err ) throw err;

            if( rows[0][0].$userSN == null ) throw common.error(6);

            userName = rows[0][0].$userName;
            
            return null;
        },
        function ( err ) 
        {
            if( err ) throw err;
            
            var timestamp = common.makeUnixTime( params.year, params.month, params.day );
            
            var query = mysql.makeQuery( 'call spInsertBill(%d,%d,%d,%d,%s,%s)', 
                                                session.user_sn,
                                                session.group_sn,
                                                params.amount,
                                                timestamp,
                                                params.category,
                                                params.comment );
                                                
            connection.query( query , this );
        },
        function(err, rows, fields)
        {
            if( err ) throw err;
            
            if( rows[0][0].$result == -1 ) throw common.error(5);
            else if( rows[0][0].$result == -2 ) throw common.error(7);
            else if( rows[0][0].$result == -3 ) throw common.error(7);
            else if( rows[0][0].$result == -4 ) throw common.error(5);
            else if( rows[0][0].$result != 1) throw common.error(999);

            result = {
                        year:params.year,
                        month:params.month,
                        day:params.day,
                        userSN:session.user_sn,
                        userName:userName,
                        category:validator.trim(params.category,"'"),
                        amount:params.amount,
                        comment:validator.trim(params.comment,"'"),
						ownerType:"MINE"
                    };

			
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