var express = require('express')
  , request = require('./support/http')
  , partials = require('../');

var app = express();
app.use(partials());
app.set('views',__dirname + '/fixtures')

app.locals.use(function(req,res){
  app.locals.hello = 'there';
})

app.get('/',function(req,res,next){
  res.render('index.ejs')
})

app.get('/no-layout',function(req,res,next){
  res.render('index.ejs',{layout:false})
})

app.get('/res-locals',function(req,res,next){
  res.render('locals.ejs',{hello:'here'})
})

app.get('/app-locals',function(req,res,next){
  res.render('locals.ejs')
})

app.get('/mobile',function(req,res,next){
  res.render('index.ejs',{layout:'mobile'})
})

app.get('/mobile.ejs',function(req,res,next){
  res.render('index.ejs',{layout:'mobile.ejs'})
})

app.get('/collection/_entry',function(req,res,next){
  res.render('collection.ejs',{name: 'entry', list:[{name:'one'},{name:'two'}]})
})

app.get('/collection/thing',function(req,res,next){
  res.render('collection.ejs',{name: 'thing', list:[{name:'one'},{name:'two'}]})
})

app.get('/subdir',function(req,res,next){
  res.render('subdir/index.ejs')
})

app.get('/subdir-explicit',function(req,res,next){
  res.render('subdir/index.ejs', {layout: 'subdir/layout.ejs', list:[{name:'one'},{name:'two'}]})
})


/* Use `register` to substitute the file extension. */
app.engine('.j',require('jade').__express);
app.get('/register/no-layout',function(req,res,next){
  res.render('index.j',{hello:'world',layout:false})
})

app.get('/register',function(req,res,next){
  res.render('index.j',{hello:'world'})
})

/* Eco is supported by consolidate. Tell Express 3.x
 * to use that.
 * express-partials uses Eco's render() automatically.
 */
app.engine('.eco',require('consolidate').eco);
app.get('/eco',function(req,res,next){
  res.render('index.eco',{hello:'world'})
})

/* CoffeeCup doesn't support Express 3.x yet, and isn't
 * handled by consolidate either. We provide our own
 * renderFile() implementation.
 * express-partials uses CoffeeCup's render() automatically.
 */
app.engine('.coffeecup',function(path,options,callback) {
  callback(null,require('coffeecup').render(require('fs').readFileSync(path,'utf8'),options));
});
app.get('/coffeecup',function(req,res,next){
  res.render('index.coffeecup',{hello:'world'})
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

  describe('GET /res-locals',function(){
    it('should render "here"',function(done){
      request(app)
        .get('/res-locals')
        .end(function(res){
          res.should.have.status(200);
          res.body.should.equal('<html><head><title>express-partials</title></head><body><h1>here</h1></body></html>');
          done();
        })
    })
  })

  describe('GET /app-locals',function(){
    it('should render "there"',function(done){
      request(app)
        .get('/app-locals')
        .end(function(res){
          res.should.have.status(200);
          res.body.should.equal('<html><head><title>express-partials</title></head><body><h1>there</h1></body></html>');
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

  describe('GET /collection/_entry',function(){
    it('should render _entry.ejs for every item with layout.ejs as layout',function(done){
      request(app)
        .get('/collection/_entry')
        .end(function(res){
          res.should.have.status(200);
          res.body.should.equal('<html><head><title>express-partials</title></head><body><ul><li>one</li><li>two</li></ul></body></html>');
          done();
        })
    })
  })

  describe('GET /collection/thing',function(){
    it('should render thing/index.ejs for every item with layout.ejs as layout',function(done){
      request(app)
        .get('/collection/thing')
        .end(function(res){
          res.should.have.status(200);
          res.body.should.equal('<html><head><title>express-partials</title></head><body><ul><li>one</li><li>two</li></ul></body></html>');
          done();
        })
    })
  })

  describe('GET /register',function(){
    it('should render index.j as a Jade template with layout.j as Jade layout (register: function)',function(done){
      partials.register('.j',require('jade').render);
      request(app)
        .get('/register')
        .end(function(res){
          res.should.have.status(200);
          res.body.should.equal('<html><head><title>Jade layout</title></head><body><h2>Jade says hello world</h2></body></html>');
          done();
        })
    })
  })

  describe('GET /register',function(){
    it('should render index.j as a Jade template with layout.j as Jade layout (register: module)',function(done){
      partials.register('.j',require('jade'));
      request(app)
        .get('/register')
        .end(function(res){
          res.should.have.status(200);
          res.body.should.equal('<html><head><title>Jade layout</title></head><body><h2>Jade says hello world</h2></body></html>');
          done();
        })
    })
  })

  describe('GET /register',function(){
    it('should render index.j as a Jade template with layout.j as Jade layout (register: name)',function(done){
      partials.register('.j','jade');
      request(app)
        .get('/register')
        .end(function(res){
          res.should.have.status(200);
          res.body.should.equal('<html><head><title>Jade layout</title></head><body><h2>Jade says hello world</h2></body></html>');
          done();
        })
    })
  })

  describe('GET /register/no-layout',function(){
    it('should render index.j as a Jade template (using only Express 3.x)',function(done){
      partials.register('.j',{});
      request(app)
        .get('/register/no-layout')
        .end(function(res){
          res.should.have.status(200);
          res.body.should.equal('<h2>Jade says hello world</h2>');
          done();
        })
    })
  })

  describe('GET /eco',function(){
    it('should render index.eco as a Eco template with layout.eco as Eco layout',function(done){
      request(app)
        .get('/eco')
        .end(function(res){
          res.should.have.status(200);
          res.body.should.equal('<html><head><title>Eco layout</title></head><body><h2>Eco says hello world</h2>\n</body></html>\n');
          done();
        })
    })
  })

  describe('GET /coffeecup',function(){
    it('should render index.coffeecup as a CoffeeCup template with layout.coffeecup as CoffeeCup layout',function(done){
      request(app)
        .get('/coffeecup')
        .end(function(res){
          res.should.have.status(200);
          res.body.should.equal('<html><head><title>CoffeeCup layout</title></head><body><h2>CoffeeCup says hello world</h2></body></html>');
          done();
        })
    })
  })
  
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

})
