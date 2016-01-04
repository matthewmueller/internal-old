/**
 * Module Dependencies
 */

var sliced = require('sliced')
var wrap = require('wrapped')
var Vo = require('vo')

/**
 * Export `create`
 */

module.exports = create

/**
 * Create
 */

function create (actions) {
  function API (state) {
    if (!(this instanceof API)) return new API(state)
    this.state = state
    this.queue = []
  }

  Object.keys(actions).forEach(function (name) {
    var action = actions[name]
    API.prototype[name] = function () {
      var args = sliced(arguments)
      var state = this.state
      this.queue.push(function (fn) {
        wrap(action).apply(state, args.concat(fn))
      })
      return this
    }
  })

  API.prototype.promise = function () {
    // execute queue sequentially
    var vo = Vo.apply(vo, this.queue)
    var self = this

    return new Promise(function (success, failure) {
      vo(function (err, value) {
        if (err) return failure(err)
        self.queue = []
        success(value)
      })
    })
  }

  API.prototype.then = function (fn) {
    return this.promise().then(fn)
  }

  API.prototype.catch = function (fn) {
    return this.promise().catch(fn)
  }

  return API
}
