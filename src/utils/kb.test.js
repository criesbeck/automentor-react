import KB from './kb.js';

const theKB = KB({ concepts: {
    "overlay": { "absts": ["image-function"] },
    "image-function": {
      "absts": ["library-function"], "slots": { "library": "image.rkt" } 
    },
    "image.rkt": {
        "absts": ["library"], "slots": { "language": "Racket" } 
    },
    "cs111": { "absts": ["course"], "slots": { "name": "CS 111" }},
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
  expect(theKB.filler('ex-1', 'course')).toBe('cs111');
  expect(theKB.filler('ex-2', 'course')).toBe('cs111');
  expect(theKB.filler('ex-2-1', 'course')).toBe('cs211');
})

test('Slots are inherited', () => {
  expect(theKB.filler('image-function', 'library')).toBe('image.rkt');
  expect(theKB.filler('overlay', 'library')).toBe('image.rkt');
});

test('Filler paths work for roles, including ones that fail', () => {
  expect(theKB.filler('ex-1', 'name')).toBe('Exercise 1');
  expect(theKB.filler('ex-1', 'course', 'name')).toBe('CS 111');
  expect(theKB.filler('ex-1', 'instructor', 'name')).toBeFalsy();
})

test('Search returns the most specific concepts with no slots given', () => {
  const exercises = theKB.search(['exercise']);
  expect(exercises.length).toBe(3);
  expect(exercises).toContain('ex-1');
  expect(exercises).toContain('ex-2');
  expect(exercises).toContain('ex-2-1');
});

test('Search returns the most specific concepts with slots as or more specific than those given', () => {
  expect(theKB.search(['library-function'], { 'library': 'image.rkt'})).toStrictEqual(['overlay'])
  const exercises = theKB.search(['exercise'], { course: 'cs111' });
  expect(exercises.length).toBe(2);
  expect(exercises).toContain('ex-1');
  expect(exercises).toContain('ex-2');
});

test('Search failure returns empty list', () => {
  expect(theKB.search(['exercise'], { course: 'cs214'})).toStrictEqual([]);
  expect(theKB.search(['unicorn'])).toStrictEqual([]);
})

test('toObject handles simple roles', () => {
  const names = ['ex-1', 'ex-2'];
  const obj = theKB.toObject(names, ['name', 'course']);
  expect(obj).toStrictEqual({ 
    'ex-1': { name: 'Exercise 1', course: 'cs111'}, 
    'ex-2': { name: 'Exercise 2', course: 'cs111'}
  });
})

test('toObject handles paths', () => {
  const names = ['overlay'];
  const obj = theKB.toObject(names, ['library.language']);
  expect(obj).toStrictEqual({ 
    'overlay': { 'library-language': 'Racket' }
  });
})
