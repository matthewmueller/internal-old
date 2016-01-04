# internal

Internal queue for your public libraries and APIs. This library makes it easy to build asynchronous fluent APIs. You can also think of it as embedded promises.

Some examples of APIs you can build using **internal**:

- [nightmare](https://github.com/segmentio/nightmare)
- [yieldb](https://github.com/pebble/yieldb)

## Features

- Runs asynchronous functions in order
- Supports namespacing at any depth
- Returns a promise for additional chaining
- API methods can be synchronous, asynchronous, generators or promises
- All methods are yieldable inside [co](https://github.com/tj/co)

## Usage

**building a simple redis client:**

```js
var Internal = require('internal')
var client = require('redis')

// Wrap methods in Internal
var internal = Internal({
  connect: function (url) {
    this.client = client.createClient(url)
  },
  get: function (key, fn) {
    this.client.get(key, fn)
  },
  set: function (key, value, fn) {
    this.client.set(key, value, fn)
  }
})

function Redis () {
  // initialization stuff
}

Redis.prototype.connect = function (url) {
  // initialize an instance of internal, queue the
  // connect, and return the internal object
  return internal().connect(url)
}

var redis = new Redis()

// all async calls are queued
redis
  .connect('redis://localhost')
  .set('key', 'value')
  .get('key')
  .then(value => console.log(value))
```

See test for additional usage examples

## Installation

```
npm install internal
```

## License

MIT, go wild.
