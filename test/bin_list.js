var test = require('tap').test;
var spawn = require('child_process').spawn;
var path = require('path');
var vm = require('vm');

test('bin --list', function (t) {
    t.plan(3);

    var cwd = process.cwd();
    process.chdir(path.resolve(__dirname, 'list'));

    var ps = spawn(process.execPath, [
        path.resolve(__dirname, '../bin/cmd.js'),
        '--list', 'main.js'
    ]);
    var out = '';
    var err = '';
    ps.stdout.on('data', function (buf) { out += buf });
    ps.stderr.on('data', function (buf) { err += buf });

    var expected = [
      path.resolve(__dirname, 'list/main.js'),
      path.resolve(__dirname, 'list/node_modules/qq/b.js'),
      path.resolve(__dirname, 'list/node_modules/qq/node_modules/a/index.js'),
      path.resolve(__dirname, 'list/node_modules/qq/node_modules/z/index.js')
    ].join('\n') + '\n';

    ps.on('exit', function (code) {
        t.equal(code, 0, 'command exited cleanly');
        t.equal(err, '', 'nothing reported to stderr');
        t.equal(out, expected, 'expected file list');
    });
});

test('bin --require --list', function (t) {
    t.plan(3);

    var cwd = process.cwd();
    process.chdir(path.resolve(__dirname, 'list'));

    var ps = spawn(process.execPath, [
        path.resolve(__dirname, '../bin/cmd.js'),
        '--list', '--require', 'qq'
    ]);
    var out = '';
    var err = '';
    ps.stdout.on('data', function (buf) { out += buf });
    ps.stderr.on('data', function (buf) { err += buf });

    var expected = [
      path.resolve(__dirname, 'list/node_modules/qq/b.js'),
      path.resolve(__dirname, 'list/node_modules/qq/node_modules/a/index.js'),
      path.resolve(__dirname, 'list/node_modules/qq/node_modules/z/index.js')
    ].join('\n') + '\n';

    ps.on('exit', function (code) {
        t.equal(code, 0, 'command exited cleanly');
        t.equal(err, '', 'nothing reported to stderr');
        t.equal(out, expected, 'expected file list');
    });
});

test('bin --require --list [expose]', function (t) {
    t.plan(3);

    var cwd = process.cwd();
    process.chdir(path.resolve(__dirname, 'list'));

    var ps = spawn(process.execPath, [
        path.resolve(__dirname, '../bin/cmd.js'),
        '--list', '--require', 'qq:zz'
    ]);
    var out = '';
    var err = '';
    ps.stdout.on('data', function (buf) { out += buf });
    ps.stderr.on('data', function (buf) { err += buf });

    var expected = [
      path.resolve(__dirname, 'list/node_modules/qq/b.js'),
      path.resolve(__dirname, 'list/node_modules/qq/node_modules/a/index.js'),
      path.resolve(__dirname, 'list/node_modules/qq/node_modules/z/index.js')
    ].join('\n') + '\n';

    ps.on('exit', function (code) {
        t.equal(code, 0, 'command exited cleanly');
        t.equal(err, '', 'nothing reported to stderr');
        t.equal(out, expected, 'expected file list');
    });
});

test('bin --require --list [builtin]', function (t) {
    t.plan(3);

    var cwd = process.cwd();
    process.chdir(path.resolve(__dirname, 'list'));

    var ps = spawn(process.execPath, [
        path.resolve(__dirname, '../bin/cmd.js'),
        '--list', '--require', 'qq', '--require', 'events'
    ]);
    var out = '';
    var err = '';
    ps.stdout.on('data', function (buf) { out += buf });
    ps.stderr.on('data', function (buf) { err += buf });

    var expected = [
      path.resolve(__dirname, '../node_modules/events/events.js'),
      path.resolve(__dirname, 'list/node_modules/qq/b.js'),
      path.resolve(__dirname, 'list/node_modules/qq/node_modules/a/index.js'),
      path.resolve(__dirname, 'list/node_modules/qq/node_modules/z/index.js')
    ].join('\n') + '\n';

    ps.on('exit', function (code) {
        t.equal(code, 0, 'command exited cleanly');
        t.equal(err, '', 'nothing reported to stderr');
        t.equal(out, expected, 'expected file list');
    });
});
