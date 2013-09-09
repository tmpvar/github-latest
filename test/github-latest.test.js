
var assert = require('assert')
var latest = require('..')

describe('github-latest', function(){
  it('should work', function(done){
    this.timeout(10000)
    var pending = 10
    var i = 0
    for (var i = 0; i < pending; i++) {
      latest('jkroso', 'result-type', function(e, tag){
        if (e) return done(e)
        assert(tag == '1.0.0')
        if (--pending === 0) done()
      })
    }
  })
})