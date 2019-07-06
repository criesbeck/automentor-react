import React, { useEffect, useState } from 'react';
import { Box, Column, Container, Section } from 'rbx';
import EntryScreen from 'components/EntryScreen';
import { courseTracker, membersTracker } from 'utils/course';

const App = () => {
  const [ course, setCourse ] = useState(null);
  const [ members, setMembers ] = useState(null);

  useEffect(() => {
    return courseTracker(setCourse);
  }, []);

  useEffect(() => {
    return membersTracker(setMembers);
  }, []);

  return (
    <Section>
      <Container>
        <Column.Group>
          <Column size={10} offset={1}>
          {
            course && members
            ? <EntryScreen course={ course } members={ members } />
            : <Box>Loading class data...</Box>
          }
          </Column>
        </Column.Group>
      </Container>
    </Section>
  );
};

export default App;
