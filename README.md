[![build status](https://secure.travis-ci.org/publicclass/express-partials.png)](http://travis-ci.org/publicclass/express-partials)
# express-partials

Express 3.x Layout & Partial support.

The beloved feature from Express 2.x is back as a middleware!


## Installation

    $ npm install express-partials


## Usage

The simple case:
   
```javascript
var express = require('express')
  , partials = require('express-partials')
  , app = express();

// load the express-partials middleware
app.use(partials());

app.get('/',function(req,res,next){
  res.render('index.ejs') 
  // -> render layout.ejs with index.ejs as `body`.
})

app.get('/no-layout',function(req,res,next){
  res.render('index.ejs',{layout:false})
  // -> only renders index.ejs
})

app.get('/mobile',function(req,res,next){
  res.render('index.ejs',{layout:'mobile'})
  // -> render mobile.ejs with index.ejs as `body`.
})
```

By default express-partials tries to figure the engine out by using the extension of the template. But in special cases an extension can be registered. And this can be done in a few ways:

```javascript
// a function
partials.register('.j',require('jade').render); 

// module (or object with a .render() function)
partials.register('.j',require('jade')); 

// string (= require(str))
partials.register('.j','jade'); 
```

For an example on how to use partials in the first place I'd recommend you checking out the [Express 2.x ejs example](https://github.com/visionmedia/express/tree/2.x/examples/ejs).

## Template Support

Any synchronous template engine should work fine. But check out the [tests](./test/test.partials.register.js) for a few engines tested.


## TODO

 - Async template engines?


## Running Tests

To run the test suite first install dependencies with the following command within the repo:

    $ npm install

then run the tests:

    $ npm test


## License 

(The MIT License)

Copyright (c) 2012 Robert Sk&ouml;ld &lt;robert@publicclass.se&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
