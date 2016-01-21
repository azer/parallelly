var test = require("prova");
var parallelly = require("./");

test('composing functions into one', function (assert) {
  var calledFirst, calledSecond, calledThird;

  assert.plan(7);

  parallelly()
    .run(foo, ['hello', 'world', '!'])
    .and('bar-alias', bar, [1, 2, 3])
    .and(qux, [4, 5, 6])
    .and(second)
    .and(third)
    .and(first)
    .done(function (errors, results) {
      assert.ok(calledThird);
      assert.notOk(errors);
      assert.deepEqual(results.foo, ['hello\nworld\n!']);
      assert.deepEqual(results['bar-alias'], [6]);
      assert.deepEqual(results.qux, [120]);
    });

  function first (done) {
    calledFirst = true;
    done();
  }

  function second (done) {
    setTimeout(function () {
      assert.ok(calledFirst);
      calledSecond = true;
      done();
    }, 200);
  }

  function third (done) {
    setTimeout(function () {
      assert.ok(calledSecond);
      calledThird = true;
      done();
    }, 250);
  }

});

test('returns errors', function (assert) {
  parallelly()
    .run(foo, ['hello', 'world', '!'])
    .and(fail)
    .and('bar-alias', bar, [1, 2, 3])
    .and(qux, [4, 5, 6])
    .done(function (errors, results) {
      assert.ok(errors);
      assert.equal(errors[0].name, 'fail');
      assert.equal(errors[0].error.message, 'fail');
      assert.deepEqual(results.foo, ['hello\nworld\n!']);
      assert.deepEqual(results['bar-alias'], [6]);
      assert.deepEqual(results.qux, [120]);
      assert.end();
    });
});

test('allows customizing context', function (t) {
  t.plan(3);

  var ctx = {};

  parallelly({ context: ctx })
    .then(function (next) {
      t.equal(this, ctx);
      next();
    })
    .then(function (next) {
      t.equal(this, ctx);
      next();
    })
    .done(function () {
      t.notEqual(this, ctx);
    });
});

function foo (pa, ra, ms, callback) {
  callback(undefined, pa + '\n' + ra + '\n' + ms);
}

function bar (pa, ra, ms, callback) {
  setTimeout(function () {
    callback(undefined, pa + ra + ms);
  }, 250);
}

function qux (pa, ra, ms, callback) {
  setTimeout(function () {
    callback(undefined, pa * ra * ms);
  }, 50);
}

function fail (callback) {
  callback(new Error('fail'));
}
