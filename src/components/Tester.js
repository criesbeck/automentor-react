import React, { useState, useEffect } from 'react';
import "rbx/index.css";
import { Box, Button, Card, Container, Content, Heading, Icon, Level, Title } from 'rbx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestion } from '@fortawesome/free-solid-svg-icons'
import { createBrowserHistory } from 'history';
import { conceptMatch } from '../utils/matcher';

// pick sample name from URL
const history = createBrowserHistory();

const sampleParam = () => (
  (new URLSearchParams(window.location.search)).get('sample') || 'sample-1'
);

const setSampleParam = (name) => {
  history.push({ search: `sample=${name}` });
};

// for console debugging printing
const showObject = (tag, x) => { 
  console.log(tag)
  console.log(x); 
  return x;
};

// general JSON fetcher
const fetchJson = async (url) => {
  const response = await fetch(url);
  if (!response.ok) throw response;
  return response.json();
};

// collect all regular expressions in a diagnosis pattern
const patternRegExps = pattern => (
  !pattern ? [] :
  pattern.reg ? [ pattern.reg ] :
  typeof pattern === 'object' ? Object.values(pattern).flatMap(patternRegExps) :
  []
);

const diagnosisRegExps = diagnosis => (
  patternRegExps(diagnosis.pattern)
);

// highlight all bits of text that match a regular expression
const highlightHTML = (html, rexp) => (
  html.replace(rexp, '<span class="matched">$&</span>')
);

const highlightTextMatches = (elt, rexps) =>  {
  elt.innerHTML = rexps.reduce(highlightHTML, elt.innerHTML);
};

const highlightPageMatches = (pats) => {
  if (!pats) return;
  const rexps = pats.map(pat => new RegExp(pat, "g"));
  const elts = Array.from(document.querySelectorAll('[data-source-text'));
  elts.forEach(elt => { highlightTextMatches(elt, rexps); });
};

// apply the knowledge base (patterns, concepts) to diagnose a sample request
const diagnose = (sample, kb) => (
  Object.entries(kb.diagnoses).map(([name, diagnosis]) => 
    ({ name, diagnosis, blists: conceptMatch(diagnosis.pattern, sample, kb.concepts) })
  ).filter(result => result.blists.length)
);

// replace ?x patterns with bindings
const instantiate = (text, blist) => (
  Object.keys(blist).reduce((text, key) => text.replace(new RegExp(`\\${key}`, "g"), blist[key]), text)
);

const instances = (text, blists) => (
  blists.map(blist => instantiate(text, blist))
);

// The page components

const Field = ({ title, text }) => (
  <div>
    <Heading>{ title }</Heading>
    <Title size={4}>{ text }</Title>
  </div>
);

const Entry = ({ title, text, textSource }) => (
  <Card>
    <Card.Header>
      <Card.Header.Title>{ title }</Card.Header.Title>
    </Card.Header>
    <Card.Content>
      <Content data-source-text={textSource}>{ text }</Content>
    </Card.Content>
  </Card>  
);

// for student input data 
const StudentData = ({ sample }) => {
  const sources = sample.textBlocks &&
    <Entry title="Data" text={ sample.textBlocks.map(block => (
      <Entry key={block.label} title={block.label} text={block.text}  textSource="text-block"/>
    )) } />;

  return (
    <React.Fragment>
      <Level>
        <Level.Item textAlign="centered">
          <Field title="Name" text={sample.student.name} />
        </Level.Item>
        <Level.Item textAlign="centered">
          <Field title="Exercise" text={sample.source} />
        </Level.Item>
      </Level>
      <Entry title="Message" text={sample.message} textSource="message" />
      { sources }
    </React.Fragment>
  );
};

// for diagnosis results
const Diagnosis = ({ diagnosis, blists }) => {
  const rexps = diagnosisRegExps(diagnosis);
  const highlight = () => highlightPageMatches(rexps);
  return (
    <Box>
      {instances(diagnosis.summary, blists)}
      <Button pull="right" onClick={ highlight }>
        <Icon><FontAwesomeIcon icon={ faQuestion } /></Icon>
      </Button>
    </Box>
  ); 
};

const Diagnoses = ({ results }) => {
  const diagnoses = results.map(({name, diagnosis, blists}) => (
    <Diagnosis key={name} diagnosis={diagnosis} blists={blists} />
  ));
  
  return  <Entry title="Diagnoses" text={ diagnoses } />
};

// for selecting a sample to test
const Sample = ({ name, state }) => (
  <Button 
    color={ name === state.sampleName ? 'success' : null }
    onClick={ () => state.setSampleName(name) }
  >{name.slice('sample-'.length)}</Button>
)

const SampleSelector = ({ names, state }) => (
  <Level>
    { names.map(name => (
        <Level.Item  key={name}>
          <Sample name={name} state={ state } />
        </Level.Item>
      ))
    }
  </Level>
);

const Tester = () => {
  const [sampleName, setSampleName] = useState(sampleParam());
  const state = { sampleName, setSampleName: setSampleParam };
  const [kb, setKb] = useState({});

  useEffect(() => {
    const unlisten = history.listen((location) => {
      setSampleName(sampleParam());
    });
    return unlisten;
  }, []);

  useEffect(() => {
    const fetchKb = async () => {
      const [diagnoses, concepts, samples] = await Promise.all([
        fetchJson('./data/diagnoses.json'),
        fetchJson('./data/concepts.json'),
        fetchJson('./data/samples.json')
      ]);
      setKb({ diagnoses, concepts, samples });
    };
    fetchKb();
  }, []);

  const sample = kb.samples ? kb.samples[sampleName] : null;

  return !sample ? <div>Loading data...</div> : (
    <Container>
      <SampleSelector names={ Object.keys(kb.samples) } state={ state } />
      <StudentData sample={sample} />
      <Diagnoses results={diagnose(sample, kb)} />
    </Container>
  );
};

export default Tester;
