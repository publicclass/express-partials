var app = require('./fixtures/register/app')
  , request = require('./support/http');

describe('app',function(){

  describe('chained-views',function(){
    it('should render all three views',function(done){
      request(require('./fixtures/chained-views'))
        .get('/')
        .end(function(res){
          res.should.have.status(200);
          res.body.should.equal('View 1 contents\nView 2 contents\nView 3 contents')
          done()
        })
    })
  })

})