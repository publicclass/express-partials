var express = require('express')
  , request = require('./support/http')
  , partials = require('../');

var app = express();
app.use(partials());
app.set('views',__dirname + '/fixtures')

app.get('/',function(req,res,next){
  res.render('index.ejs')
})

app.get('/no-layout',function(req,res,next){
  res.render('index.ejs',{layout:false})
})

app.get('/mobile',function(req,res,next){
  res.render('index.ejs',{layout:'mobile'})
})

app.get('/mobile.ejs',function(req,res,next){
  res.render('index.ejs',{layout:'mobile.ejs'})
})

app.get('/collection',function(req,res,next){
  res.render('collection.ejs',{list:[{name:'one'},{name:'two'}]})
})

describe('app',function(){
  describe('GET /',function(){
    it('should render with default layout.ejs',function(done){
      request(app)
        .get('/')
        .end(function(res){
          res.should.have.status(200);
          res.body.should.equal('<html><head><title>express-partials</title></head><body><h1>Index</h1></body></html>');
          done();
        })
    })
  })

  describe('GET /no-layout',function(){
    it('should render without layout',function(done){
      request(app)
        .get('/no-layout')
        .end(function(res){
          res.should.have.status(200);
          res.body.should.equal('<h1>Index</h1>');
          done();
        })
    })
  })

  describe('GET /mobile',function(){
    it('should render with mobile.ejs as layout',function(done){
      request(app)
        .get('/mobile')
        .end(function(res){
          res.should.have.status(200);
          res.body.should.equal('<html><head><title>express-partials mobile</title></head><body><h1>Index</h1></body></html>');
          done();
        })
    })
  })

  describe('GET /mobile.ejs',function(){
    it('should render with mobile.ejs as layout',function(done){
      request(app)
        .get('/mobile.ejs')
        .end(function(res){
          res.should.have.status(200);
          res.body.should.equal('<html><head><title>express-partials mobile</title></head><body><h1>Index</h1></body></html>');
          done();
        })
    })
  })
  
})