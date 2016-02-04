// /**
//  * Module Dependencies
//  */

// var assert = require('assert')
// var Internal = require('..')

// var API = Internal({
//   echo(msg, time, fn) {
//     setTimeout(function() {
//       if (msg === 'b') {
//         return fn(new Error('no b\'s!'))
//       }
//       fn(null, msg)
//     }, time)
//   }
// })

// var api = API()

// api.echo('a', 500)
//   .echo('c', 1000)
//   .then(function (v) {
//     console.log('c', v)
//     assert.equal(v, 'c')
//   })

// api.echo('b', 1000)
//   .then(function (v) {
//     console.log('b', v)
//     assert.equal(v, 'b')
//   })
//   .catch (e => console.error(e.stack))

