var port = require('../../server').port,
  superagent = require('superagent'),
  common = require('../../common/common.js'),
  mysql = require('../../common/mysql.js'),
  user = require('../helper/user.js');

describe('LOGIN API TEST', function() {
  var join_url = 'http://localhost:'+port+'/rainbow/join';
  var login_url = 'http://localhost:'+port+'/rainbow/login';
  var user1_ID = "login@test.com";

  var user1 = new user();
  user1.userId = user1_ID;
  user1.userName = "test";

  it('join succeed',function(done){
    superagent
    .post(join_url)
    .send({ 'userId':user1.userId,'userName':user1.userName,'password':'123qwe' })
    .end(function(err,res){
      expect(res.status).toEqual(200);
      user1.loadJSON( res.body );
      expect(user1.validate()).toEqual(true);
      done();
    })
  });

  it('login failed ( incorrect password )',function(done){
    superagent
    .post(login_url)
    .send({ 'user_id':user1.userId,'password':'234qwe' })
    .end(function(err,res){
      expect(res.status).toEqual(500);
      expect(res.body.errorCode).toEqual(6);
      done();
    })
  });

  it('should login succeed',function(done){
    superagent
    .post(login_url)
    .send({ 'user_id':user1.userId,'password':'123qwe' })
    .end(function(err,res){
      expect(res.status).toEqual(200);
      user1.loadJSON( res.body );
      expect(user1.validate()).toEqual(true);
      done();
    })
  });

  it('should login succeed ( use token )',function(done){
    superagent
    .post(login_url)
    .set({ 'token':user1.token })
    .end(function(err,res){
      expect(res.status).toEqual(200);
      user1.loadJSON( res.body );
      expect(user1.validate()).toEqual(true);
      done();
    })
  });

  afterAll(function(done) {
    mysql.getConnection( function (err, conn ) {
      if( err ) throw err;
      var q1 = mysql.makeQuery( 'call spClearTestUserData(%s)', user1_ID );
      conn.query( q1, function ( err ) {
        if( err ) throw err;
        done();
      });
    });
  });

});
