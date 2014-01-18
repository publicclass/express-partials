var app = require('./fixtures/default-layout')
  , request = require('supertest');

describe('app',function(){

  describe('default-layout',function(){
    it('should render default layout',function(done){
      request(app)
        .get('/1')
        .expect(200)
        .expect('Layout 1\nView')
        .end(done)
    })

    it('should render specific layout',function(done){
      request(app)
        .get('/2')
        .expect(200)
        .expect('Layout 2\nView')
        .end(done)
    })
  })

})