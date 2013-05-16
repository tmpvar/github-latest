var https = require('https'),
    semver = require('semver'),
    VERSION = require('./package.json').version;

module.exports = function(username, repo, fn) {
  var path = ["/repos", username, repo, 'git/refs/tags/'].join('/');

  https.request({
    host: 'api.github.com',
    path: path,
    port: 443,
    method: 'GET',
    headers: {
      'user-agent': 'https://npmjs.org/github-latest ' + VERSION
    }
  }, function(res) {

    var data = '';
    res.on('end', function() {
      try {
        var obj = JSON.parse(data);
        obj.sort(function(a, b) {
          var aref = a.ref.split('/').pop();
          var bref = b.ref.split('/').pop();
          return semver.gt(aref, bref) ? -1 : 1;
        });

        fn(null, obj.shift().ref.split('/').pop());
      } catch (e) {
        fn(e);
      }
    });

    res.on('data', function(chunk) {
      data += chunk +'';
    });
  })
  .on('error', fn)
  .end();
};
