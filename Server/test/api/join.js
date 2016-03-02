var port = require('../server').port,
    superagent = require('superagent'),
    expect = require('expect.js');
    
describe('server', function() {
    describe('homepage', function() {
        it('should respond to GET',function(done){
            superagent
            .get('http://localhost:'+port)
            .end(function(res){
                expect(res.status).to.equal(404);
                done();
            });
        });
    });
});