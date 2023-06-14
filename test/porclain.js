'use strict';

const {join} = require('path');
const {readFileSync} = require('fs');
const child_process = require('child_process');

const {reRequire} = require('mock-require');

const {test, stub} = require('supertape');
const porclain = require('..');
const readFixture = (a) => readFileSync(join(__dirname, 'fixture', a), 'utf8');
const modified = readFixture('modified');
const renamed = readFixture('renamed');
const untracked = readFixture('untracked');
const deleted = readFixture('deleted');

test('porclain: deleted, modified, untracked', (t) => {
    const result = porclain(deleted, {
        deleted: true,
        unstaged: true,
        untracked: true,
    });
    
    const expected = [
        'lib/entry.json',
        'lib/header.json',
        'lib/parse-entries.js',
        'lib/parse-entry.js',
        'lib/parse-git-index.js',
        'package.json',
        'lib/parse.js',
    ];
    
    t.deepEqual(result, expected);
    t.end();
});

test('porclain: modified', (t) => {
    const result = porclain(modified, {
        modified: true,
    });
    
    const expected = [
        'lib/parse-header.js',
        'package.json',
    ];
    
    t.deepEqual(result, expected);
    t.end();
});

test('porclain: added', (t) => {
    const result = porclain(deleted, {
        added: true,
    });
    
    const expected = [
        'lib/parse-header.js',
    ];
    
    t.deepEqual(result, expected);
    t.end();
});

test('porclain: renamed', (t) => {
    const result = porclain(renamed, {
        renamed: true,
    });
    
    const expected = [
        'packages/putout/2.js',
    ];
    
    t.deepEqual(result, expected);
    t.end();
});

test('porclain: deleted', (t) => {
    const result = porclain(deleted, {
        deleted: true,
    });
    
    const expected = [
        'lib/entry.json',
        'lib/header.json',
        'lib/parse-entries.js',
        'lib/parse-entry.js',
        'lib/parse-git-index.js',
    ];
    
    t.deepEqual(result, expected);
    t.end();
});

test('porclain: untracked', (t) => {
    const result = porclain(untracked, {
        untracked: true,
    });
    
    const expected = [
        '.eslintrc.json',
        '.gitignore',
        '.npmignore',
        '.travis.yml',
        'README.md',
        'lib/',
        'madrun.js',
        'package.json',
        'test/',
    ];
    
    t.deepEqual(result, expected);
    t.end();
});

test('porclain: no str', (t) => {
    const {spawnSync} = child_process;
    const porclain = reRequire('..');
    
    child_process.spawnSync = stub().returns({
        stdout: [],
    });
    
    const result = porclain({});
    
    const expected = [];
    
    child_process.spawnSync = spawnSync;
    
    t.deepEqual(result, expected);
    t.end();
});

test('porclain: no filter', (t) => {
    const {spawnSync} = child_process;
    const porclain = reRequire('..');
    
    child_process.spawnSync = stub().returns({
        stdout: [],
    });
    
    const result = porclain();
    
    const expected = [];
    
    child_process.spawnSync = spawnSync;
    
    t.deepEqual(result, expected);
    t.end();
});
