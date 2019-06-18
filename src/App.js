import React, { useState, useEffect } from 'react';
import "rbx/index.css";
import { Button, Card, Container, Content } from 'rbx';
import { match } from './matcher.js';

const sample = {
  "textBlocks":[
    {
      "label":"square.rat",
      "text": "(beside (a-red-square) (a-blue-square) (a-green-square))",
      "type":"sourceCode"
    },
    {
      "label":"compilerOutput",
      "text":"function call: expected a function after the open parenthesis, but received #<image>.",
      "type":"computerOutput"
    }
  ],
  "message":"I'm getting an error using function beside",
  "url": "<a href=\"https://piazza.com/class/jbzfbbon3nt32i?cid=54\" target=\"_blank\">Piazza Link</a>",
  "student":{
    "name": "Cathy",
    "id": "clj8621"
  }
};

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

const fetchJson = async (url) => {
  const response = await fetch(url);
  if (!response.ok) throw response;
  return response.json();
}

const matchPatterns = (pats, obj) => (
  pats.map(pat => [pat, match(pat.pattern, obj)])
   .filter(result => result[1].length)
);

const App = () => {
  const [patterns, setPatterns] = useState([]);
  useEffect(() => {
    const fetchPatterns = async (url) => {
      setPatterns(await fetchJson(url));
    };
    fetchPatterns('./data/patterns.json');
  }, []);
  const matches = matchPatterns(patterns, sample);
  return (
    <Container>
      <Entry title="Name" text={sample.student.name} />
      <Entry title="Message" text={sample.message} />
      <Entry title="Data" text={ sample.textBlocks.map(block => (
        <Entry key={block.label} title={block.label} text={block.text} />
      ))}
      />
      <Entry title="Suggestions" text ={ 
        matches.map(([pat, blists], i) =>
          <Button key={i}>{pat.diagnosis} {blists.length} </Button>
        )}
      />
    </Container>
  );
};

export default App;
