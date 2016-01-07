/**
 * Timeout
 */

exports.connect = function (url, fn) {
  var self = this
  console.log('connecting to %s', url)
  setTimeout(function () {
    self.connected = true
    console.log('connected to %s', url)
    fn()
  }, 1000)
}

exports.create = function (name, fn) {
  if (!this.connected) {
    return fn(new Error('not connected'))
  }
  console.log('creating %s', name)
  setTimeout(function() {
    console.log('created %s', name)
    fn()
  }, 2000)
}

exports.put = function (obj, fn) {
  setTimeout(function() {
    console.log('putting %j', obj)
    fn()
  }, 2000)
}

exports.get = function (key, fn) {
  setTimeout(function() {
    console.log('getting %k', obj)
    fn()
  }, 2000)
}

exports.query = function (query, fn) {
  console.log('querying %s', query)
  setTimeout(function() {
    console.log('queried %s', query)
    fn()
  }, 2000)
}

exports.del = function(key, fn) {
  setTimeout(function() {
    console.log('deleted %s', key)
    fn()
  }, 2000)
}

exports.window = {
  location: {
    get href () {
      return 'some-url'
    },

    set href (value) {
      console.log('setting href to %s', value)
    }
  },

  localStorage: {
    setItem: function * (key, value) {
      console.log('setting %s to %s', key, value)
      yield wait(2000)
      console.log('set %s to %s', key, value)
    },
    removeItem: function (key, fn) {
      console.log('removing %s', key)
      setTimeout(function() {
        console.log('removed %s', key)
        fn()
      }, 1000)
    }
  }
}

function wait (ms) {
  return function (fn) {
    setTimeout(fn, ms)
  }
}
