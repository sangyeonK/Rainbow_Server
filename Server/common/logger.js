var winston = require('winston');

          
var logger = new (winston.Logger)({
    transports: [
    
      new (winston.transports.Console)({
            timestamp:getTodayDateTime,
            json:true,
         }),
      
      new (winston.transports.File)({ 
            timestamp:getTodayDateTime,
            name: 'log-error',
            filename: './logs/error.log',
            level:'error' }),
      new (winston.transports.File)({
            timestamp:getTodayDateTime,
            name: 'log-info',
            filename: './logs/info.log',
            level:'info' }),
      new (winston.transports.File)({
            timestamp:getTodayDateTime,
            name: 'log-debug',
            filename: './logs/debug.log',
            level:'debug' }),
        
    ],
    exceptionHandlers: [
      new winston.transports.Console({ timestamp:getTodayDateTime, formatter:function(options) { return options.meta.stack.join("\n"); } }),
      new winston.transports.File({ timestamp:getTodayDateTime, filename: './logs/exceptions.log' })
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
    
    logger.error( str , metadata);
};

module.exports.info = function( str, metadata )
{
    if( metadata === undefined )
        metadata = {};
    
    logger.info( str , metadata);
};

module.exports.debug = function( str, metadata )
{
    if( metadata === undefined )
        metadata = {};
    
    logger.debug( str , metadata);
};