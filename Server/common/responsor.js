var logger = require( './logger.js' );
var util = require( './util.js' );
function makeResponse( errorCode, errorMessage, result )
{
	if( errorCode === undefined )
	{
		return  result;
	}
	else
	{
		return {errorCode : errorCode , 
             errorMessage : errorMessage};
	}
};

module.exports = function( err, res, result )
{
    if( err )
    {
        if( err.sqlState )
        {
            res.status(500).send( makeResponse(util.getErrorCode("DATABASE_ERROR"),"DATABASE_ERROR",undefined) );
        }
        else
        {
            res.status(500).send( makeResponse(util.getErrorCode(err.message),err.message,undefined) );
        }
        logger.error("["+ res.req.url + "]\n" + ( res.req.headers.rs !== undefined ? res.req.headers.rs : "" ) + "\n" + JSON.stringify(res.req.body) + "\n" + ( err.sqlState !== undefined ? "1" : util.getErrorCode(err.message) ) + ' ' + err.message);
    }
    else
    {
        res.send( makeResponse(undefined,undefined,result) );
    }
};