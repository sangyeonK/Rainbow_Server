var mysql = require( './mysql.js' );
var responsor = require('./responsor.js');
var auth = require('./auth.js');

var errorMessageList = 
{
    1:"데이터베이스 처리도중 오류가 발생했습니다.",
    2:"잘못된 session 입니다.",
    3:"잘못된 parameter 입니다.",
    4:"이미 존재하는 ID 입니다.",
    5:"해당 요청을 처리할 수 없는 계정 입니다.",
    6:"ID 혹은 패스워드가 틀립니다.",
    7:"해당 요청을 처리할 수 없는 그룹 입니다.",
    8:"이미 그룹에 참가한 사용자 입니다.",
    9:"이미 사용자가 가득 찬 그룹입니다.",
    10:"잘못된 email 주소 입니다.",
    11:"패스워드는 영문/숫자 혼용으로 6자 이상만 가능합니다.",
    999:"서버 처리도중 오류가 발생했습니다."
};

var inviteCodeAlphabet = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
var inviteCodeLength = 16;

Error.prototype.setErrCode = function( errCode ) { this.code = errCode; return this; }

module.exports.checkSession = function( req ) {
    
    var result = {};
    
    if(req.headers['token'] == undefined )
    {
        result.err = this.error(2);
        return result;
    }
        
    session = auth.decrypt( req.headers['token'] );
    
    if(session == undefined)
    {
        result.err = this.error(2);
        return result;
    }
    
    return session;
}

module.exports.checkRequest = function( req, requireParams, optionalPrams ) {

    var session,inputParams,result = {};
    
    if(req.method == "GET")
        inputParams = req.query;
    else if(req.method == "POST")
        inputParams = req.body;

    if( inputParams == undefined || inputParams == false )
    {
        result.err = this.error(4);
        return result;
    }
    
    //필요한 파라미터 보다 많은 수의 파라미터가 입력되는 상황 확인
    var unresolveInputParam = this.objectSize(inputParams);
    
 
    for(var i = 0 ; i < requireParams.length ; i++ )
    {
        var val = inputParams[ requireParams[i] ];
        
        if( val === undefined )
        {
            result.err = this.error(3);
            return result;            
        }
        
        if( /^\d+$/.test(val) )
            val = parseInt( val );
        else
            val = mysql.escape( val );
        
        inputParams[ requireParams[i] ] = val;
        unresolveInputParam--;
    }
    
    if( optionalPrams !== undefined )
    {
        for(var i = 0 ; i < optionalPrams.length ; i++ )
        {

            var val = inputParams[ optionalPrams[i] ];
            
            if( val !== undefined )
            {
                if( /^\d+$/.test(val) )
                    val = parseInt( val );
                else
                    val = mysql.escape( val );
                
                inputParams[ optionalPrams[i] ] = val;
                unresolveInputParam--;
            }
        }
    }
    
    if( unresolveInputParam > 0 )
    {
        result.err = this.error(3);
        return result;                    
    }
    
    return inputParams;
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

module.exports.error = function(errCode) {
    var msg = this.getErrorMessage(errCode);
    return new Error(msg).setErrCode(errCode);
};

module.exports.getErrorMessage = function(errCode) {
    var msg = errorMessageList[errCode];
    if(msg === undefined)
        return "서버 처리도중 오류가 발생했습니다.";
    else 
        return msg;
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

