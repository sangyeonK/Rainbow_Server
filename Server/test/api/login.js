var port = require('../../server').port,
    superagent = require('superagent'),
    expect = require('expect.js'),
    common = require('../../common/common.js');
    
describe('LOGIN API TEST', function() {
    var join_url = 'http://localhost:'+port+'/rainbow/join';
    var login_url = 'http://localhost:'+port+'/rainbow/login';
    var testID = 'login@test.com';
    var token = '';
    
    it('should join succeed ( or already user )',function(done){
        superagent
        .post(join_url)
        .send({ 'userId':testID,'userName':'테스트','password':'123qwe' })
        .end(function(err,res){
            if(res.status != 200)
            {
                expect(res.status).equal(500);
                expect(res.body.errorCode).equal(4);
            }
            else
                expect(res.status).equal(200);
            
            done();
        })            
    });
    
    it('should login failed ( incorrect password )',function(done){
        superagent
        .post(login_url)
        .send({ 'user_id':testID,'password':'234qwe' })
        .end(function(err,res){
            expect(res.status).to.equal(500);
            expect(res.body.errorCode).to.equal(6);
            done();
        })            
    });
    
    it('should login succeed',function(done){
        superagent
        .post(login_url)
        .send({ 'user_id':testID,'password':'123qwe' })
        .end(function(err,res){
            expect(res.status).equal(200);
            expect(common.objectSize(res.body)).equal(4);
            expect(res.body.token).not.equal(undefined);
            expect(res.body.userId).equal(testID);
            expect(res.body.userName).not.equal(undefined);
            expect(res.body.group).not.equal(undefined);
            
            token = res.body.token;
            done();
        })            
    });
    it('should login succeed ( use token )',function(done){
        superagent
        .post(login_url)
        .set({ 'token':token })
        .end(function(err,res){
            expect(res.status).equal(200);
            expect(common.objectSize(res.body)).equal(4);
            expect(res.body.token).not.equal(undefined);
            expect(res.body.userId).not.equal(undefined);
            expect(res.body.userName).not.equal(undefined);
            expect(res.body.group).not.equal(undefined);
            
            done();
        })            
    });
});