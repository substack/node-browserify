var browserify = require('../');
var vm = require('vm');
var test = require('tap').test;

test('dependency events', function (t) {
    t.plan(4);
    var b = browserify(__dirname + '/entry/main.js');
    var deps = [];
    b.on('dep', function (row) {
        deps.push({ id: row.id, deps: row.deps });
        t.equal(typeof row.source, 'string');
    });
    
    b.bundle(function (err, src) {
        t.deepEqual(deps.sort(cmp), [
            { id: 1, deps: { './one': 2, './two': 3 } },
            { id: 2, deps: {} },
            { id: 3, deps: {} }
        ]);
    });
    
    function cmp (a, b) {
        return a.id < b.id ? -1 : 1;
    }
});

test('round-trip dependency events', function(t) {
    var b = browserify(__dirname + '/entry/needs_three.js');
    var cache = {};
    b.on('dep', function(row) {
        cache[row.file] = row;
    });

    b.require(__dirname + '/entry/three.js', { expose: 'three' });
    b.bundle(function(err, src) {
        var b2 = browserify(__dirname + '/entry/needs_three.js', { cache: cache });
        b2.require(__dirname + '/entry/three.js', { expose: 'three' });

        b2.bundle(function(err, src) {
            t.ok(!err);
            t.ok(src);
            t.end();
        });
    });
});
