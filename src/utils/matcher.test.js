import { instantiate, match, xmatch } from './matcher';
import concepts from 'data/concepts.json';
import KB from 'utils/kb.js';

const bindings = (pat, blists) => (
  blists.map(blist => instantiate(pat, blist))
);

expect.extend({
  toBind(blists, x, val) {
    return (
      bindings(x, blists).includes(val)
      ? { pass: true }
      : { pass: false, message: () => `expected ${x} to be bound to ${val}`}
    )
  },
  toFail(received) {
    return (
      received.length === 0
      ? { pass: true }
      : { pass: false, message: () => `expected match failure`}
    )
  },
  toPass(received) {
    return (
      received.length > 0
      ? { pass: true }
      : { pass: false, message: () => `expected match success`}
    )
  }
});

test('match is defined', () => {
  expect(typeof match).toBe('function');
});

test('basic matching works', () => {
  expect(match(['?x', '?x'], [1, 1])).toBind('?x', 1);
  expect(match(['?x', '?x'], [1, 2])).toFail();
  const diff = match(['?x', '?y'], [1, 2]);
  expect(diff).toBind('?x', 1);
  expect(diff).toBind('?y', 2);
  const same = match(['?x', '?y'], [1, 1])
  expect(same).toBind('?x', 1)
  expect(same).toBind('?y', 1);
})

test('instantiate [?x, ?y] is [1, 2] if ?x and ?y are 1 and 2', () => {
  expect(instantiate(['?x', '?y'], {'?y': 2, '?x': 1})).toEqual([1, 2]);
});

test('[?x, ?x] matches a tuple starting with the same item twice', () => {
  expect(match(['?x', '?x'], [1, 1])).toBind('?x', 1);
  expect(match(['?x', '?x'], [1, 1, 1])).toBind('?x', 1);
  expect(match(['?x', '?x'], [1, 2])).toFail();
  expect(match(['?x', '?x'], [1])).toFail(0);
  expect(match(['?x', '?x'], [2, 1, 1])).toFail(0);
});

test('{ not: { some: 2 } } matches [1, 3] and not [1, 2]', () => {
  expect(match({not: { some: 2 }}, [1, 3])).toPass();
  expect(match({not: { some: 2 }}, [1, 2])).toFail();
});

test('{ pat: pat, fn: fn, args: [a, b] } matches x if pat matches (fn x a b)', () => {
  const minus = (x, y) => x - y;
  expect(match({ pat: 3, fn: minus, args: [2] }, 5)).toPass();
  expect(match({ pat: 3, fn: minus, args: [2] }, 6)).toFail();
  expect(match([{ pat: '?x', fn: minus, args: [2] }, '?x'], [5, 3])).toBind('?x', 3);
  expect(match([{ pat: '?x', fn: minus, args: [2] }, '?x'], [5, 5])).toFail();
  expect(match(['?x', { pat: 2, fn: minus, args: ['?x']}], [1, 3])).toBind('?x', 1);
  expect(match(['?x', { pat: 2, fn: minus, args: ['?x']}], [1, 2])).toFail();
});

test('{ if: p, args: [ a, b ] } matches x if p(x, a, b) is true', () => {
  const less = (a, b) => a < b;
  expect(match({ if: less, args: [4] }, 2)).toPass();
  expect(match({ if: less, args: [4] }, 4)).toFail();
  expect(match([ '?x', { if: less, args: ['?x'] }], [3, 1])).toBind('?x', 3);
  expect(match([ '?x', { if: less, args: ['?x'] }], [1, 3])).toFail();
});

test('xmatch({ if: "less", args: [m] }, n, { "less": ... })) matches if n < m', () => {
  const context = { less: (a, b) => a < b };
  expect(xmatch({ if: 'less', args: [4] }, 2, context)).toPass();
  expect(xmatch({ if: 'less', args: [4] }, 4, context)).toFail();
  expect(xmatch([ '?x', { if: 'less', args: ['?x'] }], [3, 1], context)).toBind('?x', 3);
  expect(xmatch([ '?x', { if: 'less', args: ['?x'] }], [1, 3], context)).toFail();
});

test('xmatch(x, y, kb) works for isa matching', () => {
  const kb = KB({ concepts });
  expect(xmatch({ if: 'isa', args: ['function'] }, 'overlay', kb)).toPass();
  expect(xmatch({ if: 'isa', args: ['function']}, 'cs111', kb)).toFail();
});

test('xmatch({ pat: ?x, fn: filler, args:[role]}, obj, kb) binds ?x to filler of role', () => {
  const kb = KB({ concepts });
  expect(xmatch({ pat: 'image.rkt', fn: 'filler', args: ['library']}, 'overlay', kb)).toPass();
  expect(xmatch({ pat: 'image.rkt', fn: 'filler', args: ['cs111']}, 'cs111', kb)).toFail();
});
