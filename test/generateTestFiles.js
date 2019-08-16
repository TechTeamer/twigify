const fs = require('fs')
const path = require('path')
const Twig = require('twig')
const util = require('util')
const twigify = require('../src')
const browserify = require('browserify')

const writeFile = util.promisify(fs.writeFile)

Twig.extendFilter('custom_uppercase', str => str.toUpperCase())

const root = 'test/source'

generateTestFiles().catch(err => {
  console.error('Error generating test files:', err)
  process.exit(1)
})

async function generateTestFiles () {
  await generateTestFile({
    id: 1,
    mainTemplate: '1.template.twig',
    script: '1.script.js',
    context: {
      pageName: 'twigify',
      greeting: 'Hello, World!'
    },
    includes: ['layout.twig', 'header.twig', 'footer.twig']
  })

  await generateTestFile({
    id: 2,
    mainTemplate: '2.template.tpl',
    script: '2.script.js',
    context: {
      pageName: 'twigify',
      greeting: 'Hello, World!'
    },
    includes: ['layout.twig', 'header.twig', 'footer.twig'],
    twigifyOptions: { ext: /.(twig|tpl)$/ }
  })
}

async function generateTestFile ({ id, mainTemplate, script, context, includes, twigifyOptions = {} }) {
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

  await writeFile(`./test/compiled/${id}.expected.html`, compiled[mainTemplate].render(context))

  const b = browserify(path.join('test/source', script), {
    transform: [[twigify, twigifyOptions]]
  })
  const bundleFun = util.promisify(b.bundle.bind(b))
  const bundle = await bundleFun()

  await writeFile(`./test/compiled/${id}.bundle.js`, bundle)
}
