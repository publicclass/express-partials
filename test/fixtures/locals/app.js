var express = require('express')
  , engines = require('consolidate')
  , partials = require('../../../')
  , app = module.exports = express();

app.engine('haml', engines.haml);
app.use(partials());
partials.register('.haml','hamljs'); 

app.use(partials());
app.set('views',__dirname)

app.use(function(req,res,next){
  app.set('view engine', 'haml');
  next()
})

app.get('/',function(req,res,next){
  res.render('index', {favourite_number: 48, favourite_colour: "blue"})
})
