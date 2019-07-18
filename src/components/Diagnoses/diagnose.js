import { xmatch } from 'utils/matcher';
import { removeDuplicates } from 'utils/utils';

// collect all regular expressions in a diagnosis pattern
const patternRegExps = pattern => (
  !pattern ? [] :
  pattern.reg ? [ pattern.reg ] :
  typeof pattern === 'object' ? Object.values(pattern).flatMap(patternRegExps) :
  []
);

const diagnosisRegExps = diagnosis => (
  removeDuplicates(patternRegExps(diagnosis.pattern)).map(pat => new RegExp(pat, "g"))
);

const conceptMatch = (pat, obj, kb) => (
  xmatch(pat, obj, kb)
)

const matchDiagnosis = (name, diagnosis, ticket, kb) => (
  conceptMatch(diagnosis.pattern, ticket, kb)
);

// apply the knowledge base (patterns, concepts) to diagnose a ticket
const diagnose = (ticket, kb) => (
  Object.entries(kb.diagnoses).map(([name, diagnosis]) => 
    ({ name, diagnosis, blists: matchDiagnosis(name, diagnosis, ticket, kb) })
  ).filter(result => result.blists.length)
);

// replace ?x patterns with bindings
const instantiate = (text, blist) => (
  Object.keys(blist).reduce((text, key) => text.replace(new RegExp(`\\${key}`, "g"), blist[key]), text)
);

const instances = (text, blists) => (
  blists.map(blist => instantiate(text, blist))
);

export { diagnose, diagnosisRegExps, instances };
