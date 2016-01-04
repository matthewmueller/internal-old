var Internal = require('..')
var internal = Internal(require('./fixtures/actions'))

var actions1 = internal()
var actions2 = internal()

actions1
  .connect('test')
  .create('hi')
  .then(() => console.log('done'))

actions2
  .connect('test2')
  .create('hi2')
  .then(() => console.log('done2'))
