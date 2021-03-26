var test = require('tap').test;
var fs = require('fs');
var path = require('path');
var vm = require('vm');
var browserify = require('../');
var temp = require('temp');
temp.track();
var tmpdir = temp.mkdirSync({prefix: 'browserify-test'});

test('no browser field builtin', function (t) {
    t.plan(2);
    var src = fs.readFileSync(path.join(__dirname, '/browser_field_builtin/main.js'));
    fs.writeFileSync(path.join(tmpdir, 'main.js'), src);
    var b = browserify({
        entries: path.join(tmpdir, 'main.js'),
        browserField: false
    });
    b.bundle(function (err, src) {
        t.ifError(err);
        vm.runInNewContext(src, { console: { log: log } });
        function log (msg) { t.deepEqual(msg, { a: 'b' }) }
    });
});

test('no browser field excluded builtin', function (t) {
    t.plan(2);
    var src = fs.readFileSync(path.join(__dirname, '/browser_field_builtin/main.js'));
    fs.writeFileSync(path.join(tmpdir, 'main.js'), src);
    var b = browserify({
        entries: path.join(tmpdir, 'main.js'),
        builtins: ['path', 'util'],
        browserField: false
    });
    b.bundle(function (err, src) {
        t.ifError(err);
        t.throws(function () {
            vm.runInNewContext(src, { console: { log: function(){} } });
        }, /Cannot find module 'querystring'/)
    });
})
