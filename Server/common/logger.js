var winston = require('winston');

var logger_error = new winston.Logger({
  level:"error",
  transports: [
    new winston.transports.Console({
      timestamp: Date.now(),
      json:true,
    }),
    new winston.transports.File({
      timestamp: Date.now(),
      filename: './logs/error.log'
    })
  ],
  exceptionHandlers: [
    new winston.transports.Console({
      timestamp: Date.now(),
      json:true
    }),
    new winston.transports.File({
      timestamp: Date.now(),
      filename: './logs/exceptions.log'
    })
  ]
});

var logger_info = new winston.Logger({
  level:"info",
  transports: [
    new winston.transports.Console({
      timestamp: Date.now(),
      json:true,
    }),
    new winston.transports.File({
      timestamp: Date.now(),
      filename: './logs/info.log'
    })
  ]
});

var logger_debug = new winston.Logger({
  level:"debug",
  transports: [
    new winston.transports.Console({
      timestamp: Date.now(),
      json:true,
    }),
    new winston.transports.File({
      timestamp: Date.now(),
      filename: './logs/debug.log'
    })
  ]
});

function getTodayDateTime(){
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; //January is 0!

  var hour = ((today.getHours() < 10)?"0":"") + today.getHours();
  var min = ((today.getMinutes() < 10)?"0":"") + today.getMinutes();
  var sec = ((today.getSeconds() < 10)?"0":"") + today.getSeconds();
  var yyyy = today.getFullYear();
  if(dd<10){
      dd='0'+dd
  }
  if(mm<10){
      mm='0'+mm
  }
  return today = yyyy+'/'+mm+'/'+dd+' '+hour+':'+min+':'+sec;
}

module.exports.error = function( str, metadata )
{
  if( metadata === undefined )
      metadata = {};

  logger_error.error( str , metadata);
};

module.exports.info = function( str, metadata )
{
  if( metadata === undefined )
      metadata = {};

  logger_info.info( str , metadata);
};

module.exports.debug = function( str, metadata )
{
  if( metadata === undefined )
      metadata = {};

  logger_debug.debug( str , metadata);
};
