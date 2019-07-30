// functions enables arbitrary functions to be passed for matching
let functions = {}
let depth = 0

const xmatch = (pat, obj, fns = {}) => {
  functions = fns
  return match(pat, obj)
}

const traceIf = (trace) => {
  depth = 0;
  match = trace ? _traceMatch : _match;
};

const _traceMatch = (pat, obj, blists = [{}]) => {
  const indent = ' '.repeat(depth)
  console.log(`${indent}${JSON.stringify(pat)} = ${JSON.stringify(obj)} ${JSON.stringify(blists)}`)
  depth += 2;
  const result = _match(pat, obj, blists);
  depth -= 2;
  console.log(`${indent}=> ${JSON.stringify(result)}`)
  return result;
};

const _match = (pat, obj, blists = [{}]) => {
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
  } else if (pat.fn) {
    return matchFunction(pat, obj, blists);
  } else if (pat.if) {
    return matchIf(pat, obj, blists);
  } else if (typeof pat === "object") {
    return matchObject(pat, obj, blists);
  } else {
    return [];
  }
}

const matchSubString = (pat, obj, blists) => (
  (typeof obj != "string") ? [] : new RegExp(pat).exec(obj) ? blists : []
)

const isPrimitive = (x) => {
  let type = (typeof x);
  return x === null || type === "undefined" ||
      type === "number" || type === "string" ||
      type === "boolean";
}

const matchPrimitive = (pat, obj, blists) => (
  pat === obj ? blists : []
)

const matchRegex = (pat, obj, blists) => {
  if(typeof obj !== 'string') return [];

  let regExp = new RegExp(pat.reg, "g");
  let regResults = regExp.exec(obj);

  if(regResults === null) return [];

  let pats = pat.pats || [];
  var filtered = regResults.filter(x => x);
  return match(pats, filtered.slice(1, pats.length+1), blists);
}

const matchArray = (pat, obj, blists) => (
  (pat.length > obj.length) ? [] : matchingLoop(pat, obj, blists)
)

const matchObject = (pat, obj, blists) => (
  (isPrimitive(obj) || Array.isArray(obj) ||
    (Object.keys(pat).length > Object.keys(obj).length))
    ? []
    : matchingLoop(pat, obj, blists)
)

const matchingLoop = (pat, obj, blists) => (
  Object.keys(pat).reduce((blists, key) => (
    match(pat[key], obj[key], blists)
  ), blists)
)

const matchAnd = (pat, obj, blists) => (
  Object.keys(pat).reduce((blists, key) => (
      match(pat[key], obj, blists)
  ), blists)
);

const matchOr = (pat, obj, blists) => (
  Object.keys(pat).reduce((accumulator, key) => (
    accumulator.concat(match(pat[key], obj, blists))
  ), [])
);

const matchNot = (pat, obj, blists) => (
  blists.filter(blist => (
    match(pat, obj, [blist]).length === 0
  ))
);

const matchSome = (pat, obj, blists) => (
  !obj ? [] : Object.keys(obj).reduce((accumulator, key) => (
    accumulator.concat(match(pat, obj[key], blists))
  ), [])
);

const matchFunction = (pat, obj, blists) => (
  blists.reduce((blists, blist) => (
    blists.concat(
      match(pat.pat, patCall(pat.fn, obj, pat.args, blist), [blist])
    )
  ), [])
)

const matchIf = (pat, obj, blists) => (
  blists.filter(blist => (
    patCall(pat.if, obj, pat.args, blist)
  ))
)

const patCall = (fn, obj, args, blist) => (
  fnLookup(fn)(obj, ...instantiate(args || [], blist))
)

const fnLookup = (x) => {
  if (typeof x === 'function') return x
  const fn = functions[x]
  if (typeof fn === 'function') return fn
  console.log(functions)
  if (fn === undefined) throw new Error(`${x} is undefined`)
  throw new Error(`${x} => ${fn} which is not a function`)
}

const bindVar = (x, val, blists) => (
  blists.reduce((accumulator, blist) => (
    accumulator.concat(matchVar(x, val, blist))
  ), [])
)

const matchVar = (varx, val, blist) => {
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

const isVarInBinding = (varx, val, blist) => (
  (match(blist[varx], val).length) ? blist : []
)

const isVar = (x) => (
  (typeof x) === 'string' && x.startsWith('?')
)

const instantiate = (obj, blist) => {
  if (isVar(obj)) {
    return blist[obj] || obj;
  } else if (isPrimitive(obj)) {
    return obj;
  } else if (Array.isArray(obj)) {
    return obj.map(x => instantiate(x, blist));
  } else if (typeof obj === 'object') {
    return Object.keys(obj).map(key => instantiate(obj[key], blist));
  } else {
    return obj;
  }
}

let match = _match;

export { instantiate, _match as match, traceIf, xmatch };
