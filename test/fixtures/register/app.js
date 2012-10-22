var express = require('express')
  , partials = require('../../../')
  , consolidate = require('consolidate')
  , jade = require('jade')
  , app = module.exports = express();

app.configure(function() {
  app.set('views', __dirname);
  app.set('view engine', 'ejs');
  app.use(partials());
})

/* Use `register` to substitute the file extension. */
app.engine('.j',jade.__express);
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
app.engine('.eco',consolidate.eco);
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
