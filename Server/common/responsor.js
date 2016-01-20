var logger = require( './logger.js' );

function makeResponse( status, errorMessage, result )
{
    return { status : status , 
             errorMessage : errorMessage ,
             result : result };    
};
module.exports = function( err, res, result )
{
    if( err )
    {
        if( err.sqlState )
        {
            logger.error(err.message);
            res.send( makeResponse(0,"DATABASE_ERROR",{}) );
        }
        else
        {
            res.send( makeResponse(0,err.message,{}) );
        }
    }
    else
    {
        res.send( makeResponse(1,"",result) );
    }
};