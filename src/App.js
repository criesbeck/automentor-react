import React from 'react';
import 'rbx/index.css';
import { Column, Container, Section } from 'rbx';
import LoadScreen from 'pages/LoadScreen';
import 'firebase';

const getOffering = () => {
  const hash = window.location.hash;
  return hash ? hash.slice(1) : 'cs111-f18';
};

const getTestMode = () => window.location.hostname === 'localhost';

const App = () => (
  <Section>
    <Container>
      <Column.Group>
        <Column size={10} offset={1}>
          <LoadScreen offering={ getOffering() } testMode={ getTestMode() } />
        </Column>
      </Column.Group>
    </Container>
  </Section>
);

export default App;
