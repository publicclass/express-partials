var app = require('./fixtures/chained-views')
  , request = require('supertest');

describe('app',function(){

  describe('chained-views',function(){
    it('should render all three views',function(done){
      request(app)
        .get('/')
        .expect(200)
        .expect('View 1 contents\nView 2 contents\nView 3 contents')
        .end(done)
    })

    it('should render localst in two views',function(done){
      request(app)
        .get('/locals')
        .expect(200)
        .expect('Locals 1 bob\nLocals 2 bob')
        .end(done)
    })
  })

})