var port = require('../../server').port,
  superagent = require('superagent'),
  common = require('../../common/common.js'),
  mysql = require('../../common/mysql.js'),
  user = require('../helper/user.js');

describe('bills test', function() {
  var join_url = 'http://localhost:' + port + '/rainbow/join';
  var join_group_url = 'http://localhost:' + port + '/rainbow/join_group';
  var insert_bill_url = 'http://localhost:' + port + '/rainbow/insert_bill';
  var view_bills_url = 'http://localhost:' + port + '/rainbow/view_bills';
  var view_bills_range_url = 'http://localhost:' + port + '/rainbow/view_bills_range';

  var user1_ID = 'billtester_1@test.com';
  var user2_ID = 'billtester_2@test.com';

  var user1 = new user();
  user1.userId = user1_ID;
  user1.userName = "test1";

  var user2 = new user();
  user2.userId = user2_ID;
  user2.userName = "test2";

  describe('- initialization', function() {
    it('user1 join',function(done) {
      superagent
      .post(join_url)
      .send({ 'userId':user1.userId,'userName':user1.userName,'password':'123qwe' })
      .end(function(err,res) {
        expect(res.status).toEqual(200);
        user1.loadJSON( res.body );
        expect(user1.validate()).toEqual(true);
        done();
      });
    });

    it('user2 join',function(done) {
      superagent
      .post(join_url)
      .send({ 'userId':user2.userId,'userName':user2.userName,'password':'223qwe' })
      .end(function(err,res) {
        expect(res.status).toEqual(200);
        user2.loadJSON( res.body );
        expect(user2.validate()).toEqual(true);
        done();
      });
    });

    it('user1 join to the user2 group', function(done) {
      superagent
      .post(join_group_url)
      .set({ 'token':user1.token })
      .send({'invite_code':user2.group.inviteCode})
      .end(function(err,res) {
        expect(res.status).toEqual(200);
        user1.loadJSON( res.body );
        expect(user1.validate()).toEqual(true);
        done();
      });
    });

    it('equal user1 and user2 group', function() {
      expect(user1.group.sn).toEqual(user2.group.sn);
    });

    it('user1 insert bill data', function(done) {
      var doneCnt = 0;
      for(var i=0; i < 40; i++) {
        var sendData;
        if( i < 10 ) sendData = {year:2015,month:12,day:31,category:"test",amount:5000,comment:"test"};
        else if( i < 20 ) sendData = {year:2016,month:1,day:1,category:"test",amount:5000,comment:"test"};
        else if( i < 30 ) sendData = {year:2016,month:2,day:1,category:"test",amount:5000,comment:"test"};
        else if( i < 40 ) sendData = {year:2016,month:2,day:15,category:"test",amount:5000,comment:"test"};
        superagent
        .post(insert_bill_url)
        .set({ 'token':user1.token })
        .send(sendData)
        .end(function(err,res) {
          expect(res.status).toEqual(200);
          if(++doneCnt == 40)
            done();
        });
      }
    });

    it('user2 insert bill data', function(done) {
      var doneCnt = 0;
      for(var i=0; i < 60; i++) {
        var sendData;
        if( i < 15 ) sendData = {year:2015,month:12,day:31,category:"test",amount:5000,comment:"test"};
        else if( i < 30 ) sendData = {year:2016,month:1,day:2,category:"test",amount:5000,comment:"test"};
        else if( i < 45 ) sendData = {year:2016,month:2,day:1,category:"test",amount:5000,comment:"test"};
        else if( i < 60 ) sendData = {year:2016,month:2,day:16,category:"test",amount:5000,comment:"test"};
        superagent
        .post(insert_bill_url)
        .set({ 'token':user2.token })
        .send(sendData)
        .end(function(err,res) {
          expect(res.status).toEqual(200);
          if(++doneCnt == 60)
            done();
        });
      }
    });
  })
  describe('- check bills for user1', function() {
    it( 'check My Data', function(done) {
      var checkedCnt = 0;
      var checklist = [ {sendData:{year:2015,ownerType:"MINE"},expectCount:10},
                      {sendData:{year:2016,ownerType:"MINE"},expectCount:30},
                      {sendData:{year:2016,month:2,ownerType:"MINE"},expectCount:20},
                      {sendData:{year:2016,month:2,day:15,ownerType:"MINE"},expectCount:10} ];
      checklist.forEach( function( data ) {
        superagent
        .post(view_bills_url)
        .set({ 'token':user1.token })
        .send(data.sendData)
        .end(function(err,res) {
          expect(res.status).toEqual(200);
          expect(res.body.length).toEqual(data.expectCount);
          if(++checkedCnt == checklist.length)
            done();
        });
      });
    });

    it( 'check Partner Data', function(done) {
      var checkedCnt = 0;
      var checklist = [ {sendData:{year:2015,ownerType:"PARTNER"},expectCount:15},
                      {sendData:{year:2016,ownerType:"PARTNER"},expectCount:45},
                      {sendData:{year:2016,month:2,ownerType:"PARTNER"},expectCount:30},
                      {sendData:{year:2016,month:2,day:15,ownerType:"PARTNER"},expectCount:0} ];
      checklist.forEach( function( data ) {
        superagent
        .post(view_bills_url)
        .set({ 'token':user1.token })
        .send(data.sendData)
        .end(function(err,res) {
          expect(res.status).toEqual(200);
          expect(res.body.length).toEqual(data.expectCount);
          if(++checkedCnt == checklist.length)
            done();
          });
        });
    });

    it( 'check Our Data', function(done) {
      var checkedCnt = 0;
      var checklist = [ {sendData:{year:2015,ownerType:"ALL"},expectCount:25},
                      {sendData:{year:2016,ownerType:"ALL"},expectCount:75},
                      {sendData:{year:2016,month:2,ownerType:"ALL"},expectCount:50},
                      {sendData:{year:2016,month:2,day:15,ownerType:"ALL"},expectCount:10} ];
      checklist.forEach( function( data ) {
        superagent
        .post(view_bills_url)
        .set({ 'token':user1.token })
        .send(data.sendData)
        .end(function(err,res) {
          expect(res.status).toEqual(200);
          expect(res.body.length).toEqual(data.expectCount);
          if(++checkedCnt == checklist.length)
            done();
        });
      });
    });
  });

  describe('- check bills for user2', function() {
    it( 'check My Data', function(done) {
      var checkedCnt = 0;
      var checklist = [ {sendData:{year:2015,ownerType:"MINE"},expectCount:15},
                        {sendData:{year:2016,ownerType:"MINE"},expectCount:45},
                        {sendData:{year:2016,month:2,ownerType:"MINE"},expectCount:30},
                        {sendData:{year:2016,month:2,day:16,ownerType:"MINE"},expectCount:15} ];
      checklist.forEach( function( data ) {
        superagent
        .post(view_bills_url)
        .set({ 'token':user2.token })
        .send(data.sendData)
        .end(function(err,res) {
          expect(res.status).toEqual(200);
          expect(res.body.length).toEqual(data.expectCount);
          if(++checkedCnt == checklist.length)
            done();
        });
      });
    });

    it( 'check Partner Data', function(done) {
      var checkedCnt = 0;
      var checklist = [ {sendData:{year:2015,ownerType:"PARTNER"},expectCount:10},
                        {sendData:{year:2016,ownerType:"PARTNER"},expectCount:30},
                        {sendData:{year:2016,month:2,ownerType:"PARTNER"},expectCount:20},
                        {sendData:{year:2016,month:2,day:16,ownerType:"PARTNER"},expectCount:0} ];
      checklist.forEach( function( data ) {
        superagent
        .post(view_bills_url)
        .set({ 'token':user2.token })
        .send(data.sendData)
        .end(function(err,res) {
          expect(res.status).toEqual(200);
          expect(res.body.length).toEqual(data.expectCount);
          if(++checkedCnt == checklist.length)
            done();
        });
      });
    });

    it( 'check Our Data', function(done) {
      var checkedCnt = 0;
      var checklist = [ {sendData:{year:2015,ownerType:"ALL"},expectCount:25},
                        {sendData:{year:2016,ownerType:"ALL"},expectCount:75},
                        {sendData:{year:2016,month:2,ownerType:"ALL"},expectCount:50},
                        {sendData:{year:2016,month:2,day:16,ownerType:"ALL"},expectCount:15} ];
      checklist.forEach( function( data ) {
        superagent
        .post(view_bills_url)
        .set({ 'token':user2.token })
        .send(data.sendData)
        .end(function(err,res) {
          expect(res.status).toEqual(200);
          expect(res.body.length).toEqual(data.expectCount);
          if(++checkedCnt == checklist.length)
            done();
        });
      });
    });
  });

  afterAll(function(done) {
    mysql.getConnection( function (err, conn ) {
      if( err ) throw err;
      var q1 = mysql.makeQuery( 'call spClearTestUserData(%s)', user1_ID );
      conn.query( q1, function ( err ) {
        if( err ) throw err;
        var q2 = mysql.makeQuery( 'call spClearTestUserData(%s)', user2_ID );
        conn.query( q2, function ( err ) {
          if( err ) throw err;
          done();
        });
      });
    });
  });
});
