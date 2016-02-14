var mysql = require( './mysql.js' );
var responsor = require('./responsor.js');
var auth = require('./auth.js');

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
    "ALREADY_FULL_GROUP" : 9,       //이미 사용자가 가득 찬 그룹
    
    "GENERAL_ERROR" : 99            //기타 일반적인 오류
};

var inviteCodeAlphabet = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
var inviteCodeLength = 16;

module.exports.checkRequest = function( req, requireParams, needSession) {

    var session,inputParams,result = {};
    
    if(req.method == "GET")
        inputParams = req.query;
    else if(req.method == "POST")
        inputParams = req.body;

    //check session
    if(req.headers['token'] == undefined )
    {
        result.err = new Error("INVALID_SESSION");
        return result;
    }
        
    session = auth.decrypt( req.headers['token'] );
    
    if(session == undefined)
    {
        result.err = new Error("INVALID_SESSION");
        return result;
    }
    
    //check parameters
    if( inputParams == undefined || inputParams == false )
    {
        result.err = new Error("BAD_REQUEST");
        return result;
    }
    
    if( requireParams.length != this.objectSize(inputParams) )
    {
        result.err = new Error("BAD_REQUEST");
        return result;
    }
    
    for(var i = 0 ; i < requireParams.length ; i++ )
    {
        if(inputParams[ requireParams[i] ] == undefined )
        {
            result.err = new Error("BAD_REQUEST");
            return result;
        }
        
        var val = inputParams[ requireParams[i] ];
        
        if( /^\d+$/.test(val) )
            val = parseInt( val );
        else
            val = mysql.escape( val );
        
        inputParams[ requireParams[i] ] = val;
    }
    
    return {session:session, params:inputParams};
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
        
        var val = request_body[ params[i] ];
        
        if( /^\d+$/.test(val) )
            val = parseInt( val );
        else
            val = mysql.escape( val );
        
        request_body[ params[i] ] = val;
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

module.exports.makeUnixTime = function(year, month, day) { 
    return Math.floor(new Date(year,month-1,day,0,0,0).getTime() / 1000);
};

module.exports.parseUnixTime = function(unixtime) { 
    var d = new Date(unixtime * 1000);
    
    return { year:d.getFullYear(), month:d.getMonth() + 1 , day:d.getDate(), hour:d.getHours(), min:d.getMinutes(), sec:d.getSeconds() };
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

module.exports.generateInviteCode = function()
{
    var result = '';
    for(var i = 0 ; i < inviteCodeLength ; i++)
    {
        result += inviteCodeAlphabet.charAt(Math.floor(Math.random() * inviteCodeAlphabet.length));
    }
    
    return result;
};

