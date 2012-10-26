var express = require('express')
  , partials = require('../../../')
  , app = module.exports = express();

app.configure(function() {
  app.set('views', __dirname);
  app.set('view engine', 'ejs');
  app.use(partials());
})

app.get('/subdir',function(req,res,next){
  res.render('subdir/index.ejs')
})

app.get('/subdir-explicit',function(req,res,next){
  res.render('subdir/index.ejs',{
    layout: 'subdir/layout.ejs', 
    list: [
      {name:'one'},
      {name:'two'}
    ]
  })
})

app.get('/subdir-a-view',function(req,res,next){
  res.render('subdir/a-view.ejs')
})

app.get('/subdir-aView',function(req,res,next){
  res.render('subdir/aView.ejs')
})

app.get('/layout-subdir',function(req,res,next){
  res.render('subdir/index.ejs',{layout: 'subdir/layouts/another-layout'})
})

app.get('/layout-subdir.ejs',function(req,res,next){
  res.render('subdir/index.ejs',{layout: 'subdir/layouts/another-layout.ejs'})
})