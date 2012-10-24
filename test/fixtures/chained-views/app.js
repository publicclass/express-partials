var express = require('express')
  , partials = require('../../../')
  , app = module.exports = express();

app.configure(function() {
	app.set('views', __dirname);
	app.set('view engine', 'ejs');

  app.use(function(req, res, next){
    res.locals.logged_user = 'bob';
    res.locals.config = {title:'partially'};
    next();
  })

	app.use(partials())
})

app.get('/', function(req, res){
	res.render('view1')
})

app.get('/locals', function(req, res){
  res.render('locals1')
})