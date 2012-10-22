var express = require('express')
  , partials = require('../../../')
  , app = module.exports = express();

app.use(partials());
app.set('views',__dirname)

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