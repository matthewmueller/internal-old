/**
 * Module Dependencies
 */

var assert = require('assert')
var Internal = require('..')

/**
 * Tests
 */

describe('Internal', function() {
  it('should ensure serial order even when running concurrently', function(done) {
    var order = []

    var API = Internal({
      echo: function (id, wait, fn) {
        setTimeout(function() {
          order.push(id)
          fn(null, id)
        }, wait)
      }
    })

    var api = API()

    api
      .echo(1, 200)
      .then((id) => assert.equal(id, 1))
      .catch(done)

    api
      .echo(2, 100)
      .then((id) => {
        assert.equal(id, 2)
        assert.equal('1,2', order.join(','))
        done()
      })
      .catch(done)
  })

  it('should support a shared context', function(done) {
    var API = Internal({
      echo(msg, fn) {
        this.a = 'echo'
        this.hi(msg, fn)
      },
      hi(msg, fn) {
        this.b = 'hi'
        fn()
      },
      redis: {
        message(msg, fn) {
          var self = this
          this.c = 'redis'
          this.echo(msg, function() {
            fn(null, msg + ':' + self.a + ':' + self.b + ':' + self.c)
          })
        }
      }
    })

    var api = API()

    api.redis.message('start')
      .then(v => {
        assert.equal(v, 'start:echo:hi:redis')
        done()
      })
      .catch(done)
  })

  it('should support namespaces', function(done) {
    var order = []

    var API = Internal({
      a(msg) {
        order.push(msg)
      },
      b: {
        b: {
          b(msg) {
            order.push(msg)
          }
        }
      }
    })

    var api = API()
    api
      .b.b.b('b')
      .a('a')
      .then(() => {
        assert.equal('b,a', order.join(','))
        done()
      })
      .catch(done)
  })

  it('should support namespaces (reverse call)', function(done) {
    var order = []

    var API = Internal({
      a(msg) {
        order.push(msg)
      },
      b: {
        b: {
          b(msg) {
            order.push(msg)
          }
        }
      }
    })

    var api = API()
    api
      .a('a')
      .b.b.b('b')
      .then(() => {
        assert.equal('a,b', order.join(','))
        done()
      })
      .catch(done)
  })
})
