
function containsVar(response) {
  var reg = new RegExp("\\?[\\w]", "g");
  if(reg.exec(response) === null) return false;
  return true;
}

function match(pat, obj, blists = [{}]) {
  if (blists.length === 0) {
      return blists;
  } else if (isVar(pat)) {
      return bindVar(pat, obj, blists);
  } else if (typeof pat == "string") {
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
  } else if (typeof pat == "object") {
      return matchObject(pat, obj, blists);
  } else return [];
}

function matchSubString(pat, obj, blists) {
  if(typeof obj != "string") return [];
  return new RegExp(pat).exec(obj) ? blists : [];
}

function isPrimitive(x) {
  let type = (typeof x);
  return x === null || type == "undefined" ||
      type == "number" || type == "string" ||
      type == "boolean";
}

function matchPrimitive(pat, obj, blists) {
  return pat === obj ? blists : [];
}

function matchRegex(pat, obj, blists) {
  if(typeof obj != 'string') return [];

  let regExp = new RegExp(pat.reg, "g");
  let regResults = regExp.exec(obj);

  if(regResults === null) return [];

  let pats = pat.pats || [];
  var filtered = regResults.filter(function (el) {
      return el !== null;
  });
  return match(pats, filtered.slice(1, pats.length+1), blists);
}

function matchArray(pat, obj, blists) {
  if (pat.length > obj.length) {
      return [];
  }
  return matchingLoop(pat, obj, blists);
}

function matchObject(pat, obj, blists) {
  if (isPrimitive(obj) || Array.isArray(obj) ||
      (Object.keys(pat).length > Object.keys(obj).length)) {
      return [];
  } else {
      return matchingLoop(pat, obj, blists);
  }
}

function matchingLoop(pat, obj, blists) {
  return Object.keys(pat).reduce(function (accumulator, key) {
      return match(pat[key], obj[key], accumulator);
  }, blists);
}

function matchAnd(pat, obj, blists) {
  return Object.keys(pat).reduce(function (accumulator, key) {
      return match(pat[key], obj, accumulator);
  }, blists);
}

function matchOr(pat, obj, blists) {
  return Object.keys(pat).reduce(function (accumulator, key) {
      return accumulator.concat(match(pat[key], obj, blists));
  }, []);
}

function matchNot(pat, obj, blists) {
  return blists.filter(function (blist) {
      return (!match(pat, obj, [blist]).length) ? blist : false;
  })
}

function matchSome(pat, obj, blists) {
  return Object.keys(obj).reduce(function (accumulator, key) {
      return accumulator.concat(match(pat, obj[key], blists));
  }, []);
}

function bindVar(x, val, blists) {
  return blists.reduce(function (accumulator, blist) {
      return accumulator.concat(matchVar(x, val, blist));
  }, []);
}

function matchVar(varx, val, blist) {
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

function isVarInBinding(varx, val, blist) {
  if (match(blist[varx], val).length) return blist;
  else return [];
}

function isVar(x) {
  return (typeof x) === 'string' && x.startsWith('?');
}

export { match };
