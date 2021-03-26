var browserify = require('../');
var vm = require('vm');
var test = require('tap').test;

test('standalone with require exposes correct module', function (t) {
	t.plan(3);

	var b = browserify(__dirname + '/standalone_require/a.js', {
		standalone: 'A'
	});

	// Require in B
	b.require(__dirname + '/standalone_require/b.js', {expose: 'b'});

	b.bundle(function (err, src) {
		t.test('window global', function (t) {
			t.plan(1);
			var c = { window: {} };
			vm.runInNewContext(src, c);
			t.equal(c.window.A, "A");
		});
		t.test('CommonJS', function (t) {
			t.plan(1);
			var exp = {};
			var c = {
				module: { exports: exp },
				exports: exp
			};
			vm.runInNewContext(src, c);
			t.equal(c.module.exports, "A");
		});
		t.test('RequireJS', function (t) {
			t.plan(1);
			var c = {
				define: function (dependencies, fn) {
					t.equal(fn(), "A");
				}
			};
			c.define.amd = true;
			vm.runInNewContext(src, c);
		});
	});
});