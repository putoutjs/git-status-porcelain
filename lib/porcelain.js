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
    } = filter;
    
    const files = parse(str);
    const picked = pick(files, {
        added,
        modified,
        untracked,
        deleted,
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

function parseLine(line) {
    const [first] = line;
    
    if (first === '?')
        return {
            name: line.replace('?? ', ''),
            mode: '?',
        };
    
    const [mode] = line.match(/^[\sA-Z]{1,}\s/, '');
    const name = line.replace(mode, '');
    
    return {
        name,
        mode,
    };
}

const isModified = ({mode}) => /M/.test(mode);
const isAdded = ({mode}) => /A/.test(mode);
const isDeleted = ({mode}) => /D/.test(mode);
const isUntracked = ({mode}) => /\?/.test(mode);

const check = ({added, modified, untracked, deleted}) => (file) => {
    let is = false;
    
    if (added)
        is = is || isAdded(file);
    
    if (modified)
        is = is || isModified(file);
    
    if (untracked)
        is = is || isUntracked(file);
    
    if (deleted)
        is = is || isDeleted(file);
    
    return is;
};

module.exports.pick = pick;
function pick(files, {added, modified, deleted, untracked}) {
    return files.filter(check({
        added,
        modified,
        untracked,
        deleted,
    }));
}

