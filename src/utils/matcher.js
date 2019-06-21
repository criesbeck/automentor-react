// conceptMatch() for patterns of the form { "isa": "function"}
// see concepts.json for example ontology
let concepts = {};

const conceptMatch = (pat, obj, tree = {}) => {
  concepts = tree;
  return match(pat, obj);
};

/* match trace kludge
const traceMatch = () => {

}
const match = (pat, obj, blists = [{}])  => {
  console.log(`${JSON.stringify(pat)} = ${JSON.stringify(obj)} ${JSON.stringify(blists)}`)
  const result = matchx(pat, obj, blists);
  console.log(`=> ${JSON.stringify(blists)}`)
  return result;
};
*/

const match = (pat, obj, blists = [{}])  => {
  if (blists.length === 0) {
    return blists;
  } else if (isVar(pat)) {
    return bindVar(pat, obj, blists);
  } else if (typeof pat === "string") {
    return matchSubString(pat, obj, blists);
  } else if (isPrimitive(pat)) {
    return matchPrimitive(pat, obj, blists);
  } else if (Array.isArray(pat)) {
    return matchArray(pat, obj, blists);
  } else if (pat.and) {
    return matchAnd(pat["and"], obj, blists);
  } else if (pat.or) {
    return matchOr(pat["or"], obj, blists);
  } else if (pat.not) {
    return matchNot(pat["not"], obj, blists);
  } else if (pat.some) {
    return matchSome(pat["some"], obj, blists);
  } else if (pat.reg) {
    return matchRegex(pat, obj, blists);
  } else if (pat.isa) {
    return matchIsa(pat.isa, obj, blists);
  } else if (typeof pat === "object") {
    return matchObject(pat, obj, blists);
  } else {
    return [];
  }
}

const matchSubString = (pat, obj, blists)  => {
  if(typeof obj != "string") return [];
  return new RegExp(pat).exec(obj) ? blists : [];
}

const isPrimitive = (x)  => {
  let type = (typeof x);
  return x === null || type === "undefined" ||
      type === "number" || type === "string" ||
      type === "boolean";
}

const matchPrimitive = (pat, obj, blists)  => {
  return pat === obj ? blists : [];
}

const absts = x =>  (concepts[x] && concepts[x].absts) || [];

const isa = (spec, abst) => (
  spec === abst || absts(spec).some(x => isa(x, abst))
);

const matchIsa = (pat, obj, blists) => (
  isa(obj, pat) ? blists : []
);

const matchRegex = (pat, obj, blists)  => {
  if(typeof obj !== 'string') return [];

  let regExp = new RegExp(pat.reg, "g");
  let regResults = regExp.exec(obj);

  if(regResults === null) return [];

  let pats = pat.pats || [];
  var filtered = regResults.filter(x => x);
  return match(pats, filtered.slice(1, pats.length+1), blists);
}

const matchArray = (pat, obj, blists)  => {
  if (pat.length > obj.length) {
      return [];
  }
  return matchingLoop(pat, obj, blists);
}

const matchObject = (pat, obj, blists)  => {
  if (isPrimitive(obj) || Array.isArray(obj) ||
      (Object.keys(pat).length > Object.keys(obj).length)) {
      return [];
  } else {
      return matchingLoop(pat, obj, blists);
  }
}

const matchingLoop = (pat, obj, blists)  => (
  Object.keys(pat).reduce((blists, key) => (
    match(pat[key], obj[key], blists)
  ), blists)
);

const matchAnd = (pat, obj, blists)  => {
  return Object.keys(pat).reduce((blists, key) => (
      match(pat[key], obj, blists)
  ), blists);
}

const matchOr = (pat, obj, blists)  => {
  return Object.keys(pat).reduce((accumulator, key) => (
    accumulator.concat(match(pat[key], obj, blists))
  ), []);
}

const matchNot = (pat, obj, blists)  => {
  return blists.filter(blist => (
    match(pat, obj, [blist]).length === 0
  ))
}

const matchSome = (pat, obj, blists)  => {
  return !obj ? [] : Object.keys(obj).reduce((accumulator, key) => (
    accumulator.concat(match(pat, obj[key], blists))
  ), []);
}

const bindVar = (x, val, blists)  => {
  return blists.reduce((accumulator, blist) => (
    accumulator.concat(matchVar(x, val, blist))
  ), []);
}

const matchVar = (varx, val, blist)  => {
  if (varx in blist) {
      return isVarInBinding(varx, val, blist);
  }
  var newblist = {};
  for (var attrname in blist) {
      newblist[attrname] = blist[attrname];
  }
  newblist[varx] = val;
  return newblist;
}

const isVarInBinding = (varx, val, blist)  => {
  if (match(blist[varx], val).length) return blist;
  else return [];
}

const isVar = (x)  => {
  return (typeof x) === 'string' && x.startsWith('?');
}

export { conceptMatch };
