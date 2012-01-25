# express-partials

Express 3.x Layout & Partial support.

The beloved feature from Express 2.x is back as a middleware!


## Installation

    $ npm install express-partials


## Usage
   
```javascript
   var express = require('express')
     , partials = require('express-partials')
     , app = express();
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


## Template Support

  - `ejs` (actually hard coded right now, but feel free to __fork and help!__)


## TODO

 - More Tests!
 - More templates.


## Running Tests

To run the test suite first invoke the following command within the repo, installing the development dependencies:

    $ npm install -d

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