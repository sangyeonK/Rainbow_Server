var mysql = require( './mysql.js' );
var responsor = require('./responsor.js');
var auth = require('./auth.js');
var Constants = require('./constants.js');

Error.prototype.setErrCode = function( errCode ) { this.code = errCode; return this; }

module.exports.checkSession = function( req ) {
  var result = {};

  if(req.headers['token'] == undefined ) {
    result.err = this.error(2);
    return result;
  }

  session = auth.decrypt( req.headers['token'] );

  if(session == undefined) {
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

  if( inputParams == undefined ) {
    result.err = this.error(4);
    return result;
  }

  //필요한 파라미터 보다 많은 수의 파라미터가 입력되는 상황 확인
  var unresolveInputParam = this.objectSize(inputParams);


  for(var i = 0 ; i < requireParams.length ; i++ ) {
    var val = inputParams[ requireParams[i] ];

    if( val === undefined ) {
      result.err = this.error(3);
      return result;
    }

    if( /^\d+$/.test(val) )
      val = parseInt( val );

    inputParams[ requireParams[i] ] = val;
    unresolveInputParam--;
  }

  if( optionalPrams !== undefined ) {
    for(var i = 0 ; i < optionalPrams.length ; i++ ) {

      var val = inputParams[ optionalPrams[i] ];

      if( val !== undefined ) {
        if( /^\d+$/.test(val) )
          val = parseInt( val );

        inputParams[ optionalPrams[i] ] = val;
        unresolveInputParam--;
      }
    }
  }

  if( unresolveInputParam > 0 ) {
    result.err = this.error(3);
    return result;
  }

  return inputParams;
};

module.exports.objectSize = function(obj) {
  var size = 0, key;
  for (key in obj) {
    size++;
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
  var msg = Constants.ERROR[errCode];
  if(msg === undefined)
    return msg = Constants.ERROR[999];
  else
    return msg;
};

module.exports.generateInviteCode = function() {
  var result = '';
  for(var i = 0 ; i < Constants.INVITE.CODE_LENGTH ; i++) {
    result += Constants.INVITE.CODE_ALPHABETS.charAt(Math.floor(Math.random() * Constants.INVITE.CODE_ALPHABETS.length));
  }

  return result;
};

module.exports.getBase = function() {
  return path.dirname(require.main.filename);
};
