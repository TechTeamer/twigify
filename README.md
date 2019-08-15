twigify
=======

`twigify` is a [Browserify](https://github.com/substack/node-browserify) transform for creating modules of pre-compiled [Twig.js](https://github.com/justjohn/twig.js) templates.

### Installation ###
With [`npm`](http://npmjs.org/) as a local development dependency:

```bash
npm install --save-dev @techteamer/twigify
```

### Usage ###

In `templates/test.twig`:
```html+twig
<h1>{{ title }}</h1>
```

`test.js`:
```js
const template = require('./templates/test.twig')
const body = template.render({
  title: 'Main Page'
})

document.body.innerHTML = body
```

Including sub templates:

`templates/main.twig`:
```html+twig
<h1>{{ title }}</h1>
{% include 'body.twig' %}
```

`main.js`:
```js
// need to require() this so that it is available for main.twig
const bodyTemplate = require('./templates/body.twig')
const mainTemplate = require('./templates/main.twig')

const page = mainTemplate.render({
  title: 'Main Page'
})

document.body.innerHTML = page
```

#### Transforming with the command-line ####

```bash
browserify test.js -t @techteamer/twigify > test-bundle.js
```
