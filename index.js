var path = require('path')
  , fs = require('fs')
  , exists = fs.existsSync || fs.existsSync
  , resolve = path.resolve
  , extname = path.extname
  , basename = path.basename;


/**
 * Express 3.x Layout & Partial support.
 *
 * The beloved feature from Express 2.x is back as a middleware.
 *
 * Example:
 *    
 *    var express = require('express')
 *      , partials = require('express-partials')
 *      , app = express();
 *    app.use(partials());
 *    // three ways to register a template engine:
 *    partials.register('coffee','coffeekup');
 *    partials.register('coffee',require('coffeekup'));
 *    partials.register('coffee',require('coffeekup').render);
 *    app.get('/',function(req,res,next){
 *      res.render('index.ejs') // renders layout.ejs with index.ejs as `body`.
 *    })
 * 
 * Options:
 *
 *    none
 *
 */

module.exports = function(){
  return function(req,res,next){
    // res.partial(view,options) -> res.render() (ignores any layouts)
    res.partial = res.render;

    // in template partial(view,options)
    res.locals.partial = partial.bind(res);

    // layout support
    var _render = res.render.bind(res);
    res.render = function(name, options, fn){
      var layout = options && options.layout;

      // default layout
      if( layout === true || layout === undefined )
        layout = 'layout';
      
      // layout
      if( layout ){
        // first render normally
        _render(name, options, function(err, body){
          if( err )
            return fn ? fn(err) : req.next(err);

          options = options || {};
          options.body = body;

          // now render the layout
          var ext = extname(name) || '.'+(res.app.get('view engine') || 'ejs');
          _render(basename(layout,ext)+ext, options, fn);
        })

      // no layout
      } else {
        _render(name, options, fn);
      }
    }

    // done
    next();
  }
}

/*** 
 * Allow to register a specific rendering
 * function for a given extension.
 * (Similar to Express 2.x register() function.)
 *
 * The second argument might be:
 *   a template module's name
 *   a module with a `render` method
 *   a synchronous `render` method
 */

var register = function(ext,render) {
  if(ext[0] !== '.') {
    ext = '.' + ext;
  }
  if(typeof render === 'string') {
    render = require(render);
  }
  if(render.render !== null) {
    register[ext] = render.render;
  } else {
    register[ext] = render;
  }
};

module.exports.register = register;

/**
 * Automatically assign a render() function
 * from a module of the same name if none
 * has been registered.
 */

var renderer = function(ext) {
  if(ext[0] !== '.') {
    ext = '.' + ext;
  }
  return register[ext] != null
    ? register[ext]
    : register[ext] = require(ext.slice(1)).render;
};

module.exports.renderer = renderer;

/**
 * Memory cache for resolved object names.
 */

var cache = {};

/**
 * Resolve partial object name from the view path.
 *
 * Examples:
 *
 *   "user.ejs" becomes "user"
 *   "forum thread.ejs" becomes "forumThread"
 *   "forum/thread/post.ejs" becomes "post"
 *   "blog-post.ejs" becomes "blogPost"
 *
 * @return {String}
 * @api private
 */

function resolveObjectName(view){
  return cache[view] || (cache[view] = view
    .split('/')
    .slice(-1)[0]
    .split('.')[0]
    .replace(/^_/, '')
    .replace(/[^a-zA-Z0-9 ]+/g, ' ')
    .split(/ +/).map(function(word, i){
      return i
        ? word[0].toUpperCase() + word.substr(1)
        : word;
    }).join(''));
};

/**
 * Lookup:
 *
 *   - partial `_<name>`
 *   - any `<name>/index`
 *   - non-layout `../<name>/index`
 *   - any `<root>/<name>`
 *   - partial `<root>/_<name>`
 *
 * @param {View} view
 * @return {String}
 * @api private
 */

function lookup(root, view, ext){
  var name = resolveObjectName(view);

  // Try _ prefix ex: ./views/_<name>.jade
  // taking precedence over the direct path
  view = resolve(root,'_'+name+ext)
  if( exists(view) ) return view;

  // Try index ex: ./views/user/index.jade
  view = resolve(root,name,'index'+ext);
  if( exists(view) ) return view;

  // Try ../<name>/index ex: ../user/index.jade
  // when calling partial('user') within the same dir
  view = resolve(root,'..',name,'index'+ext);
  if( exists(view) ) return view;

  // Try root ex: <root>/user.jade
  view = resolve(root,name+ext);
  if( exists(view) ) return view;

  return null;
};


/**
 * Render `view` partial with the given `options`. Optionally a
 * callback `fn(err, str)` may be passed instead of writing to
 * the socket.
 *
 * Options:
 *
 *   - `object` Single object with name derived from the view (unless `as` is present)
 *
 *   - `as` Variable name for each `collection` value, defaults to the view name.
 *     * as: 'something' will add the `something` local variable
 *     * as: this will use the collection value as the template context
 *     * as: global will merge the collection value's properties with `locals`
 *
 *   - `collection` Array of objects, the name is derived from the view name itself.
 *     For example _video.html_ will have a object _video_ available to it.
 *
 * @param  {String} view
 * @param  {Object|Array} options, collection or object
 * @return {String}
 * @api public
 */

function partial(view, options){
  var collection
    , object
    , locals
    , name;

  // parse options
  if( options ){
    // collection
    if( options.collection ){
      collection = options.collection;
      delete options.collection;
    } else if( 'length' in options ){
      collection = options;
      options = {};
    }

    // locals
    if( options.locals ){
      locals = options.locals;
      delete options.locals;
    }

    // object
    if( 'Object' != options.constructor.name ){
      object = options;
      options = {};
    } else if( options.object != undefined ){
      object = options.object;
      delete options.object;
    }
  } else {
    options = {};
  }

  // merge locals into options
  if( locals )
    options.__proto__ = locals;

  // merge app locals into 
  for(var k in this.app.locals)
    options[k] = options[k] || this.app.locals[k];

  // extract object name from view
  name = options.as || resolveObjectName(view);

  // find view
  var root = this.app.get('views') || process.cwd() + '/views'
    , ext = extname(view) || '.' + (this.app.get('view engine')||'ejs')
    , file = lookup(root, view, ext);
  
  // read view
  var source = fs.readFileSync(file,'utf8');

  // render partial
  function render(){
    if (object) {
      if ('string' == typeof name) {
        options[name] = object;
      } else if (name === global) {
        // wtf?
        // merge(options, object);
      }
    }
    return renderer(ext)(source, options);
  }

  // Collection support
  if (collection) {
    var len = collection.length
      , buf = ''
      , keys
      , key
      , val;

    if ('number' == typeof len || Array.isArray(collection)) {
      options.collectionLength = len;
      for (var i = 0; i < len; ++i) {
        val = collection[i];
        options.firstInCollection = i == 0;
        options.indexInCollection = i;
        options.lastInCollection = i == len - 1;
        object = val;
        buf += render();
      }
    } else {
      keys = Object.keys(collection);
      len = keys.length;
      options.collectionLength = len;
      options.collectionKeys = keys;
      for (var i = 0; i < len; ++i) {
        key = keys[i];
        val = collection[key];
        options.keyInCollection = key;
        options.firstInCollection = i == 0;
        options.indexInCollection = i;
        options.lastInCollection = i == len - 1;
        object = val;
        buf += render();
      }
    }

    return buf;
  } else {
    return render();
  }
}
