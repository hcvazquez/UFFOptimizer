/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module unified
 * @fileoverview Test suite for `unified`.
 */

'use strict';

/* Dependencies. */
var test = require('tape');
var unified = require('..');

/* Tests. */
test('unified()', function (t) {
  var count;
  var p;
  var q;

  t.throws(
    function () {
      unified.use(Function.prototype);
    },
    /Cannot invoke `use` on abstract processor/,
    'should be abstract'
  );

  p = unified();

  t.equal(typeof p, 'function', 'should return a function');

  p.use(function (processor) {
    count++;
    processor.data('foo', 'bar');
  });

  count = 0;
  q = p();

  t.equal(
    count,
    1,
    'should create a new processor implementing the ' +
    'ancestral processor when invoked (#1)'
  );

  t.equal(
    q.data('foo'),
    'bar',
    'should create a new processor implementing the ' +
    'ancestral processor when invoked (#2)'
  );

  t.equal(unified.writable, true, 'should be `writable`');
  t.equal(unified.readable, true, 'should be `readable`');
  t.equal(typeof unified.on, 'function', 'should have `on`');
  t.equal(typeof unified.emit, 'function', 'should have `emit`');

  t.end();
});
