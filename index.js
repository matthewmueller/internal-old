/**
 * Module Dependencies
 */

var sliced = require('sliced')
var wrap = require('wrapped')

/**
 * Export `Internal`
 */

module.exports = Internal

/**
 * Create
 */

function Internal (actions) {
  function internal (state) {
    if (!(this instanceof internal)) return new internal(state)
    this.state = state || {}
    this.queue = []
  }

  Object.keys(actions).forEach(function (name) {
    var action = actions[name]

    if (typeof action === 'function') {
      internal.prototype[name] = function () {
        var args = sliced(arguments)
        var state = this.state
        this.queue.push(function (fn) {
          wrap(action).apply(state, args.concat(fn))
        })
        return this
      }
    } else {
      var Child = Internal(action)
      // lazily initialize the namespace, we need the
      // state and queue of the parent namespace
      internal.prototype.__defineGetter__(name, function () {
        var child = Child(this.state)
        child.queue = this.queue
        return child
      })
    }
  })

  internal.prototype.promise = function () {
    var queue = this.queue
    return new Promise(function (success, failure) {
      // execute the queue serially
      function next(err, value) {
        if (err) return failure(err)
        var fn = queue.shift()
        if (!fn) return success(value)
        fn(next)
      }
      next()
    })
  }

  internal.prototype.then = function (fn) {
    return this.promise().then(fn)
  }

  internal.prototype.catch = function (fn) {
    return this.promise().catch(fn)
  }

  return internal
}
