twigify
=======

> This is a fork of [dane-harnett/twigify](https://github.com/dane-harnett/twigify) by [TechTeamer](https://techteamer.com).

`twigify` is a [Browserify](https://github.com/substack/node-browserify) transform for creating modules of pre-compiled [Twig.js](https://github.com/justjohn/twig.js) templates.

### Installation
With [`npm`](http://npmjs.org/) as a local development dependency:

```bash
npm install --save-dev @techteamer/twigify
```

### Usage

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
```twig
<h1>{{ title }}</h1>
{% include 'templates/body.twig' %}
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

#### Include / extend / etc.

The ID of each template file is always the template file path (with extension) **relative to the working directory, from which the build script was run**!

Let's suppose we have the following directory structure:

    /tmp/test-project/
    ├── build/
    ├── templates/
    │   ├── main.twig
    │   └── features/
    │       ├── menu.twig
    │       └── footer.twig
    └── main.js

Our build is run in `/tmp/test-project` as follows:

    user@pc:/tmp/test-project$ browserify main.js -t @techteamer/twigify > build/bundle.js

This means, that in `templates/main.twig`, we include `templates/features/menu.twig` and `templates/features/footer.twig`. `Extend` works the same way.

Another important thing is, that in order for this to work, every included / extended file **must** have been `require`d at least once somewhere, otherwise `browserify` will not include it in the bundle.

### Options

```json5
{
  "ext": "\\.(twig|html)$", // Register custom template extension
  "twigOptions": {
    // Add custom twig options here. This gets just passed on to twig.js,
    // so any valid twig.js option is also valid here.
    // The "id", "data" and "precompiled" options are always overwritten.
  }
}
```

Add custom options using `package.json`:

```json5
{
  "browserify": {
    "transform": [
      ["@techteamer/twigify", { /* Add custom options here */ }]    
    ]  
  }
}
```

Or using the browserify API:

```javascript
browserify(file, {
  // browserify options
  transform: ['@techteamer/twigify', { /* Add custom options here */ }]
})
```

### Transforming with the command-line

```bash
browserify test.js -t @techteamer/twigify > test-bundle.js
```
