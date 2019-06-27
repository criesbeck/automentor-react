import KB from './kb.js';

const theKB = new KB({ concepts: {
    "overlay": { "absts": ["image-function"] },
    "image-function": {
      "absts": ["library-function"], "slots": { "library": "image.rkt" } },
    "cs111": { "absts": ["course"] },
    "ex-1": { 
      "absts": ["exercise"],
      "slots": { "course": "cs111", "name": "Exercise 1" }
    },
    "ex-2": {
      "absts": ["exercise"],
      "slots": { "course": "cs111", "name": "Exercise 2" }
    },
    "ex-2-1": {
      "absts": ["exercise"],
      "slots": { "course": "cs211", "name": "Exercise 2.1" }
    }
  }
});

test('ISA is reflexive with unknown terms', () => {
  expect(theKB.isa("course", "course")).toBeTruthy();
  expect(theKB.isa("foo", "foo")).toBeTruthy();
});

test('ISA is not symmetric', () => {
  expect(theKB.isa("cs111", "course")).toBeTruthy();
  expect(theKB.isa("course", "cs111")).toBeFalsy();
});

test('ISA is transitive', () => {
  expect(theKB.isa("overlay", "image-function")).toBeTruthy();
  expect(theKB.isa("image-function", "library-function")).toBeTruthy();
  expect(theKB.isa("overlay", "library-function")).toBeTruthy();
});

test('Local slots are returned', () => {
  expect(theKB.inheritFiller('ex-1', 'course')).toBe('cs111');
  expect(theKB.inheritFiller('ex-2', 'course')).toBe('cs111');
  expect(theKB.inheritFiller('ex-2-1', 'course')).toBe('cs211');
})

test('Slots are inherited', () => {
  expect(theKB.inheritFiller('image-function', 'library')).toBe('image.rkt');
  expect(theKB.inheritFiller('overlay', 'library')).toBe('image.rkt');
});

test('Search returns the most specific concepts with no slots given', () => {
  const exercises = theKB.search(['exercise']);
  expect(exercises.length).toBe(3);
  expect(exercises).toContain('ex-1');
  expect(exercises).toContain('ex-2');
  expect(exercises).toContain('ex-2-1');
});

test('Search returns the most specific concepts with slots as or more specific than those given', () => {
  expect(theKB.search(['library-function'], { 'library': 'image.rkt'})).toStrictEqual(['overlay'])
  const exercises = theKB.search(['exercise'], { 'course': 'cs111' });
  expect(exercises.length).toBe(2);
  expect(exercises).toContain('ex-1');
  expect(exercises).toContain('ex-2');
});