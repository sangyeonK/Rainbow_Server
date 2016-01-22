var mysql = require( './mysql.js' );

var errorCodeList = 
{
    "DATABASE_ERROR" : 1,
    "INVALID_SESSION" : 2,
    "BAD_REQUEST" : 3,
    "ALREADY_EXIST_ID" : 4,
    "INVALID_ACCOUNT" : 5,
    "INVALID_ID_PASSWORD" : 6,
    "INVALID_GROUP" : 7,
    "ALREADY_IN_THE_GROUP" : 8,
    
    "GENERAL_ERROR" : 99
};

module.exports.checkParameter = function( params , request_body) {

    if( params.length != this.objectSize(request_body) )
    {
        return false;
    }
        
    for(var i = 0 ; i < params.length ; i++ )
    {
        if(request_body[ params[i] ] == undefined )
        {
            return false;
        }
        request_body[ params[i] ] = mysql.escape( request_body[ params[i] ] );
    }
    return request_body;
};

module.exports.objectSize = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

module.exports.getUnixTime = function() {
    return Math.floor(Date.now() / 1000);
};

module.exports.error = function(code,message) {
    return {code:code, message:message};
};

module.exports.getErrorCode = function(message) {
    var code = errorCodeList[message];
    if(code === undefined)
        return 99;
    else 
        return code;
};

