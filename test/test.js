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

      let html = ''
      eval(output.toString())

      assert.strictEqual(html.trim(), expectedResult.trim())

      childTest.end()
    })
  })
}
/*

tap.test('template generation with custom filter, include & extend', childTest => {
  const testScript = `const Twig = require('twig')
                      const main = require('./test/resources/1_main.twig')
                      require('./test/resources/includes/header.twig')
                      require('./test/resources/includes/footer.twig')
                      require('./test/resources/includes/layout.twig')

                      Twig.extendFilter('custom_uppercase', str => str.toUpperCase())

                      html = main.render({
                        pageName: 'twigify',
                        greeting: 'Hello, World!'
                      })`

  browserify(testScript, {
    transform: [twigify]
  }).bundle((err, output) => {
    assert.ifError(err)

    // eslint-disable-next-line prefer-const
    let html = ''
    // eslint-disable-next-line no-eval
    eval(output.toString())

    assert.strictEqual(html.trim(), '<html>\n' +
      '<head>\n' +
      '    <title>This is a test</title>\n' +
      '        <meta charset="utf-8">\n' +
      '</head>\n' +
      '<body>\n' +
      '<h1>TWIGIFY</h1>\n' +
      '<section>    <h1>Welcome to this test!</h1>\n' +
      '</section>\n' +
      '<footer>Hello, World!</footer>\n' +
      '</body>\n' +
      '</html>')

    childTest.end()
  })
})

tap.test('passing a custom extension should work', childTest => {
  const testScript = `const Twig = require('twig')
                      const main = require('./test/resources/2_main.tpl')
                      require('./test/resources/includes/header.twig')
                      require('./test/resources/includes/footer.twig')
                      require('./test/resources/includes/layout.twig')

                      Twig.extendFilter('custom_uppercase', str => str.toUpperCase())

                      html = main.render({
                        pageName: 'twigify',
                        greeting: 'Hello, World!'
                      })`

  browserify(testScript, {
    transform: [[twigify, { ext: /\.(twig|tpl)$/ }]]
  }).bundle((err, output) => {
    assert.ifError(err)

    // eslint-disable-next-line prefer-const
    let html = ''
    // eslint-disable-next-line no-eval
    eval(output.toString())

    assert.strictEqual(html.trim(), '<html>\n' +
      '<head>\n' +
      '    <title>This is a test</title>\n' +
      '        <meta charset="utf-8">\n' +
      '</head>\n' +
      '<body>\n' +
      '<h1>TWIGIFY</h1>\n' +
      '<section>    <h1>Welcome to this test!</h1>\n' +
      '</section>\n' +
      '<footer>Hello, World!</footer>\n' +
      '</body>\n' +
      '</html>', 'Generated string should be valid')

    childTest.end()
  })
})
*/
