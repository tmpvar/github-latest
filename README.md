# github-latest

get the latest (semver) tag number of a repo

If you start hitting githubs rate limit. (currently 60/hr) you can raise this limit to 5000/hr by setting the environment variables:

+ GITHUB_USERNAME
+ GITHUB_PASSWORD

# install

`npm install github-latest`

# use

```javascript
require('github-latest')('tmpvar', 'tpad-firmware', function(e, tag) {
  console.log(tag); // outputs 0.0.3
});
```

# license

MIT