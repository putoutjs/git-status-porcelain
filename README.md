# Porcelain [![License][LicenseIMGURL]][LicenseURL] [![NPM version][NPMIMGURL]][NPMURL] [![Build Status][BuildStatusIMGURL]][BuildStatusURL] [![Coverage][CoverageIMGURL]][CoverageURL]

[NPMURL]: https://npmjs.org/package/@putout/git-status-porcelain "npm"
[NPMIMGURL]: https://img.shields.io/npm/v/@putout/git-status-porcelain.svg?style=flat&longCache=true
[BuildStatusURL]: https://github.com/putoutjs/git-status-porcelain/actions?query=workflow%3A%22Node+CI%22 "Build Status"
[BuildStatusIMGURL]: https://github.com/putoutjs/git-status-porcelain/workflows/Node%20CI/badge.svg
[LicenseURL]: https://tldrlegal.com/license/mit-license "MIT License"
[LicenseIMGURL]: https://img.shields.io/badge/license-MIT-317BF9.svg?style=flat&longCache=true
[CoverageURL]: https://coveralls.io/github/coderaiser/git-status-porcelain?branch=master
[CoverageIMGURL]: https://coveralls.io/repos/coderaiser/git-status-porcelain/badge.svg?branch=master&service=github

Parse `git status --porcelain` output with a pleasure.

## Install

```
npm i @putout/git-status-porcelain
```

## How to use?

`porcelain` can be used in simpified mode, when you just need names of modified files (`added`, `deleted`, works as well):

```js
const porcelain = require('@putout/git-status-porcelain');

porcelain({
    modified: true,
    untracked: true,
});

// returns
[
    'README.md',
    '1.js',
];
```

But you can get break `porcelain` into pieces as well 😉:

```js
const porcelain = require('@putout/git-status-porcelain');
const {
    run,
    parse,
    pick,
    getNames,
} = porcelain;

// run git status --porcelain
const stdout = run();
// returns
' M README.md\n?? 1.js\n';

const files = parse(stdout);
// returns
[{name: 'README.md', mode: ' M '}, {name: '1.js', mode: '?'}];

const modifiedFiles = pick(files, {
    modified: false,
    untracked: false,
    deleted: false,
    added: false,
    renamed: false,
    unstaged: false,
});
// returns
[{name: 'README.md', mode: ' M '}];

getNames(modifiedFiles);
// returns
['README.md'];
```

## License

MIT
