var port = require('../../server').port,
    superagent = require('superagent'),
    expect = require('expect.js');
    
describe('JOIN API TEST', function() {
    
    var url = 'http://localhost:'+port+'/rainbow/join';
    var testID = 'test@test.com';
    

    it('should join failed ( invalid email address )',function(done){
        superagent
        .post(url)
        .send({ 'userId':testID,'userName':'테스트','password':'123qwe' })
        .end(function(err,res){
            expect(res.status).to.equal(500);
            expect(res.body.errorCode).to.equal(10);
            done();
        })            
    });
    it('should join failed ( invalid password #1 - not alphabet )',function(done){
        superagent
        .post(url)
        .send({ 'userId':testID,'userName':'테스트','password':'123123123' })
        .end(function(err,res){
            expect(res.status).to.equal(500);
            expect(res.body.errorCode).to.equal(11);
            done();
        })            
    });
    it('should join failed ( invalid password #2 - not numberic )',function(done){
        superagent
        .post(url)
        .send({ 'userId':testID,'userName':'테스트','password':'qweasd' })
        .end(function(err,res){
            expect(res.status).to.equal(500);
            expect(res.body.errorCode).to.equal(11);
            done();
        })            
    });
    it('should join failed ( invalid password #3 - below 6 characters )',function(done){
        superagent
        .post(url)
        .send({ 'userId':testID,'userName':'테스트','password':'1q2w' })
        .end(function(err,res){
            expect(res.status).to.equal(500);
            expect(res.body.errorCode).to.equal(11);
            done();
        })            
    });
    it('should join succeed',function(done){
        superagent
        .post(url)
        .send({ 'userId':testID,'userName':'테스트','password':'123qwe' })
        .end(function(err,res){
            expect(res.status).to.equal(200);
            done();
        })            
    });
    it('should join failed ( alreadyJoined )',function(done){
        superagent
        .post(url)
        .send({ 'userId':testID,'userName':'테스트','password':'123qwe' })
        .end(function(err,res){
            expect(res.status).to.equal(500);
            expect(res.body.errorCode).to.equal(4);
            done();
        })            
    });

});