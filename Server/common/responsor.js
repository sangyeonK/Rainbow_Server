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
        logger.error("["+ res.req.url + "]\n" + ( res.req.headers.rs !== undefined ? res.req.headers.rs : "" ) + "\n" + JSON.stringify(res.req.body) + "\n" + err.message);
        if( err.sqlState )
        {
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