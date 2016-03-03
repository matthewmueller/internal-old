/**
 * Module Dependencies
 */

var debug = require('debug')('internal')
var assign = require('object-assign')
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
    this.state = bind(actions, state || {})
    this.context = this
    this.queue = []
  }

  Object.keys(actions).forEach(function (name) {
    var meta = Object.getOwnPropertyDescriptor(actions, name)

    if (meta.get) {
      internal.prototype.__defineGetter__(name, function () {
        var args = sliced(arguments)
        var state = this.state
        this.queue.push(function (fn) {
          debug('executing: %s', pretty(name, args))
          wrap(meta.get).apply(state, args.concat(function (err, value) {
            debug(' executed: %s', pretty(name, args)(err || value))
            return fn.apply(null, arguments)
          }))
        })
        return this
      })
    }
    if (meta.set) {
      internal.prototype.__defineSetter__(name, function () {
        var args = sliced(arguments)
        var state = this.state
        this.queue.push(function (fn) {
          debug('executing: %s', pretty(name, args))
          wrap(meta.set).apply(state, args.concat(function (err, value) {
            debug(' executed: %s', pretty(name, args)(err || value))
            return fn.apply(null, arguments)
          }))
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
          debug('executing: %s', pretty(name, args))
          wrap(action).apply(state, args.concat(function (err, value) {
            debug(' executed: %s', pretty(name, args)(err || value))
            return fn.apply(null, arguments)
          }))
        })
        return this.context || this
      }
    } else {
      var Child = Internal(action)
      // lazily initialize the namespace, we need the
      // state and queue of the parent namespace
      internal.prototype.__defineGetter__(name, function () {
        var child = Child()
        child.state = this.state
        child.queue = this.queue
        // save the root context
        child.context = this.context || this
        return child
      })
    }
  })

  internal.prototype.promise = function () {
    var queue = [].concat(this.queue)
    this.queue = []
    var self = this

    function promise () {
      return new Promise(function (success, failure) {
        // execute the queue serially
        function next(err, value) {
          if (err) return done(err)
          var fn = queue.shift()
          if (!fn) return done(null, value)
          fn(next)
        }

        function done(err, value) {
          self.running = false
          return err ? failure(err) : success(value)
        }

        next()
      })
    }

    // either attach to the previous or start a new one
    return this.running
      ? this.running.then(function () { return promise() })
      : this.running = promise()
  }

  internal.prototype.then = function (success, failure) {
    return this.promise().then(success, failure)
  }

  internal.prototype.catch = function (failure) {
    return this.promise().catch(failure)
  }

  return internal
}

function bind (actions, state) {
  var obj =  walk(actions, function(fn) {
    return fn.bind(state)
  })

  Object.keys(obj).forEach(function(key) {
    state[key] = state[key] || obj[key]
  })

  return state
}

function walk (obj, fn) {
  Object.keys(obj).forEach(function (key) {
    if (typeof obj[key] === 'function') obj[key] = fn(obj[key])
    else walk(obj[key], fn)
  })
  return obj
}

/**
 * Prettify a function
 *
 * @param {String} name
 * @param {Array} args
 * @return {Function}
 */

function pretty (name, args) {
  args = args.map(arg => JSON.stringify(arg)).join(', ')

  function response (ret) {
    return name + '(' + args + ') => ' + JSON.stringify(ret)
  }

  response.toString = function () {
    return name + '(' + args + ')'
  }

  return response
}
