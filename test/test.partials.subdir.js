var app = require('./fixtures/subdir/app')
  , request = require('supertest');

describe('app',function(){

  describe('GET /subdir',function() {
    it('should render index.ejs with layout.ejs (both inside subdir)', function(done) {
      request(app)
        .get('/subdir')
        .expect(200)
        .expect('<html><title>subdir layout</title><body><h2>Hello World</h2></body></html>')
        .end(done)
    })
  })

  describe('GET /subdir-explicit',function() {
    it('should render index.ejs with layout.ejs (both inside subdir) when layout is specified in locals', function(done) {
      request(app)
        .get('/subdir-explicit')
        .expect(200)
        .expect('<html><title>subdir layout</title><body><h2>Hello World</h2></body></html>')
        .end(done)
    })
  })
  
  describe('GET /subdir-a-view',function() {
    it('should render a-view.ejs with layout.ejs (both inside subdir)', function(done) {
      request(app)
        .get('/subdir-a-view')
        .expect(200)
        .expect('<html><title>subdir layout</title><body><h2>A view</h2></body></html>')
        .end(done)
    })
  })

  describe('GET /subdir-a-layout',function() {
    it('should render a-view.ejs (inside subdir) with layout.ejs (inside subdir/dir)', function(done) {
      request(app)
        .get('/subdir-a-layout')
        .expect(200)
        .expect('<html><title>A layout</title><body><h2>A view</h2></body></html>')
        .end(done)
    })
  })
  
  describe.skip('GET /subdir-aView',function() {
    it('should render a-view.ejs with layout.ejs (both inside subdir)', function(done) {
      request(app)
        .get('/subdir-aView')
        .expect(200)
        .expect('<html><title>subdir layout</title><body><h2>A view</h2></body></html>')
        .end(done)
    })
  })

})