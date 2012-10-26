var app = require('./fixtures/basic/app')
  , request = require('supertest');

describe('app',function(){
  describe('GET /',function(){
    it('should render with default layout.ejs',function(done){
      request(app)
        .get('/')
        .expect(200)
        .expect('<html><head><title>express-partials</title></head><body><h1>Index</h1></body></html>')
        .end(done);
    })
  })

  describe('GET /no-layout',function(){
    it('should render without layout',function(done){
      request(app)
        .get('/no-layout')
        .expect(200)
        .expect('<h1>Index</h1>')
        .end(done)
    })
  })

  describe('GET /res-locals',function(){
    it('should render "here"',function(done){
      request(app)
        .get('/res-locals')
        .expect(200)
        .expect('<html><head><title>express-partials</title></head><body><h1>here</h1></body></html>')
        .end(done)
    })
  })

  describe('GET /app-locals',function(){
    it('should render "there"',function(done){
      request(app)
        .get('/app-locals')
        .expect(200)
        .expect('<html><head><title>express-partials</title></head><body><h1>there</h1></body></html>')
        .end(done)
    })
  })

  describe('GET /mobile',function(){
    it('should render with mobile.ejs as layout',function(done){
      request(app)
        .get('/mobile')
        .expect(200)
        .expect('<html><head><title>express-partials mobile</title></head><body><h1>Index</h1></body></html>')
        .end(done)
    })
  })

  describe('GET /mobile.ejs',function(){
    it('should render with mobile.ejs as layout',function(done){
      request(app)
        .get('/mobile.ejs')
        .expect(200)
        .expect('<html><head><title>express-partials mobile</title></head><body><h1>Index</h1></body></html>')
        .end(done)
    })
  })

  describe('GET /collection/_entry',function(){
    it('should render _entry.ejs for every item with layout.ejs as layout',function(done){
      request(app)
        .get('/collection/_entry')
        .expect(200)
        .expect('<html><head><title>express-partials</title></head><body><ul><li>one</li><li>two</li></ul></body></html>')
        .end(done)
    })
  })

  describe('GET /collection/thing',function(){
    it('should render thing/index.ejs for every item with layout.ejs as layout',function(done){
      request(app)
        .get('/collection/thing')
        .expect(200)
        .expect('<html><head><title>express-partials</title></head><body><ul><li>one</li><li>two</li></ul></body></html>')
        .end(done)
    })
  })
  
  describe('GET /another-layout',function(){
    it('should render with another-layout.ejs (which is inside layouts subdir) as layout',function(done){
      request(app)
        .get('/another-layout')
        .end(function(res){
          res.should.have.status(200);
          res.body.should.equal('<html><head><title>express-partials layout subdir</title></head><body><h1>Index</h1></body></html>');
          done();
        })
    })
  })

  describe('GET /another-layout.ejs',function(){
    it('should render with another-layout.ejs (which is inside layouts subdir) as layout',function(done){
      request(app)
        .get('/another-layout.ejs')
        .end(function(res){
          res.should.have.status(200);
          res.body.should.equal('<html><head><title>express-partials layout subdir</title></head><body><h1>Index</h1></body></html>');
          done();
        })
    })
  })
})
