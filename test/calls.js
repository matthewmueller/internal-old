var Internal = require('../')

var API = Internal({
  echo(msg, fn) {
    this.redis.message(msg, fn)
  },
  redis: {
    message(msg, fn) {
      fn(null, 'hi')
    }
  }
})

var api = API()

api.echo('hi')
  .then(v => console.log(v))
  .catch(e => console.log(e.stack))
