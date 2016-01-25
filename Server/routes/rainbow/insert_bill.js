var step = require('step');
var logger = require( '../../common/logger.js' );
var mysql = require( '../../common/mysql.js' );
var responsor = require('../../common/responsor.js');
var util = require('../../common/util.js');

module.exports = function(req, res) {

    var reqAnalysis = util.checkRequest( req, ["groupSN","personType","amount","year","month","day","category","hashtags","comment"] );
    
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

            var timestamp = util.makeUnixTime( params.year, params.month, params.day );
            
            var query = 'call spInsertBill(' + session.user_sn + ', ' + 
                                               params.groupSN + ', ' + 
                                               params.personType + ', ' + 
                                               params.amount + ', ' + 
                                               timestamp + ', ' + 
                                               params.category + ', ' + 
                                               params.hashtags + ', ' + 
                                               params.comment + ')';
                                               
            console.log( query );                                   
            connection.query( query , this );
        },
        function(err, rows, fields)
        {
            if( err ) throw err;
            
            if( rows[0][0].$result == -1 ) throw new Error("INVALID_ACCOUNT");
            else if( rows[0][0].$result == -2 ) throw new Error("INVALID_GROUP");
            else if( rows[0][0].$result == -3 ) throw new Error("INVALID_GROUP");
            else if( rows[0][0].$result == -4 ) throw new Error("INVALID_ACCOUNT");
            else if( rows[0][0].$result != 1) throw new Error("GENERAL_ERROR");
            
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