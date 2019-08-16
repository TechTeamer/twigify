const fs = require('fs')
const tap = require('tap')
const assert = require('assert')
const spawn = require('child_process').spawnSync

tap.test('template generation with custom filter, include & extend', runTest('1'))
tap.test('passing a custom extension should work', runTest('2'))

function runTest (id) {
  return childTest => {
    const expectedResult = fs.readFileSync(`test/compiled/${id}.expected.html`, 'utf8')
    const { stdout } = spawn('node', [`./test/compiled/${id}.bundle.js`])

    assert.strictEqual(stdout.toString().trim(), expectedResult.trim())

    childTest.end()
  }
}
