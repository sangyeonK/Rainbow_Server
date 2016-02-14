var step = require('step');
var logger = require( '../../common/logger.js' );
var mysql = require( '../../common/mysql.js' );
var responsor = require('../../common/responsor.js');
var util = require('../../common/util.js');

module.exports = function(req, res) {

    var reqAnalysis = util.checkRequest( req, ["invite_code"] );
    
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
            
            var query = 'call spJoinGroup(' + session.user_sn + ', ' + params.invite_code + ')';
            
            connection.query( query , this );
        },
        function(err, rows, fields)
        {
            if( err ) throw err;
            
            if( rows[0][0].$result == -1 ) throw util.error(5);
            else if( rows[0][0].$result == -2 ) throw util.error(7);
            else if( rows[0][0].$result == -3 ) throw util.error(8);
            else if( rows[0][0].$result == -4 ) throw util.error(9);
            else if( rows[0][0].$result != 1) throw util.error(999);
            
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