import React, { useEffect, useState } from 'react';
import { Box, Column, Container, Section } from 'rbx';
import EntryScreen from 'components/EntryScreen';
import { courseTracker } from 'utils/course';

const App = () => {
  const [ offering, setOffering ] = useState(null);
  useEffect(() => {
    return courseTracker(setOffering);
  }, []);

  return (
    <Section>
      <Container>
        <Column.Group>
          <Column size={10} offset={1}>
          {
            offering
            ? <EntryScreen offering={ offering } />
            : <Box>Loading class data...</Box>
          }
          </Column>
        </Column.Group>
      </Container>
    </Section>
  );
};

export default App;
