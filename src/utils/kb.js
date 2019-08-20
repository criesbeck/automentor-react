import { removeDuplicates } from './utils';

// a JavaScript port of the Lisp solutions to
// http://www.cs.northwestern.edu/academics/courses/325/exercises/mop-exs.php

const KB = ({ concepts, diagnoses, resources }) => {
  const absts = {};
  let defaultExpectations = null;
  
  const lookup = id => concepts[id] || {};

  const isa = (spec, abst) => spec === abst || getAllAbsts(spec).includes(abst);

  const filler = (x, ...path) => pathFiller(x, path);

  const pathFiller = (x, path) => (
    path.reduce((x, role) => x && inheritFiller(x, role), x)
  );

  const search = (absts = [], slots = {}) => (
    removeAbstractions(
      removeDuplicates(
        Object.keys(concepts).filter(name => satisfies(name, absts, slots))
      )
    )
  );

  const toObject = (names, roles) => {
    // map "roles" such as "parent.age" to parent-age: pathFiller(x, ['parent', 'age'])
    const paths = roles.map(role => role.split('.'));
    const fillerOf = (name) => (
      paths.reduce((obj, path) => ({...obj, [path.join('-')]: pathFiller(name, path)}), {})
    );
    return (
      names.reduce((obj, name) => ({...obj, [name]: fillerOf(name)}), {})
    )
  };

  const removeAbstractions = (lst) => (
    lst.filter(x => !(lst.some(y => x !== y && isa(y, x))))
  );

  const satisfies = (name, absts, slots) => (
    absts.every(abst => isa(name, abst))
    && Object.keys(slots).every(role => hasFiller(name, role, slots[role]))
  );

  const getAllAbsts = (name) => {
    const concept = concepts[name]
    if (!concept) return [name]
    if (!absts[name]) {
      const parents = concept.absts || []
      // flatmap not in node so not available in npm run test
      const allAbsts = parents.reduce((absts, abst) => absts.concat(getAllAbsts(abst)), []);
      absts[name] = [name].concat(removeDuplicates(allAbsts));
    }
    return absts[name]
  };

  const getFiller = (name, role) => {
    const concept = concepts[name]
    return concept && concept.slots && concept.slots[role]
  };

  const inheritFiller = (name, role) => {
    const abst = getAllAbsts(name).find(abst => getFiller(abst, role) !== undefined);
    return abst && getFiller(abst,role);
  }

  const hasFiller = (name, role, filler) => {
    const x = inheritFiller(name, role);
    return x !== undefined && isa(x, filler)
  }

  const initialExpectations = () => {
    const getExpectations = base => (
      (concepts[base].phrases || []).map(phrase => ({
        phrase, base, slots: []
      }))
    );
    if (!defaultExpectations) {
      defaultExpectations = Object.keys(concepts).reduce((expectations, base) => (
        [...expectations, ...getExpectations(base)]
      ), []);
    }
    return defaultExpectations;
  };

  const nextExpectation = (expectation, role, filler) => (
    role
    ? {
      phrase: expectation.phrase.slice(1),
      slots: [...expectation.slots, { role, filler } ]
    }
    : { 
      phrase: expectation.phrase.slice(1)
    }
  );

  const itemsAdvance = (expectations, items) => (
    items.reduce((expectations, item) => (
      [...expectations, ...itemAdvance(expectations, { concept: item })]
    ), [])
  );

  const pathMatch = (item, expectation) => (
    Array.isArray(expectation.phrase[0]) 
    && isa(item, pathFiller(expectation.base, expectation.phrase[0]))
  );

  const itemAdvance = (expectations, item ) => (
    expectations.reduce((expectations, expectation) => (
      [
        ...expectations,
        expectation.phrase.length === 0
        ? expectation
        : item.word && item.word === expectation.phrase[0]
        ? nextExpectation(expectation)
        : item.concept && pathMatch(item.concept, expectation)
        ? nextExpectation(expectation, expectation.phrase[0][0], item)
        : expectation
      ]
    ), [])
  );

  const updateExpectations = (expectations, word) => (
    itemsAdvance(expectations, references(itemAdvance(expectations, { word })))
  );

  const dmap = (text, expectations = initialExpectations()) => (
    text.reduce((expectations, word) => (
      [...updateExpectations(expectations, word), ...expectations]
    ), expectations)
  );

  const references = expectations => (
    expectations.filter(expectation => expectation.phrase.length === 0)
      .map(expectation => search([expectation.base], expectation.slots))
  );

  return { concepts, diagnoses, dmap, isa, filler, lookup, 
    references, resources, search, toObject };
};

export default KB;