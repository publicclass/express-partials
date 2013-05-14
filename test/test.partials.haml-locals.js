var app = require('./fixtures/locals/app')
  , request = require('supertest');

describe('app',function(){
  describe('GET /',function(){
    it('should propagate local variables',function(done){
      request(app)
        .get('/')
        .expect(200)
        .expect('<div class="outer">48</div>\n<div class="outer">blue</div>\n<div class="inner">yellow</div>')
        .end(done);
    })
  })
})