var https = require('https'),
    semver = require('semver');

module.exports = function(username, repo, fn) {
  var path = ["/repos", username, repo, 'git/refs/tags/'].join('/');

  var req = https.request({
    host: 'api.github.com',
    path: path,
    port: 443,
    method: 'GET'
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
    console.log('connecting')
  });

  req.end();
  req.on('error', function(e) {
    fn(e);
  });
};
