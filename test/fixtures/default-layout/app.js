var express = require('express')
  , partials = require('../../../')
  , app = module.exports = express();

app.configure(function() {
  app.set('views', __dirname);
  app.set('view engine', 'ejs');
  app.set('view options', {defaultLayout: 'layout-1'});
  app.use(partials());
})

app.get('/1', function(req, res){
  res.render('view');
})

app.get('/2', function(req, res){
  res.render('view', {layout: 'layout-2'});
})