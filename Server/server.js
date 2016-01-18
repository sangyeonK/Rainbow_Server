var port = 80;

var mkdirp = require('mkdirp');
var winston = require('winston');
var bodyParser = require('body-parser');
var express = require('express');
    
var app = express();

mkdirp('./logs', function(err) { 


});

winston.add(winston.transports.File , {"filename": "./logs/exceptions.log" } );

process.on('uncaughtException', function(err) {
  winston.error(err.message);
});


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//----- api route list ----- //
app.get('/rainbow/join', require( './routes/rainbow/join.js' ) );
app.post('/rainbow/join', require( './routes/rainbow/join.js' ) );
//----- api route list ----- //

app.listen(port, function () {
  console.log('server start');
});