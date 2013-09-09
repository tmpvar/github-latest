
var semver = require('semver')
var https = require('https')

var username = process.env.GITHUB_USERNAME
var password = process.env.GITHUB_PASSWORD

var headers = {'user-agent': 'https://npmjs.org/package/github-latest'}

if (username && password) {
  headers.authorization = 'Basic ' + encode(username+':'+ password)
}

function encode(str){
  return new Buffer(str).toString('base64')
}

module.exports = function(user, repo, fn) {
  https.request({
    host: 'api.github.com',
    path: '/repos/' + user + '/' + repo + '/tags',
    port: 443,
    method: 'GET',
    headers: headers,
    agent: false
  }, function(res) {
    var data = ''

    // data has to be read
    res.on('readable', function(chunk){
      data += this.read() || ''
    })

    if(res.statusCode != 200) {
      return fn(new Error(res.headers.status))
    }

    res.on('end', function(){
      try {
        data = JSON.parse(data)
        .map(function(item){ return item.name })
        .filter(semver.valid)
        .sort(semver.rcompare)
      } catch (e) {
        return fn(e)
      }
      fn(null, data[0])
    })
  })
  .on('error', fn)
  .end()
}