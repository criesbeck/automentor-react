import React from 'react';
import 'rbx/index.css';
import { Button, Card, Content } from 'rbx';
import { diagnose, diagnosisRegExps, instances } from './diagnose';

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
    prev && (prev.diagnosis === diagnosis) ? null : { diagnosis, rexps }
  ));
  return (
    <Button onClick={ highlight }>
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