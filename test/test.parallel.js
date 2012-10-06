var express = require('express')
  , request = require('./support/http')
  , express_partials = require('../');

/* app1: .html files are ejs files */
var app1 = express();
var partials1 = express_partials();
app1.use(partials1);
app1.set('views',__dirname + '/fixtures/ejs')
app1.set('view engine','html')
app1.engine('html',require('ejs').__express)
partials1.register('html','ejs')

app1.get('/',function(req,res,next){
  res.render('index.html',{hello:'world'})
})

/* app2: .html files are jade files */
var app2 = express();
var partials2 = express_partials();
app2.use(partials2);
app2.set('views',__dirname + '/fixtures/jade')
app2.set('view engine','html')
app2.engine('html',require('jade').__express)
partials2.register('html','jade')
app2.get('/',function(req,res,next){
  res.render('index.html',{hello:'world'})
})

describe('app',function(){
  describe('GET app1 /',function(){
    it('should render using ejs',function(done){
      request(app1)
        .get('/')
        .end(function(res){
          res.should.have.status(200);
          res.body.should.equal('<html><head><title>ejs layout</title></head><body><h2>ejs says hello world</h2></body></html>\n');
          done();
        })
    })
  })

  describe('GET app2 /',function(){
    it('should render using Jade',function(done){
      request(app2)
        .get('/')
        .end(function(res){
          res.should.have.status(200);
          res.body.should.equal('<html><head><title>Jade layout</title></head><body><h2>Jade says hello world</h2></body></html>');
          done();
        })
    })
  })

})
