var port = 80;

var http = require( 'http' ),
    mkdirp = require('mkdirp'),
    winston = require('winston'),
    gateway = require( './gateway.js' );
    
mkdirp('./logs', function(err) { 


});

winston.add(winston.transports.File , {"filename": "./logs/exceptions.log" } );

process.on('uncaughtException', function(err) {
  winston.error(err.message);
});

var server = http.createServer(function (request,response) {

    var data = "";
    
    request.on( 'data' , function( postData ) { data += postData; } );

    request.on( 'end' , function () {
    
        response.writeHead(200, { 'Content-Type': 'application/json;charset=utf-8' } )
        
        gateway( request.url , function( err,result ) {
        
            if( !result )
            {
                if( result == undefined )
                    var result = {};
                
                result.status = 0;
                if( err == null )
                    result.errorMessage = "SERVER_UNKNOWN_ERROR";
                else
                    result.errorMessage = err;
                result.result = {};
            }
            
            response.end( JSON.stringify( result ) );
        });
    });
    
}).listen(port);


console.log( "server start" );