import React from 'react';
import 'rbx/index.css';
import { Button, Card, Content, Icon,  } from 'rbx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestion } from '@fortawesome/free-solid-svg-icons'
import { conceptMatch } from '../utils/matcher';

// collect all regular expressions in a diagnosis pattern
const patternRegExps = pattern => (
  !pattern ? [] :
  pattern.reg ? [ pattern.reg ] :
  typeof pattern === 'object' ? Object.values(pattern).flatMap(patternRegExps) :
  []
);

const diagnosisRegExps = diagnosis => (
  patternRegExps(diagnosis.pattern)
  .filter((x, i, lst) => i === lst.indexOf(x))
  .map(pat => new RegExp(pat, "g"))
);

const matchDiagnosis = (name, diagnosis, ticket, kb) => (
  conceptMatch(diagnosis.pattern, ticket, kb.concepts)
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

// components

const Entry = ({ title, isSource, children }) => (
  <Card>
    <Card.Header>
      <Card.Header.Title>{ title }</Card.Header.Title>
    </Card.Header>
    <Card.Content>
      <Content data-is-source={isSource}>{ children }</Content>
    </Card.Content>
  </Card>  
);

const Diagnosis = ({ diagnosis, blists, setPattern }) => {
  const rexps = diagnosisRegExps(diagnosis);
  const highlight = () => setPattern(prev => (
    prev.diagnosis === diagnosis ? {} : { diagnosis, rexps }
  ));
  return (
    <Button onClick={ highlight }>
      <Icon>
        <FontAwesomeIcon icon={faQuestion} />
      </Icon>
      <span>{instances(diagnosis.summary, blists)}</span>
    </Button>
  ); 
};

const Diagnoses = ({ setPattern, ticket, kb }) => {
  const results = diagnose(ticket, kb);
  const diagnoses = results.map(({name, diagnosis, blists}) => (
    <Diagnosis key={name} diagnosis={diagnosis} blists={blists} setPattern={setPattern} />
  ));
  
  return  <Entry title="Diagnoses">{ diagnoses }</Entry>
};

export default Diagnoses;