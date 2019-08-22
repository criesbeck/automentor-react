// a JavaScript port of the Lisp solutions to
// http://www.cs.northwestern.edu/academics/courses/325/exercises/mop-exs.php

const KB = ({ concepts, diagnoses, resources }) => {
  const absts = {};
  let defaultExpectations = null;

  // current CRA is node 10, and Firebase is node 8
  // neither have Array.flatMap

  const flatmap = (arr, fn) => (
    arr.reduce((lst, x) => [...lst, ...fn(x)], [])
  );

  const removeDuplicates = lst => (
    lst.filter((x, i) => i === lst.lastIndexOf(x))
  );

  /* MOP hierarchy */
  
  const lookup = id => concepts[id] || {};

  const isa = (spec, abst) => spec === abst || getAllAbsts(spec).includes(abst);

  const filler = (x, ...path) => pathFiller(x, path);

  const pathFiller = (x, path) => (
    path.reduce((x, role) => x && inheritFiller(x, role), x)
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

  const hasSlots = (name, slots) => (
    Object.keys(slots).every(role => slots[role] === getFiller(name, role))
  );

  const findConcept = (abst, slots) => (
    Object.keys(concepts).find(name => (
      isa(name, abst) && hasSlots(name, slots)
    ))
  );

  const makeConcept = (abst, slots) => {
    const name = `${abst}-${Object.values(slots).join('-')}`;
    concepts[name] = { absts: [abst], slots };
    return name;
  };

  const reference = (abst, slots = {}) => (
    findConcept(abst, slots) || makeConcept(abst, slots)
  );

  /* DMAP parser */

  const initialExpectations = () => {
    const slots = {};
    const matched = [];
    const getExpectations = base => (
      (concepts[base].phrases || []).map(phrase => ({
        phrase, base, slots, matched
      }))
    );
    if (!defaultExpectations) {
      defaultExpectations = Object.keys(concepts).reduce((expectations, base) => (
        [...expectations, ...getExpectations(base)]
      ), []);
    }
    return defaultExpectations;
  };

  const target = exp => {
    const focus = exp.phrase[0];
    return typeof focus === 'string' ? focus : pathFiller(exp.base, focus);
  };

  const nextExpectation = (exp, item) => (
    {
      ...exp,
      phrase: exp.phrase.slice(1),
      matched: [...exp.matched, item],
      slots:
        item === target(exp) 
        ? exp.slots 
        : {...exp.slots, [exp.phrase[0]]: item }
    }
  );

  const wordMatches = (exp, word) => (
    exp.phrase[0] && word === exp.phrase[0]
  );

  const conceptMatches = (exp, concept) => {
    if (!exp.phrase[0] || typeof exp.phrase[0] === 'string') {
      return false;
    }
    return isa(concept, target(exp));
  };

  const wordAdvance = (expectations, word) => (
    expectations
      .filter(exp => wordMatches(exp, word))
      .map(exp => nextExpectation(exp, word))
  );

  const conceptAdvance = (expectations, concept) => (
    expectations
      .filter(exp => { if (!exp.phrase) debugger; return conceptMatches(exp, concept) })
      .map(exp => nextExpectation(exp, concept))
  );

  const conceptsAdvance = (exps, concepts) => {
    return flatmap(concepts, concept => conceptAdvance(exps, concept))
  };

  const nextExpectations = (newExps, exps) => {
    return newExps.length === 0
    ? []
    : newExps.concat(nextExpectations(conceptsAdvance(exps, references(newExps)), exps))
  };

  const parseWord = (exps, word) => {
    return nextExpectations(wordAdvance(exps, word), exps)
  }

  const parseWords = (exps, words) => (
    words.reduce((exps, word) => (
      parseWord(exps, word).concat(exps)
    ), exps)
  );

  const dmap = (text, exps = initialExpectations()) => (
    parseWords(exps, text.split(' '))
  );

  const references = expectations => {
    const finished = expectations.filter(expectation => expectation.phrase.length === 0);
    return finished.map(expectation => reference(expectation.base, expectation.slots))
  };

  return { concepts, diagnoses, dmap, isa, filler, lookup, 
           reference, references, resources, toObject };
};

export default KB;