var step = require('step');
var validator = require('validator');
var logger = require( '../../common/logger.js' );
var mysql = require( '../../common/mysql.js' );
var responsor = require('../../common/responsor.js');
var common = require('../../common/common.js');
var Constants = require('../../common/constants.js');

module.exports = function(req, res) {
    
    var connection, result = {};
    
    var session = common.checkSession( req );
    if( session.err !== undefined )
        return responsor( session.err, res );
    
    var params = common.checkRequest( req, ["startYear","startMonth","startDay","endYear","endMonth","endDay","ownerType"] );
    if( params.err !== undefined )
        return responsor( params.err, res );
    
	var ownerType = validator.trim(params.ownerType,"'");
    
    if( Constants.CONSTRAINTS.OWNER_TYPE.indexOf( ownerType ) )
        return responsor( common.error(3), res );
    
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
            
            var startTimestamp = common.makeUnixTime( params.startYear, params.startMonth, params.startDay );
            var endTimestamp = common.makeUnixTime( params.endYear, params.endMonth, params.endDay + 1 );
            
            var query = mysql.makeQuery('call spViewBills(%d,%d,%d,%d)',session.user_sn, session.group_sn, startTimestamp, endTimestamp);
            
            connection.query( query , this );
        },
        function(err, rows, fields)
        {
            if( err ) throw err;

            var bills = [];
			
            for(var i = 0 ; i < rows[0].length ; i++ )
            {
                var date = common.parseUnixTime( rows[0][i].Timestamp );                
                if( session.user_sn == rows[0][i].UserSN )
                    var bill_OwnerType = "MINE";
                else
                    var bill_OwnerType = "PARTNER";
                
				switch(ownerType)
				{
					case "MINE":
						if( session.user_sn == rows[0][i].UserSN )
							bills.push( {year:date.year, month:date.month, day:date.day, userSN:rows[0][i].UserSN, userName:rows[0][i].UserName, category:rows[0][i].Category, amount:rows[0][i].Amount, comment:rows[0][i].Comment, ownerType:bill_OwnerType} );
						break;
					case "PARTNER":
						if( session.user_sn != rows[0][i].UserSN )
							bills.push( {year:date.year, month:date.month, day:date.day, userSN:rows[0][i].UserSN, userName:rows[0][i].UserName, category:rows[0][i].Category, amount:rows[0][i].Amount, comment:rows[0][i].Comment, ownerType:bill_OwnerType} );
						break;
					default:
						bills.push( {year:date.year, month:date.month, day:date.day, userSN:rows[0][i].UserSN, userName:rows[0][i].UserName, category:rows[0][i].Category, amount:rows[0][i].Amount, comment:rows[0][i].Comment, ownerType:bill_OwnerType} );
				}
			
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