import React from 'react';
import 'rbx/index.css';
import { Column, Container, Section } from 'rbx';
import LoadScreen from 'pages/LoadScreen';
import 'firebase';

// https://en.wikipedia.org/wiki/Clean_URL#Slug
const getSlug = (pathname) => {
  const result = pathname.match(/^.*[/]([^/]+)(?:[/])?$/);
  return result ? result[1] : null;
};

const getOffering = () => (
  getSlug(window.location.pathname) || 'cs111-f18'
);

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
