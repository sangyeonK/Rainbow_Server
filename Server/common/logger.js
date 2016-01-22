var winston = require('winston');

          
var logger = new (winston.Logger)({
    transports: [
    
      new (winston.transports.Console)({
        timestamp: function() { return getTodayDateTime(); },
        formatter: function(options) {
            return options.timestamp() +' '+ (undefined !== options.message ? options.message : '');
        } }),
      
      new (winston.transports.File)({ 
        timestamp: function() { return getTodayDateTime(); },
        formatter: function(options) {
            return options.timestamp() +' '+ (undefined !== options.message ? options.message : '');
        },
        filename: './logs/log.log' })
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

module.exports.error = function( str )
{
    logger.error( str );
};

