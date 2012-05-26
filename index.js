var ejs = require('ejs')
  , path = require('path')
  , exists = path.existsSync
  , resolve = path.resolve
  , extname = path.extname
  , basename = path.basename
  , fs = require('fs');


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

    // in template layout override, inherits(view)
    res.locals.inherits = inherits.bind(res);

    // in template layout override, inherits(view)
    res.locals.block = block.bind(res);

    // layout support
    var _render = res.render.bind(res);
    res.render = function(name, options, fn){

      // in template include (with same locals)
      res.locals.include = include.bind(res, options);

      // first render normally
      _render(name, options, function(err, body){

        if( err )
          return fn ? fn(err) : req.next(err);

        var layout = options && options.layout;

        // can be overridden by layout local
        if ('_layout' in res.locals) {
          layout = res.locals._layout;
          delete res.locals._layout;
        }

        // default layout
        if( layout === true || layout === undefined )
          layout = 'layout';

        // layout
        if( layout ){

          options = options || {};
          options.body = body;
          options.layout = false;

          // now render the layout
          var ext = extname(name) || '.'+(res.app.get('view engine') || 'ejs');
          _render(basename(layout,ext)+ext, options, fn);

        // no layout
        } else {
          // (we already handled err above)
          return fn ? fn(err,body) : res.send(body);
        }
      })
    }

    // done
    next();
  }
}


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
    , ext = extname(view) || '.' + (this.app.get('view engine') || 'ejs')
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
    // TODO Support other templates (but it's sync now...)
    return ejs.render(source, options);
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

/**
 * Apply the given `view` as the layout for the current template.
 * Current template will be supplied to this view as `body`.
 *
 * (`layout` is bound to res in the middleware, so this == res)
 *
 * @param  {String} view
 * @api public
 */
function inherits(view){
  this.locals._layout = view;
}

/**
 * Apply the given `options` to the given `view` to be included
 * in the current template.
 *
 * `options` are bound in the middleware, you just call include())
 * `layout` is bound to res in the middleware, so this == res
 *
 * @param  {Object} options
 * @param  {String} view
 * @api public
 */
function include(options, view) {
  return partial.apply(this, [ view, options ]);
}

function Block() {
  this.html = [];
}

Block.prototype = {
  toString: function() {
    return this.html.join('\n');
  },
  append: function(more) {
    this.html.push(more);
  },
  prepend: function(more) {
    this.html.unshift(more);
  },
  replace: function(instead) {
    this.html = [ instead ];
  }
};

function block(name, html) {
  var blocks = this.locals._blocks || (this.locals._blocks = {});
  if (!blocks[name]) {
    // always create, so if we request a
    // non-existent block we'll get a new one
    blocks[name] = new Block();
  }
  if (html) {
    blocks[name].append(html);
  }
  return blocks[name];
}
