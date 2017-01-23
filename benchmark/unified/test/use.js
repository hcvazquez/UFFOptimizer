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
test('use(plugin[, options])', function (t) {
  var p = unified();
  var o = {};
  var n;

  t.plan(11);

  p.use(function (processor, options) {
    t.equal(processor, p, 'should invoke a plugin with `processor`');
    t.equal(options, o, 'should invoke a plugin with `options`');
  }, o);

  p.use([
    function (processor) {
      t.equal(processor, p, 'should support a list of plugins (#1)');
    },
    function (processor) {
      t.equal(processor, p, 'should support a list of plugins (#2)');
    }
  ]);

  p.use([function (processor) {
    t.equal(processor, p, 'should support a list of one plugin');
  }]);

  p.use([function (processor, options) {
    t.equal(options, o, 'should support a plugin--options tuple');
  }, o]);

  p.use([
    [function (processor, options) {
      t.equal(options, o, 'should support a matrix (#1)');
    }, o],
    [function (processor) {
      t.equal(processor, p, 'should support a matrix (#2)');
    }]
  ]);

  n = {type: 'test'};

  p.use(function () {
    return function (node, file) {
      t.equal(node, n, 'should attach a transformer (#1)');
      t.ok('message' in file, 'should attach a transformer (#2)');

      throw new Error('Alpha bravo charlie');
    };
  });

  t.throws(
    function () {
      p.run(n);
    },
    /Error: Alpha bravo charlie/,
    'should attach a transformer (#3)'
  );

  t.end();
});

/* Processors. */
test('use(processor)', function (t) {
  var p = unified();
  var q = unified();
  var o = {};
  var n;
  var res;
  var fixture;

  t.plan(12);

  res = p.use(q);

  t.equal(res, p, 'should return the origin processor');
  t.equal(p.attachers[0][0], q, 'should store attachers');

  p = unified();
  q = unified();

  fixture = q;

  q.use(function (processor, options) {
    t.equal(processor, fixture, 'should invoke a plugin with `processor`');
    t.equal(options, o, 'should invoke a plugin with `options`');
  }, o);

  fixture = p;

  p.use(q);

  q = unified();
  p = unified().use(q);
  n = {type: 'test'};

  q.use(function () {
    return function (node, file) {
      t.equal(node, n, 'should attach a transformer (#1)');
      t.ok('message' in file, 'should attach a transformer (#2)');

      throw new Error('Alpha bravo charlie');
    };
  });

  p.use(q);

  t.throws(
    function () {
      p.run(n);
    },
    /Error: Alpha bravo charlie/,
    'should attach a transformer (#3)'
  );

  p = unified().use(function (processor) {
    processor.Parser = ParserA;
  });

  q = unified().use(function (processor) {
    processor.Parser = ParserB;
  });

  t.equal(p.Parser, ParserA);
  t.equal(q.Parser, ParserB);

  p.use(q);

  t.equal(p.Parser, ParserA);

  function ParserA() {}
  function ParserB() {}

  t.end();
});
