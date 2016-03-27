var logger = require( './logger.js' );
var common = require( './common.js' );
function makeResponse( errorCode, errorMessage, result ) {
	if( errorCode === undefined ) {
		return  result;
	}
	else {
		return { errorCode : errorCode , errorMessage : errorMessage };
	}
};

module.exports = function( err, res, result ) {
  if( err ) {  
    if( err.errno !== undefined )	{   //DATABASE ERROR
      err.code = 1;
    }
    else if( err.code === undefined )	{   //uncaughted exception ERROR
      err.code = 999;
    }
    res.status(500).send( makeResponse(err.code, common.getErrorMessage( err.code ) ) );
    logger.error( err.message, {URL:res.req.url, TOKEN:res.req.headers.token, BODY:res.req.body, ERRORNO: err.code, STACK:err.stack });
  }
  else {
    res.send( makeResponse(undefined,undefined,result) );
    logger.debug( '', {URL:res.req.url, TOKEN:res.req.headers.token, BODY:res.req.body, RESULT:JSON.stringify(result)});
  }
};
