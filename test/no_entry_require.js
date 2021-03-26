var test = require('tap').test;
var browserify = require('../');
var through = require('through2');
var vm = require('vm');

test('require with no entry file', function (t) {
	t.plan(1);

	var b = browserify();
	b.require(__dirname + '/no_entry_require/a.js');
	b.bundle(function (err, src) {
		var c = { window: {} };
		vm.runInNewContext(src, c);
		t.equal(c.require(__dirname + '/no_entry_require/a.js'), "foo");
	});
});

test('exposed require with no entry file', function (t) {
	t.plan(1);

	var b = browserify();
	b.require(__dirname + '/no_entry_require/a.js', {expose: 'a'});
	b.bundle(function (err, src) {
		var c = { window: {} };
		vm.runInNewContext(src, c);
		t.equal(c.require('a'), "foo");
	});
});