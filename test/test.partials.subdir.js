var app = require('./fixtures/subdir/app')
  , request = require('./support/http');

describe('app',function(){

  describe('GET /subdir',function() {
    it('should render index.ejs with layout.ejs (both inside subdir)', function(done) {
      request(app)
        .get('/subdir')
        .end(function(res) {
          res.should.have.status(200);
          res.body.should.equal('<html><title>subdir layout</title><body><h2>Hello World</h2></body></html>');
          done();
        })
    })
  })

  describe('GET /subdir-explicit',function() {
    it('should render index.ejs with layout.ejs (both inside subdir) when layout is specified in locals', function(done) {
      request(app)
        .get('/subdir-explicit')
        .end(function(res) {
          res.should.have.status(200);
          res.body.should.equal('<html><title>subdir layout</title><body><h2>Hello World</h2></body></html>');
          done();
        })
    })
  })
  
  describe('GET /subdir-a-view',function() {
    it('should render a-view.ejs with layout.ejs (both inside subdir)', function(done) {
      request(app)
        .get('/subdir-a-view')
        .end(function(res) {
          res.should.have.status(200);
          res.body.should.equal('<html><title>subdir layout</title><body><h2>A view</h2></body></html>');
          done();
        })
    })
  })
  
  describe.skip('GET /subdir-aView',function() {
    it('should render a-view.ejs with layout.ejs (both inside subdir)', function(done) {
      request(app)
        .get('/subdir-aView')
        .end(function(res) {
          res.should.have.status(200);
          res.body.should.equal('<html><title>subdir layout</title><body><h2>A view</h2></body></html>');
          done();
        })
    })
  })
  
  describe('GET /layout-subdir',function() {
    it('should render index.ejs with layout.ejs, with index.ejx inside subdir and layout.ejs inside subdir/layouts', function(done) {
      request(app)
        .get('/layout-subdir')
        .end(function(res) {
          res.should.have.status(200);
          res.body.should.equal('<html><title>layout subdir</title><body><h2>Hello World</h2></body></html>');
          done();
        })
    })
  })
  
  describe('GET /layout-subdir.ejs',function() {
    it('should render index.ejs with layout.ejs, with index.ejx inside subdir and layout.ejs inside subdir/layouts', function(done) {
      request(app)
        .get('/layout-subdir.ejs')
        .end(function(res) {
          res.should.have.status(200);
          res.body.should.equal('<html><title>layout subdir</title><body><h2>Hello World</h2></body></html>');
          done();
        })
    })
  })
  
})