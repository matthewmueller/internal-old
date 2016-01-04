var Internal = require('..')
var internal = Internal(require('./fixtures/actions'))

var actions1 = internal()
var actions2 = internal()

actions1
  .connect('test')
  .create('hi')

actions1.window
  .location()
  .localStorage
    .setItem('hi', 'value')
    .removeItem('ok')

actions1.query('hi')


actions2
  .connect('test2')
  .create('hi2')

Promise.all([
  actions1.promise(),
  actions2.promise()
])
.then(function() {
  console.log('done!')
})
.catch(function(e) {
  console.log('e', e.stack)
})
