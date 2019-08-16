const Twig = require('twig')
const main = require('./2.template.tpl')
require('./includes/header.twig')
require('./includes/footer.twig')
require('./includes/layout.twig')

const context = require('../tests/2.test').context

Twig.extendFilter('custom_uppercase', str => str.toUpperCase())

html = main.render(context)
