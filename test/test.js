const fs = require('fs')
const tap = require('tap')
const path = require('path')
const twigify = require('../src')
const browserify = require('browserify')
const assert = require('assert')

const testConfigs = fs.readdirSync('./test/tests')
  .filter(f => f.endsWith('.test.json'))
  .reduce((acc, f) => {
    acc[f.split('.')[0]] = require(path.resolve(path.join('./test/tests', f)))
    return acc
  }, {})

Object.entries(testConfigs).forEach(runTest)

function runTest ([id, { script, description, twigifyOptions = {} }]) {
  tap.test(description, childTest => {
    const expectedResult = fs.readFileSync(`test/compiled/${id}.html`, 'utf8')

    browserify(path.join('test/source', script), {
      transform: [[twigify, twigifyOptions]]
    }).bundle((err, output) => {
      assert.ifError(err)

      // eslint-disable-next-line prefer-const
      let html = ''
      // eslint-disable-next-line no-eval
      eval(output.toString())

      assert.strictEqual(html.trim(), expectedResult.trim())

      childTest.end()
    })
  })
}
