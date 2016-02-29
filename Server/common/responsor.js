var logger = require( './logger.js' );
var common = require( './common.js' );
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
        if( err.errno !== undefined )
        {
            res.status(500).send( makeResponse(1,common.getErrorMessage(1),undefined) );
        }
        else
        {
            res.status(500).send( makeResponse(err.code,err.message,undefined) );
        }
        logger.error( err.message, {URL:res.req.url, TOKEN:res.req.headers.token, BODY:res.req.body, ERRORNO:( err.errno !== undefined ? "1" : err.code )});
    }
    else
    {
        logger.debug( '', {URL:res.req.url, TOKEN:res.req.headers.token, BODY:res.req.body, RESULT:JSON.stringify(result)});
        res.send( makeResponse(undefined,undefined,result) );
    }
};