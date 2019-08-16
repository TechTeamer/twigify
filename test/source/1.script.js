const Twig = require('twig')
const main = require('./1.template.twig')
require('./includes/header.twig')
require('./includes/footer.twig')
require('./includes/layout.twig')

const context = require('../tests/1.test').context

Twig.extendFilter('custom_uppercase', str => str.toUpperCase())

html = main.render(context)
