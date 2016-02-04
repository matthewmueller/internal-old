// var Internal = require('../')

// var API = Internal({
//   echo(msg, fn) {
//     this.test = 'test'
//     this.hi(msg, fn)
//   },
//   hi(msg, fn) {
//     this.test2 = 'whatever!!'
//     fn()
//   },
//   redis: {
//     message(msg, fn) {
//       var self = this
//       this.echo(msg, function() {
//         console.log('here...')
//         fn(null, msg + ':' + self.test + ':' + self.test2)
//       })
//     }
//   }
// })

// var api = API()

// api.redis.message('hi')
//   .then(v => console.log(v))
//   .catch(e => console.log(e.stack))
