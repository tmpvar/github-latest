
var semver = require('semver')
  , https = require('https')

var username = process.env.GITHUB_USERNAME
var password = process.env.GITHUB_PASSWORD

var headers = {'user-agent': 'https://npmjs.org/package/github-latest'}

if (username && password) {
  headers.authorization = 'Basic ' + encode(username+':'+ password)
}

function encode(str){
  return new Buffer(str).toString('base64')
}

module.exports = function(username, repo, fn) {
  var path = ''
    + '/repos/' + username
    + '/' + repo
    + '/git/refs/tags/'

  https.request({
    host: 'api.github.com',
    path: path,
    port: 443,
    method: 'GET',
    headers: headers,
    agent: false
  }, function(res) {
    var data = ''

    // data has to be read
    res.on('data', function(chunk) {
      data += chunk
    });

    if(!(/^200/).test(res.headers.status))
      return fn(new Error(res.headers.status))

    res.on('end', function() {
      try {
        var tags = JSON.parse(data)
          .map(function(item){
            return item.ref.split('/').pop()
          })
          .filter(semver.valid)
          .sort(semver.rcompare)
      } catch (e) {
        return fn(e)
      }
      fn(null, tags[0])
    })
  })
  .on('error', fn)
  .end()
}