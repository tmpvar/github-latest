# github-latest

get the latest (semver) tag number of a repo

# install

`npm install github-latest`

# use

```javascript

require('github-latest')('tmpvar', 'tpad-firmware', function(e, tag) {
  console.log(tag); // outputs 0.0.3
});

# license

MIT