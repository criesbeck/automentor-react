import React from 'react';
import 'rbx/index.css';
import { Column, Container, Section } from 'rbx';
import LoadScreen from 'pages/LoadScreen';
import 'firebase';

const getOffering = () => {
  const params = new URLSearchParams(document.location.search.substring(1));
  return params.get('offering') || 'EECS111-2019WI';
};

const isTestMode = () => window.location.hostname === 'localhost';

const App = () => (
  <Section>
    <Container>
      <Column.Group>
        <Column size={10} offset={1}>
          <LoadScreen offering={ getOffering() } testMode={ isTestMode() } />
        </Column>
      </Column.Group>
    </Container>
  </Section>
);

export default App;
