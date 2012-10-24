var app = require('./fixtures/register/app')
  , request = require('supertest')
  , partials = require('../');

describe('app',function(){

  describe('GET /register',function(){
    it('should render index.j as a Jade template with layout.j as Jade layout (register: function)',function(done){
      partials.register('.j',require('jade').render);
      request(app)
        .get('/register')
        .expect(200)
        .expect('<html><head><title>Jade layout</title></head><body><h2>Jade says hello world</h2></body></html>')
        .end(done)
    })

    it('should render index.j as a Jade template with layout.j as Jade layout (register: module)',function(done){
      partials.register('.j',require('jade'));
      request(app)
        .get('/register')
        .expect(200)
        .expect('<html><head><title>Jade layout</title></head><body><h2>Jade says hello world</h2></body></html>')
        .end(done)
    })

    it('should render index.j as a Jade template with layout.j as Jade layout (register: name)',function(done){
      partials.register('.j','jade');
      request(app)
        .get('/register')
        .expect(200)
        .expect('<html><head><title>Jade layout</title></head><body><h2>Jade says hello world</h2></body></html>')
        .end(done)
    })
  })

  describe('GET /register/no-layout',function(){
    it('should render index.j as a Jade template (using only Express 3.x)',function(done){
      partials.register('.j',{});
      request(app)
        .get('/register/no-layout')
        .expect(200)
        .expect('<h2>Jade says hello world</h2>')
        .end(done)
    })
  })

  describe('GET /eco',function(){
    it('should render index.eco as a Eco template with layout.eco as Eco layout',function(done){
      request(app)
        .get('/eco')
        .expect(200)
        .expect('<html><head><title>Eco layout</title></head><body><h2>Eco says hello world</h2>\n</body></html>\n')
        .end(done)
    })
  })

  describe('GET /coffeecup',function(){
    it('should render index.coffeecup as a CoffeeCup template with layout.coffeecup as CoffeeCup layout',function(done){
      request(app)
        .get('/coffeecup')
        .expect(200)
        .expect('<html><head><title>CoffeeCup layout</title></head><body><h2>CoffeeCup says hello world</h2></body></html>')
        .end(done)
    })
  })

})
