var app = require('./fixtures/multiple-search-paths/app')
  , request = require('supertest')
  , partials = require('../');

describe('app',function(){
  describe('GET /coffeecup',function(){
    it('should find resolve and render index.coffeecup as a CoffeeCup template with layout.coffeecup as CoffeeCup layout',function(done){
      request(app)
        .get('/coffeecup')
        .expect(200)
        .expect('<html><head><title>CoffeeCup layout</title></head><body><h2>CoffeeCup says hello world</h2></body></html>')
        .end(done)
    })
  })
})
