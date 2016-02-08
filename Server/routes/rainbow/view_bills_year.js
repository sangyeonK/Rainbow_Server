var step = require('step');
var logger = require( '../../common/logger.js' );
var mysql = require( '../../common/mysql.js' );
var responsor = require('../../common/responsor.js');
var util = require('../../common/util.js');

module.exports = function(req, res) {

    var reqAnalysis = util.checkRequest( req, ["groupSN","year"] );
    
    if( reqAnalysis.err !== undefined )
        return responsor( reqAnalysis.err, res, {} );
    
    var params = reqAnalysis.params, session = reqAnalysis.session, connection, result = {};
    
    step(
        function () 
        {
            mysql.getConnection( this );
        },
        function (err, conn) 
        {
            if( err ) throw err;
            
            connection = conn;
            
            var startTimestamp = util.makeUnixTime( params.year, 1, 1 );
            var endTimestamp = util.makeUnixTime( params.year+1, 1, 1 );
            
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