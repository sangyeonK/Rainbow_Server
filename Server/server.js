var port = 80;

var mkdirp = require('mkdirp');
var winston = require('winston');
var bodyParser = require('body-parser');
var compression = require('compression');
var express = require('express');
var configure = require('./common/configure.js');

var app = express();

mkdirp('./logs', function(err) { });



app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(compression());

//----- load config ----- //

configure.loadConfig("mysql","mysql.json");
app.set('port', port);

//----- api route list ----- //
app.get('/rainbow/join', require( './routes/rainbow/join.js' ) );
app.post('/rainbow/join', require( './routes/rainbow/join.js' ) );

app.get('/rainbow/login', require( './routes/rainbow/login.js' ) );
app.post('/rainbow/login', require( './routes/rainbow/login.js' ) );

app.get('/rainbow/join_group', require( './routes/rainbow/join_group.js' ) );
app.post('/rainbow/join_group', require( './routes/rainbow/join_group.js' ) );

app.get('/rainbow/insert_bill', require( './routes/rainbow/insert_bill.js' ) );
app.post('/rainbow/insert_bill', require( './routes/rainbow/insert_bill.js' ) );

app.get('/rainbow/view_bills', require( './routes/rainbow/view_bills.js' ) );
app.post('/rainbow/view_bills', require( './routes/rainbow/view_bills.js' ) );

app.get('/rainbow/view_bills_range', require( './routes/rainbow/view_bills_range.js' ) );
app.post('/rainbow/view_bills_range', require( './routes/rainbow/view_bills_range.js' ) );
//----- api route list ----- //

function boot() {
    app.listen(app.get('port'), function(){
        console.info('[' + configure.env + ']Express server listening on port ' + app.get('port'));
    });
}

if (require.main === module) {
    boot();
}
else {
    console.info('[' + configure.env + ']Running app as a module');
    
    module.exports.boot = boot;
    module.exports.port = app.get('port');
}