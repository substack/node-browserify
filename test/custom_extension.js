var browserify = require('../')
var tap = require('tap')

tap.test('default extension is js & json', function(t) {

  var stub = browserify('')

  t.plan(1)
  t.same(stub._extensions, [
    '.js',
    '.json'
  ])

})

tap.test('custom extension is higher than js & json', function(t) {

  var stub = browserify('', {
    extensions: [
      '.custom'
    ]
  })

  t.plan(1)
  t.same(stub._extensions, [
    '.custom',
    '.js',
    '.json'
  ])

})