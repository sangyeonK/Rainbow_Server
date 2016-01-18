module.exports = function( status, errorMessage, result )
{
    return { status : status , 
             errorMessage : errorMessage ,
             result : result };
};