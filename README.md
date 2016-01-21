## parallelly

Compose async functions into one function that runs all parallelly

See also: [serially](http://github.com/azer/serially)

## Install

```bash
$ npm install parallelly
```

## Usage

```js
var parallelly = require('parallelly')
var http = require('http')
var fs = require('fs')

parallelly()
  .run(foo, ['a', 'b', 'c'])
  .and(bar, [1, 2, 3])
  .and('qux alias', qux, [4, 5, 6])
  .done(function (errors, results) {
    if (errors) {
      errors[0].name
      // => "bar"

      errors[0].error
      // => Error{"failed"}
    }

    var parallelly = require('parallelly')
    var http = require('http')
    var fs = require('fs')

    console.log('done')
    console.log(results)
    // => { foo: [...], bar: [...], qux alias: [...] }
})

function foo (pa, ra, ms, callback) { }
function bar (pa, ra, ms, callback) { callback(new Error("failed")) }
function qux (pa, ra, ms, callback) {}
```

See `test.js` for more info.
