'use strict';

const {spawnSync} = require('child_process');

const isString = (a) => typeof a === 'string';

module.exports = (str, filter = {}) => {
    if (!isString(str)) {
        filter = str || {};
        str = run();
    }
    
    const {
        added,
        modified,
        untracked,
        deleted,
        renamed,
        unstaged,
    } = filter;
    
    const files = parse(str);
    
    const picked = pick(files, {
        added,
        modified,
        untracked,
        deleted,
        renamed,
        unstaged,
    });
    
    const names = getNames(picked);
    
    return names;
};

const getName = ({name}) => name;

module.exports.getNames = getNames;
function getNames(files) {
    return files.map(getName);
}

module.exports.run = run;
function run() {
    const result = spawnSync('git', ['status', '--porcelain']);
    return result.stdout.toString();
}

module.exports.parse = parse;
function parse(str) {
    const result = [];
    
    const lines = str
        .split('\n')
        .filter(Boolean);
    
    for (const line of lines) {
        const {name, mode} = parseLine(line);
        
        result.push({
            name,
            mode,
        });
    }
    
    return result;
}

const UNTRACKED = '?';
const RENAMED = 'R';
const ARROW = '-> ';

// "R  a -> b" -> "b"
const cutRenameTo = (line) => {
    const i = line.indexOf(ARROW);
    const count = i + ARROW.length;
    
    return line.slice(count);
};

function parseLine(line) {
    const [first] = line;
    
    if (first === UNTRACKED)
        return {
            name: line.replace('?? ', ''),
            mode: UNTRACKED,
        };
    
    if (first === RENAMED)
        return {
            name: cutRenameTo(line),
            mode: RENAMED,
        };
    
    const [mode] = line.match(/^[\sA-Z]+\s/, '');
    const name = line.replace(mode, '');
    
    return {
        name,
        mode,
    };
}

const isModified = ({mode}) => mode === 'M  ' || mode === 'MM ';
const isAdded = ({mode}) => mode === 'A  ';
const isRenamed = ({mode}) => /R/.test(mode);
const isDeleted = ({mode}) => /D/.test(mode);
const isUntracked = ({mode}) => /\?/.test(mode);
const isUnstaged = ({mode}) => mode === ' M ';

const check = ({added, modified, untracked, unstaged, deleted, renamed}) => (file) => {
    let is = false;
    
    if (added)
        is = is || isAdded(file);
    
    if (modified)
        is = is || isModified(file);
    
    if (untracked)
        is = is || isUntracked(file);
    
    if (unstaged)
        is = is || isUnstaged(file);
    
    if (deleted)
        is = is || isDeleted(file);
    
    if (renamed)
        is = is || isRenamed(file);
    
    return is;
};

module.exports.pick = pick;
function pick(files, {added, modified, deleted, untracked, unstaged, renamed}) {
    return files.filter(check({
        added,
        modified,
        untracked,
        unstaged,
        deleted,
        renamed,
    }));
}
