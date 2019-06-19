import React, { useState, useEffect } from 'react';
import "rbx/index.css";
import { Box, Button, Card, Container, Content, Heading, Level, Title } from 'rbx';
import { createBrowserHistory } from 'history';
import { conceptMatch } from './matcher.js';


const history = createBrowserHistory();

const sampleParam = () => (
  (new URLSearchParams(window.location.search)).get('sample') || 'sample-1'
);

const setSampleParam = (name) => {
  history.push({ search: `sample=${name}` });
};

const fetchJson = async (url) => {
  const response = await fetch(url);
  if (!response.ok) throw response;
  return response.json();
};

const diagnose = (sample, kb) => (
  Object.entries(kb.diagnoses).map(([name, diagnosis]) => 
    ({ name, diagnosis, blists: conceptMatch(diagnosis.pattern, sample, kb.concepts) })
  ).filter(result => result.blists.length)
);

const instantiate = (text, blist) => (
  Object.keys(blist).reduce((text, key) => text.replace(new RegExp(`\\${key}`, "g"), blist[key]), text)
);

const instances = (text, blists) => (
  blists.map(blist => instantiate(text, blist))
);

const Field = ({ title, text }) => (
  <div>
    <Heading>{ title }</Heading>
    <Title size={4}>{ text }</Title>
  </div>
);

const Entry = ({ title, text }) => (
  <Card>
    <Card.Header>
      <Card.Header.Title>{ title }</Card.Header.Title>
    </Card.Header>
    <Card.Content>
      <Content>{ text }</Content>
    </Card.Content>
  </Card>  
);

const MatchResults = ({ sample, diagnoses }) => (
  <Container>
    <Level>
      <Level.Item textAlign="centered">
        <Field title="Name" text={sample.student.name} />
      </Level.Item>
      <Level.Item textAlign="centered">
        <Field title="Exercise" text={sample.source} />
      </Level.Item>
    </Level>
    <Entry title="Message" text={sample.message} />
    { sample.textBlocks &&
      <Entry title="Data" text={ sample.textBlocks.map(block => (
        <Entry key={block.label} title={block.label} text={block.text} />
      ))}
      />
    }
    <Entry title="Diagnoses" text ={ 
      diagnoses.map(({ name, diagnosis, blists }) =>
        <Box key={name}>{instances(diagnosis.summary, blists)}</Box>
      )}
    />
  </Container>
);

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

const Tester = ({ state, kb }) => {
  const sample = kb.samples[state.sampleName];
  return (
    <React.Fragment>
      <SampleSelector names={ Object.keys(kb.samples) } state={ state } />
      <MatchResults sample={ sample } diagnoses={ diagnose(sample, kb) } />
   </React.Fragment>
  );
};

const App = () => {
  const [kb, setKb] = useState({ });
  const [sampleName, setSampleName] = useState(sampleParam());
  const sampleState = { sampleName, setSampleName: setSampleParam };

  useEffect(() => {
    const unlisten = history.listen((location) => {
      setSampleName(sampleParam());
    });

    const fetchKb = async () => {
      const [diagnoses, concepts, samples] = await Promise.all([
        fetchJson('./data/diagnoses.json'),
        fetchJson('./data/concepts.json'),
        fetchJson('./data/samples.json')
      ]);
      setKb({ diagnoses, concepts, samples });
    };
    fetchKb();
    return unlisten;
  }, []);
  
  return kb.samples
    ? <Tester state={ sampleState } kb={ kb } />
    : <div>Loading data...</div>;
};

export default App;
