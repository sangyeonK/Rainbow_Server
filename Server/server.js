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
  winston.error(err);
});


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//----- api route list ----- //
app.get('/rainbow/join', require( './routes/rainbow/join.js' ) );
app.post('/rainbow/join', require( './routes/rainbow/join.js' ) );

app.get('/rainbow/login', require( './routes/rainbow/login.js' ) );
app.post('/rainbow/login', require( './routes/rainbow/login.js' ) );

app.get('/rainbow/show_group', require( './routes/rainbow/show_group.js' ) );
app.post('/rainbow/show_group', require( './routes/rainbow/show_group.js' ) );

app.get('/rainbow/join_group', require( './routes/rainbow/join_group.js' ) );
app.post('/rainbow/join_group', require( './routes/rainbow/join_group.js' ) );

app.get('/rainbow/create_group', require( './routes/rainbow/create_group.js' ) );
app.post('/rainbow/create_group', require( './routes/rainbow/create_group.js' ) );

app.get('/rainbow/invite_group', require( './routes/rainbow/invite_group.js' ) );
app.post('/rainbow/invite_group', require( './routes/rainbow/invite_group.js' ) );

app.get('/rainbow/accept_group', require( './routes/rainbow/accept_group.js' ) );
app.post('/rainbow/accept_group', require( './routes/rainbow/accept_group.js' ) );

app.get('/rainbow/reject_group', require( './routes/rainbow/reject_group.js' ) );
app.post('/rainbow/reject_group', require( './routes/rainbow/reject_group.js' ) );

app.get('/rainbow/insert_bill', require( './routes/rainbow/insert_bill.js' ) );
app.post('/rainbow/insert_bill', require( './routes/rainbow/insert_bill.js' ) );

app.get('/rainbow/view_bills', require( './routes/rainbow/view_bills.js' ) );
app.post('/rainbow/view_bills', require( './routes/rainbow/view_bills.js' ) );

app.get('/rainbow/view_bills2', require( './routes/rainbow/view_bills2.js' ) );
app.post('/rainbow/view_bills2', require( './routes/rainbow/view_bills2.js' ) );

app.get('/rainbow/view_bills_month', require( './routes/rainbow/view_bills_month.js' ) );
app.post('/rainbow/view_bills_month', require( './routes/rainbow/view_bills_month.js' ) );

app.get('/rainbow/view_bills_year', require( './routes/rainbow/view_bills_year.js' ) );
app.post('/rainbow/view_bills_year', require( './routes/rainbow/view_bills_year.js' ) );
//----- api route list ----- //

app.listen(port, function () {
  console.log('server start');
});