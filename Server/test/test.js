'use strict'

var boot = require('../server').boot,
    port = require('../server').port,
    superagent = require('superagent'),
    expect = require('expect.js');
    
describe('server', function() {
    before(function () {
        boot();
    });
    
    describe('homepage', function() {
        it('should respond to GET',function(done){
            superagent
            .get('http://localhost:'+port)
            .end(function(res){
                expect(res.status).to.equal(200);
                done();
            });
        });
    });
});