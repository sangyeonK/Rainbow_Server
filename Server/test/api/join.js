var port = require('../../server').port,
    superagent = require('superagent'),
    expect = require('expect.js'),
    common = require('../../common/common.js'),
    mysql = require('../../common/mysql.js'),
    user = require('../helper/user.js');
    
describe('JOIN API TEST', function() {    
    var url = 'http://localhost:'+port+'/rainbow/join';
    
    var user1 = new user();
    user1.userId = "join@test.com";
    user1.userName = "test";
    
    it('should join failed ( invalid email address )',function(done){
        superagent
        .post(url)
        .send({ 'userId':'jointest.com','userName':user1.userName,'password':'123qwe' })
        .end(function(err,res){
            expect(res.status).to.equal(500);
            expect(res.body.errorCode).to.equal(10);
            done();
        })            
    });
    it('should join failed ( invalid password #1 - not alphabet )',function(done){
        superagent
        .post(url)
        .send({ 'userId':user1.userId,'userName':user1.userName,'password':'123123123' })
        .end(function(err,res){
            expect(res.status).to.equal(500);
            expect(res.body.errorCode).to.equal(11);
            done();
        })            
    });
    it('should join failed ( invalid password #2 - not numberic )',function(done){
        superagent
        .post(url)
        .send({ 'userId':user1.userId,'userName':user1.userName,'password':'qweasd' })
        .end(function(err,res){
            expect(res.status).to.equal(500);
            expect(res.body.errorCode).to.equal(11);
            done();
        })            
    });
    it('should join failed ( invalid password #3 - below 6 characters )',function(done){
        superagent
        .post(url)
        .send({ 'userId':user1.userId,'userName':user1.userName,'password':'1q2w' })
        .end(function(err,res){
            expect(res.status).to.equal(500);
            expect(res.body.errorCode).to.equal(11);
            done();
        })            
    });
    it('should join succeed',function(done){
        superagent
        .post(url)
        .send({ 'userId':user1.userId,'userName':user1.userName,'password':'123qwe' })
        .end(function(err,res){
            expect(res.status).to.equal(200);
            user1.loadJSON( res.body );
            expect(user1.validate()).equal(true);
            done();
        })            
    });
    it('should join failed ( alreadyJoined )',function(done){
        superagent
        .post(url)
        .send({ 'userId':user1.userId,'userName':user1.userName,'password':'123qwe' })
        .end(function(err,res){
            expect(res.status).to.equal(500);
            expect(res.body.errorCode).to.equal(4);
            done();
        })            
    });

    after('clean up test data', function(done) {
        mysql.getConnection( function (err, conn )
        {
            if( err ) throw err;
            
            var q1 = mysql.makeQuery("delete from Account where UserID in (%s)", user1.userId );
            conn.query( q1, function ( err ) {
                if( err ) throw err;
                
                var q2 = mysql.makeQuery("delete from `Group` where GroupSN in (%d)", user1.group.sn );
                conn.query( q2 , function ( err ) {
                    if( err ) throw err;
                    
                    conn.release();
                    
                    done();
                });
            });
        });
    });
});