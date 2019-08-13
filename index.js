'use strict';

var Twig    = require('twig')
var twig    = Twig.twig
var through = require('through2');

var ext = /\.(twig)$/;

function compile(id, data) {
  var template = twig({ ref: id });
  if (!template) {
    template = twig({
      id: id,
      data
    });
  }

  var tokens = JSON.stringify(template.tokens);

  // the id will be the filename and path relative to the require()ing module
  return 'twig({ id: __filename, path: __dirname, data:' + tokens + ', precompiled: true, allowInlineIncludes: true })';
}

function process(source) {
  return (
    'var twig = require(\'twig\').twig;\n' +
    'module.exports = ' + source + ';\n'
  );
}

function twigify(file, opts) {
  if (!ext.test(file)) return through();
  if (!opts) opts = {};

  var id = file;
  // @TODO: pass a path via CLI to use for relative file paths
  //opts.path ? file.replace(opts.path, '') : file;

  var buffers = [];

  function push(chunk, enc, next) {
    buffers.push(chunk);
    next();
  }

  function end(next) {
    var str = Buffer.concat(buffers).toString();
    var compiledTwig;

    try {
      compiledTwig = compile(id, str);
    } catch(e) {
      return this.emit('error', e);
    }

    this.push(process(compiledTwig));
    next();
  }

  return through(push, end);
}

module.exports = twigify;
module.exports.compile = compile;
