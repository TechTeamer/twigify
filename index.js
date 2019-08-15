const path = require('path')
const through = require('through2')
const Twig = require('twig')
const twig = Twig.twig

const DEFAULT_EXT_REGEX = /\.(twig)$/
const DEFAULT_TWIG_OPTIONS = {
  allowInlineIncludes: true
}

let extRegex
let twigOpts

function compile (filePath, data) {
  let template = twig({ ref: filePath })
  if (!template) {
    template = twig({ id: filePath, data })
  }

  const cwd = path.resolve('.')
  const relativeFilePath = path.relative(cwd, filePath)

  const twigOptions = Object.assign({}, DEFAULT_TWIG_OPTIONS, twigOpts, {
    id: relativeFilePath,
    data: template.tokens,
    precompiled: true
  })

  return `twig(${JSON.stringify(twigOptions)})`
}

function process (source) {
  return `const twig = require('twig').twig\n` +
    `module.exports = ${source}`
}

function twigify (filePath, options) {
  const {
    ext = DEFAULT_EXT_REGEX,
    twigOptions = DEFAULT_TWIG_OPTIONS
  } = options

  if (ext instanceof RegExp) {
    extRegex = ext
  } else if (typeof ext === 'string') {
    extRegex = new RegExp(ext)
  } else {
    throw new Error('Invalid config: "ext" must be an instance of RegExp or a string!')
  }

  extRegex = ext
  twigOpts = twigOptions

  if (!extRegex.test(filePath)) {
    return through()
  }

  const buffers = []

  function push (chunk, _, next) {
    buffers.push(chunk)
    next()
  }

  function end (next) {
    const rawTemplate = Buffer.concat(buffers).toString()
    const compiledTwig = compile(filePath, rawTemplate)

    this.push(process(compiledTwig))
    next()
  }

  return through(push, end)
}

module.exports = twigify
module.exports.compile = compile
