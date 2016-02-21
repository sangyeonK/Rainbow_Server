var step = require('step');
var logger = require( '../../common/logger.js' );
var mysql = require( '../../common/mysql.js' );
var responsor = require('../../common/responsor.js');
var util = require('../../common/util.js');

module.exports = function(req, res) {
    
    var connection, result = {};
    
    var session = util.checkSession( req );
    if( session.err !== undefined )
        return responsor( session.err, res );
    
    var params = util.checkRequest( req, ["groupSN","year"], ["month","day"] );
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

            var startTimestamp, endTimestamp;
            
            if( params.month !== undefined && params.day !== undefined )
            {
                startTimestamp = util.makeUnixTime( params.year, params.month, params.day );
                endTimestamp = util.makeUnixTime( params.year, params.month, params.day + 1 );
            }
            else if( params.month !== undefined )
            {
                startTimestamp = util.makeUnixTime( params.year, params.month, 1 );
                endTimestamp = util.makeUnixTime( params.year, params.month + 1, 1 );
            }
            else
            {
                startTimestamp = util.makeUnixTime( params.year, 1, 1 );
                endTimestamp = util.makeUnixTime( params.year+1, 1, 1 );
            }

            var query = 'call spViewBills(' + session.user_sn + ', ' + params.groupSN + ', ' + startTimestamp + ', ' + endTimestamp + ')';
            
            connection.query( query , this );
        },
        function(err, rows, fields)
        {
            if( err ) throw err;
            
            var bills = [];
            for(var i = 0 ; i < rows[0].length ; i++ )
            {
                var date = util.parseUnixTime( rows[0][i].Timestamp );                
                bills.push( {year:date.year, month:date.month, day:date.day, userSN:rows[0][i].UserSN, userName:rows[0][i].UserName, category:rows[0][i].Category, amount:rows[0][i].Amount, comment:rows[0][i].Comment} );
            }
            result = bills;
            
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