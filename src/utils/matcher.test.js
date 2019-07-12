import { match } from './matcher';

test('match is defined', () => {
  expect(typeof match).toBe('function');
});

test('[?x, ?x] matches a tuple starting with the same item twice', () => {
  expect(match(['?x', '?x'], [1, 1])).toHaveLength(1);
  expect(match(['?x', '?x'], [1, 1, 1])).toHaveLength(1);
  expect(match(['?x', '?x'], [1, 2])).toHaveLength(0);
  expect(match(['?x', '?x'], [1])).toHaveLength(0);
  expect(match(['?x', '?x'], [2, 1, 1])).toHaveLength(0);
});

test('{ fn: fn, args: [a, b], pat: pat } matches x if (fn x a b) matches pat', () => {
  const minus = (x, y) => x - y;
  expect(match({ fn: minus, args: [2], pat: 3 }, 5)).toHaveLength(1);
  expect(match({ fn: minus, args: [2], pat: 3 }, 6)).toHaveLength(0);
});

