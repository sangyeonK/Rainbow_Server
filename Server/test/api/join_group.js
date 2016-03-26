var port = require('../../server').port,
  superagent = require('superagent'),
  common = require('../../common/common.js'),
  mysql = require('../../common/mysql.js'),
  user = require('../helper/user.js');

describe('JOIN GROUP TEST', function() {
  var join_url = 'http://localhost:'+port+'/rainbow/join';
  var login_url = 'http://localhost:'+port+'/rainbow/login';
  var join_group_url = 'http://localhost:'+port+'/rainbow/join_group';

  var user1 = new user();
  user1.userId = 'joingroup_1@test.com';
  user1.userName = "test1";

  var user2 = new user();
  user2.userId = 'joingroup_2@test.com';
  user2.userName = "test2";

  var user3 = new user();
  user3.userId = 'joingroup_3@test.com';
  user3.userName = "test3";

  it('user1 join',function(done){
    superagent
    .post(join_url)
    .send({ 'userId':user1.userId,'userName':user1.userName,'password':'123qwe' })
    .end(function(err,res){
      expect(res.status).toEqual(200);
      user1.loadJSON( res.body );
      expect(user1.validate()).toEqual(true);
      done();
    });
  });

  it('user2 join',function(done){
    superagent
    .post(join_url)
    .send({ 'userId':user2.userId,'userName':user2.userName,'password':'223qwe' })
    .end(function(err,res){
      expect(res.status).toEqual(200);
      user2.loadJSON( res.body );
      expect(user2.validate()).toEqual(true);
      done();
    });
  });

  it('user3 join',function(done){
    superagent
    .post(join_url)
    .send({ 'userId':user3.userId,'userName':user3.userName,'password':'323qwe' })
    .end(function(err,res){
      expect(res.status).toEqual(200);
      user3.loadJSON( res.body );
      expect(user3.validate()).toEqual(true);
      done();
    });
  });

  it( 'user1 join to the user2 group', function(done){
    superagent
    .post(join_group_url)
    .set({ 'token':user1.token })
    .send({'invite_code':user2.group.inviteCode})
    .end(function(err,res){
      expect(res.status).toEqual(200);
      user1.loadJSON( res.body );
      expect(user1.validate()).toEqual(true);
      done();
    });
  });

  it( 'equal user1 and user2 group', function(){
    expect(user1.group.sn).toEqual(user2.group.sn);
  });


  it( 'user1 cannot duplicate join to the user2 group ', function(done){
    superagent
    .post(join_group_url)
    .set({ 'token':user1.token })
    .send({'invite_code':user2.group.inviteCode})
    .end(function(err,res){
      expect(res.status).toEqual(500);
      done();
    });
  });

  it( 'user3 cannot join to the user1 group', function(done){
    superagent
    .post(join_group_url)
    .set({ 'token':user3.token })
    .send({'invite_code':user1.group.inviteCode})
    .end(function(err,res){
      expect(res.status).toEqual(500);
      done();
    });
  });

  it( 'user3 cannot join to the user2 group', function(done){
    superagent
    .post(join_group_url)
    .set({ 'token':user3.token })
    .send({'invite_code':user2.group.inviteCode})
    .end(function(err,res){
      expect(res.status).toEqual(500);
      done();
    });
  });

  it( 'user1 cannot join to the user3 group', function(done){
    superagent
    .post(join_group_url)
    .set({ 'token':user1.token })
    .send({'invite_code':user3.group.inviteCode})
    .end(function(err,res){
      expect(res.status).toEqual(500);
      done();
    });
  });

  it( 'user2 cannot join to the user3 group', function(done){
    superagent
    .post(join_group_url)
    .set({ 'token':user2.token })
    .send({'invite_code':user3.group.inviteCode})
    .end(function(err,res){
      expect(res.status).toEqual(500);
      done();
    });
  });

  afterAll(function(done) {
    mysql.getConnection( function (err, conn )
    {
      if( err ) throw err;
      var q1 = mysql.makeQuery("delete from Account where UserID in (%s,%s,%s)", user1.userId, user2.userId, user3.userId );
      conn.query( q1, function ( err ) {
        if( err ) throw err;
        var q2 = mysql.makeQuery("delete from `Group` where GroupSN in (%d,%d,%d)", user1.group.sn, user2.group.sn, user3.group.sn );
        conn.query( q2 , function ( err ) {
          if( err ) throw err;
          conn.release();
          done();
        });
      });
    });
  });

});
