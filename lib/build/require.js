
/*!
 * Require functions by TJ Holowaychuk <tj@learnboost.com>
 */

/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(p, parent){
  var path = require.resolve(p)
    , fn = require.modules[path];
  if (!fn) throw new Error('failed to require "' + p + '" from ' + parent);

  var module = {id: path, exports: {}};
  fn.call(module.exports, module, module.exports, require.relative(path));

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Resolve `path`.
 *
 * @param {String} path
 * @return {Object} module
 * @api public
 */

require.resolve = function(path){
  var orig = path
    , reg = path
    , index = path + '/index';
  return require.modules[reg] && reg
    || require.modules[index] && index
    || orig;
};

/**
 * Register module at `path` with callback `fn`.
 *
 * @param {String} path
 * @param {Function} fn
 * @api public
 */

require.register = function(path, fn){
  require.modules[path] = fn;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  return function(p){
    if ('debug' == p) return debug;
    if ('.' != p.charAt(0)) return require(p);

    var path = parent.split('/')
      , segs = p.split('/');
    path.pop();

    for (var i = 0; i < segs.length; i++) {
      var seg = segs[i];
      if ('..' == seg) path.pop();
      else if ('.' != seg) path.push(seg);
    }

    return require(path.join('/'), parent);
  };
};
