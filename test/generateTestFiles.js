const fs = require('fs')
const path = require('path')
const Twig = require('twig')
Twig.extendFilter('custom_uppercase', str => str.toUpperCase())

const root = 'test/source'
const testConfigs = fs.readdirSync('./test/tests')
  .filter(f => f.endsWith('.test.json'))
  .reduce((acc, f) => {
    acc[f.split('.')[0]] = require(path.resolve(path.join('./test/tests', f)))
    return acc
  }, {})

Object.entries(testConfigs).forEach(generateTestFile)

function generateTestFile ([id, { mainTemplate, context, includes }]) {
  const compiled = includes
    .map(i => `includes/${i}`)
    .concat(mainTemplate)
    .reduce((acc, p) => {
      const relativePath = path.join(root, p)

      acc[p] = Twig.twig({ ref: relativePath })
      if (!acc[p]) {
        acc[p] = Twig.twig({
          id: relativePath,
          data: fs.readFileSync(relativePath, 'utf8'),
          allowInlineIncludes: true
        })
      }

      return acc
    }, {})

  fs.writeFileSync(`./test/compiled/${id}.html`, compiled[mainTemplate].render(context))
}
