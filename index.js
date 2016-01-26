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
    this.running = false
    this.queue = []
  }

  Object.keys(actions).forEach(function (name) {
    var meta = Object.getOwnPropertyDescriptor(actions, name)

    if (meta.get) {
      internal.prototype.__defineGetter__(name, function () {
        var args = sliced(arguments)
        var state = this.state
        this.queue.push(function (fn) {
          wrap(meta.get).apply(state, args.concat(fn))
        })
        return this
      })
    }
    if (meta.set) {
      internal.prototype.__defineSetter__(name, function () {
        var args = sliced(arguments)
        var state = this.state
        this.queue.push(function (fn) {
          wrap(meta.set).apply(state, args.concat(fn))
        })
        return this
      })
    }

    if (meta.set || meta.get) return

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
    if (this.running) return this.running

    var queue = this.queue
    var self = this

    var p = new Promise(function (success, failure) {
      // execute the queue serially
      function next(err, value) {
        if (err) return done(err)
        var fn = queue.shift()
        if (!fn) return done(null, value)
        fn(next)
      }

      function done(err, value) {
        self.running = false
        return err ? failure(value) : success(value)
      }

      next()
    })

    return this.running = p
  }

  internal.prototype.then = function (fn) {
    return this.promise().then(fn)
  }

  internal.prototype.catch = function (fn) {
    return this.promise().catch(fn)
  }

  return internal
}
