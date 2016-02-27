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
        if( err.errno !== undefined )
        {
            res.status(500).send( makeResponse(1,util.getErrorMessage(1),undefined) );
        }
        else
        {
            res.status(500).send( makeResponse(err.code,err.message,undefined) );
        }
        logger.error("["+ res.req.url + "]\n" + ( res.req.headers.rs !== undefined ? res.req.headers.rs : "" ) + "\n" + JSON.stringify(res.req.body) + "\n" + ( err.errno !== undefined ? "1" : err.code ) + ' ' + err.message);
    }
    else
    {
        logger.info("["+ res.req.url + "]\n" + ( res.req.headers.rs !== undefined ? res.req.headers.rs : "" ) + "\n" + JSON.stringify(res.req.body) + "\n" + JSON.stringify(result));
        res.send( makeResponse(undefined,undefined,result) );
    }
};