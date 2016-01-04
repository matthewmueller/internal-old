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
    setTimeout(function() {
    console.log('query %k', query)
    fn()
  }, 2000)
}

exports.del = function(key, fn) {
  setTimeout(function() {
    console.log('deleted %s', key)
    fn()
  }, 2000)
}
