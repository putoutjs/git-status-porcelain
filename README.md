# Porcelain [![License][LicenseIMGURL]][LicenseURL] [![NPM version][NPMIMGURL]][NPMURL] [![Dependency Status][DependencyStatusIMGURL]][DependencyStatusURL] [![Build Status][BuildStatusIMGURL]][BuildStatusURL] [![Coverage][CoverageIMGURL]][CoverageURL]

Parse `git status --porcelain` output with a pleasure.

## Install

```
npm i @putout/git-status-porcelain
```

## How to use?

`porcalain` can be used in simpified mode, when you just need names of modified files (`added`, `deleted`, works as well):

```js
const porcelain = require('@putout/git-status-porcelain');

porcelain({
    modified: true,
    untracked: true,
});
// returns
[ 'README.md', '1.js' ]
```

But you can get break `porcelain` into pieces as well 😉:

```js
const porcelain = require('@putout/git-status-porcelain');
const {run, parse, pick, getNames} = porcelain;

// run git status --porcelain
const stdout = run();
// returns
' M README.md\n?? 1.js\n'
>

const files = parse(stdout);
// returns
[ { name: 'README.md', mode: ' M ' }, { name: '1.js', mode: '?' } ]

const modifiedFiles = pick(files, {
    modified: false,    // default
    untracked: false,   // default
    deleted: false,     // default
    added: false,       // default
    renamed: false,     // default
});
// returns
[ { name: 'README.md', mode: ' M ' } ]

getNames(modifiedFiles);
// returns
[ 'README.md' ]
```

## License

MIT

[NPMIMGURL]:                https://img.shields.io/npm/v/@putout/git-status-porcelain.svg?style=flat&longCache=true
[BuildStatusIMGURL]:        https://img.shields.io/travis/coderaiser/git-status-porcelain/master.svg?style=flat&longCache=true
[DependencyStatusIMGURL]:   https://img.shields.io/david/coderaiser/git-status-porcelain.svg?style=flat&longCache=true
[LicenseIMGURL]:            https://img.shields.io/badge/license-MIT-317BF9.svg?style=flat&longCache=true
[NPMURL]:                   https://npmjs.org/package/@putout/git-status-porcelain 'npm'
[BuildStatusURL]:           https://travis-ci.org/coderaiser/git-status-porcelain  'Build Status'
[DependencyStatusURL]:      https://david-dm.org/coderaiser/git-status-porcelain 'Dependency Status'
[LicenseURL]:               https://tldrlegal.com/license/mit-license 'MIT License'

[CoverageURL]:              https://coveralls.io/github/coderaiser/git-status-porcelain?branch=master
[CoverageIMGURL]:           https://coveralls.io/repos/coderaiser/git-status-porcelain/badge.svg?branch=master&service=github

