import { instantiate, match, xmatch } from './matcher';
import concepts from 'data/concepts.json';
import KB from 'utils/kb.js';

test('match is defined', () => {
  expect(typeof match).toBe('function');
});

test('instantiate [?x, ?y] is [1, 2] if ?x and ?y are 1 and 2', () => {
  expect(instantiate(['?x', '?y'], {'?y': 2, '?x': 1})).toEqual([1, 2]);
})

test('[?x, ?x] matches a tuple starting with the same item twice', () => {
  expect(match(['?x', '?x'], [1, 1])).toHaveLength(1);
  expect(match(['?x', '?x'], [1, 1, 1])).toHaveLength(1);
  expect(match(['?x', '?x'], [1, 2])).toHaveLength(0);
  expect(match(['?x', '?x'], [1])).toHaveLength(0);
  expect(match(['?x', '?x'], [2, 1, 1])).toHaveLength(0);
});

test('{ pat: pat, fn: fn, args: [a, b] } matches x if pat matches (fn x a b)', () => {
  const minus = (x, y) => x - y;
  expect(match({ pat: 3, fn: minus, args: [2] }, 5)).toHaveLength(1);
  expect(match({ pat: 3, fn: minus, args: [2] }, 6)).toHaveLength(0);
  expect(match(['?x', { pat: 2, fn: minus, args: ['?x']}], [1, 3])).toHaveLength(1);
  expect(match(['?x', { pat: 2, fn: minus, args: ['?x']}], [1, 2])).toHaveLength(0);
});

test('{ if: p, args: [ a, b ] } matches x if p(x, a, b) is true', () => {
  const less = (a, b) => a < b;
  expect(match({ if: less, args: [4] }, 2)).toHaveLength(1);
  expect(match({ if: less, args: [4] }, 4)).toHaveLength(0);
  expect(match([ '?x', { if: less, args: ['?x'] }], [3, 1])).toHaveLength(1);
  expect(match([ '?x', { if: less, args: ['?x'] }], [1, 3])).toHaveLength(0);
})

test('xmatch(x, y, functionContext) works', () => {
  const context = { less: (a, b) => a < b };
  expect(xmatch({ if: 'less', args: [4] }, 2, context)).toHaveLength(1);
  expect(xmatch({ if: 'less', args: [4] }, 4, context)).toHaveLength(0);
  expect(xmatch([ '?x', { if: 'less', args: ['?x'] }], [3, 1], context)).toHaveLength(1);
  expect(xmatch([ '?x', { if: 'less', args: ['?x'] }], [1, 3], context)).toHaveLength(0);
})

test('xmatch(x, y, kb) works for isa matching', () => {
  const kb = new KB({ concepts });
  const context = { isa: kb.isa.bind(kb) };
  expect(xmatch({ if: 'isa', args: ['function'] }, 'overlay', context)).toHaveLength(1);
  expect(xmatch({ if: 'isa', args: ['function']}, 'cs111', context)).toHaveLength(0);
})
