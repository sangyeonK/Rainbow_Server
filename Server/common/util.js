var mysql = require( './mysql.js' );

var errorCodeList = 
{
    "DATABASE_ERROR" : 1,           //데이터베이스 처리중 오류 발생
    "INVALID_SESSION" : 2,          //세션값 오류
    "BAD_REQUEST" : 3,              //파라미터 입력 오류
    "ALREADY_EXIST_ID" : 4,         //이미 있는 ID
    "INVALID_ACCOUNT" : 5,          //잘못된 계정
    "INVALID_ID_PASSWORD" : 6,      //(르그인 시)잘못된 ID 혹은 패스워드
    "INVALID_GROUP" : 7,            //잘못된 그룹
    "ALREADY_IN_THE_GROUP" : 8,     //이미 그룹에 참가한 사용자
    
    "GENERAL_ERROR" : 99            //기타 일반적인 오류
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

