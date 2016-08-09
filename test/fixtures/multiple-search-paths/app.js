var express = require('express')
  , partials = require('../../../')
  , path = require('path')
  , app = module.exports = express()
  , cc = require('coffeecup')
  , regDir = path.join(path.dirname(__dirname),'register');


/* CoffeeCup is supported, at least in Express 4.x.
 * It is not handled by consolidate, so we need to register it.
 * express-partials uses CoffeeCup's render() automatically.
 */
 
app.use(partials());
app.set('view engine', 'coffeecup');
app.set('views', [__dirname, regDir]);
app.engine('coffeecup', cc.__express);
app.set('view options', { defaultLayout: path.join(regDir,'layout.coffeecup') });
partials.register('coffeecup', cc);


app.get('/coffeecup',function(req,res,next){
  res.render('index', {hello:'world'})
})
