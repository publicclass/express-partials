var express = require('express')
  , partials = require('../../../')
  , app = module.exports = express();

app.configure(function() {
	app.set('views', __dirname);
	app.set('view engine', 'ejs');

	app.use(partials());
})

app.get('/', function(req, res){
	res.render('view1');
})