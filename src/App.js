import React, { useEffect, useState } from 'react';
import { Box, Column, Container, Section } from 'rbx';
import EntryScreen from 'components/EntryScreen';
import MainScreen from 'components/MainScreen';
import { courseTracker, membersTracker } from 'utils/course';

const getCachedUser = () => {
  const text = window.sessionStorage.getItem('cachedUser');
  return text ? JSON.parse(text) : null;
};

const isRecent = time => (
  (Date.now() - time) < 24 * 60 * 60 * 1000
);

const App = () => {
  const [ course, setCourse ] = useState(null);
  const [ members, setMembers ] = useState(null);
  const [ user, setUser ] = useState(getCachedUser());

  console.log(`app ${JSON.stringify(user)}`)

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
            !course || !members
            ? <Box>Loading class data...</Box>
            : !user
            ? <EntryScreen course={ course } members={ members } />
            : !isRecent(user.time)
            ? alert('Please log in again through Canvas')
            : <MainScreen user={user} setUser={setUser} course={course} />
          }
          </Column>
        </Column.Group>
      </Container>
    </Section>
  );
};

export default App;
