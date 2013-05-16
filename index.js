var https = require('https'),
    semver = require('semver')

module.exports = function(username, repo, fn) {
  var path = ['/repos', username, repo, 'git/refs/tags/'].join('/');

  https.request({
    host: 'api.github.com',
    path: path,
    port: 443,
    method: 'GET',
    headers: {
      'user-agent': 'https://npmjs.org/package/github-latest'
    }
  }, function(res) {

    var data = '';
    res.on('end', function() {
      try {
        var tags = JSON.parse(data).map(function(item){
          return item.ref.split('/').pop();
        })
        tags.sort(semver.rcompare);

        fn(null, tags[0]);
      } catch (e) {
        fn(e);
      }
    });

    res.on('data', function(chunk) {
      data += chunk;
    });
  })
  .on('error', fn)
  .end();
};
