import React, { useEffect, useState } from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { Box, Column, Container, Section, Select } from 'rbx';
import TicketList from './components/TicketList';
import TicketMaker from './components/TicketMaker';
import Banner from './components/Banner';
import { addMember, memberOff } from 'utils/members';
import { firebase } from 'utils/firebase';

const uiConfig = {
  signInFlow: 'popup',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID
  ],
  callbacks: {
    signInSuccessWithAuthResult: () => false
  }
};

// sort by last, first, not at all robust
const reverseName = name => {
  const parts = name.split(' ');
  return [parts[parts.length - 1]].concat(parts.slice(1)).join(' ');
};

const byMemberDisplayName = (m1, m2) => (
  reverseName(m1.displayName).localeCompare(reverseName(m2.displayName))
);

const FakeStudent = ({ members, signIn }) => (
  <Column size={4} offset={5}>
    <Select.Container>
      <Select onChange={(event) => signIn(members[event.target.value] || null)}>
        <Select.Option key={0} value={0}>Sign in as...</Select.Option>
        {
          Object.values(members)
          .filter(member => member.role !== 'mentor')
          .sort(byMemberDisplayName)
          .map(member => (
            <Select.Option key={member.uid} value={member.uid}>{member.displayName}</Select.Option>
          ))
        }
      </Select>
    </Select.Container>
  </Column>
);

const SignIn = ({ members, signIn }) => (
  <React.Fragment>
    <StyledFirebaseAuth
      uiConfig={ uiConfig }
      firebaseAuth={ firebase.auth() }
    />
    <FakeStudent members={ members } signIn ={ signIn }/>
  </React.Fragment>
);

const MainScreen = ({ userState, members }) => (
  userState.user ? (
    <React.Fragment>
      <TicketList user={ userState.user } />
      <TicketMaker user={ userState.user } members={ members }/>
    </React.Fragment>
  ) : (
    <SignIn signIn={ userState.signIn } members={ members } />
  )
);

const App = () => {
  const [ members, setMembers ] = useState(null);
  useEffect(() => {
    return memberOff(setMembers);
  }, []);

  const [user, setUser] = useState(null);
  useEffect(() => {
    firebase.auth().onAuthStateChanged(setUser);
  }, []);

  if (members && user) {
    const member = members[user.uid];
    if (!member) {
      console.log(`adding ${user.uid} ${user.displayName}`)
      addMember(user.uid, user.displayName, user.email)
    } else if (member.role) {
      console.log(`setting role to ${member.role}`)
      user.role = member.role;
    }
    console.log(user)
  }

  const signIn = (user) => { setUser(user); }
  const signOut = () => { firebase.auth().signOut().then(() => setUser(null)); };

  const userState = { user, signIn, signOut };

  return (
    <Section>
      <Container>
        <Column.Group>
          <Column size={10} offset={1}>
            <Banner userState={ userState } />
            {
              members
              ? <MainScreen userState={ userState } members={ members } /> 
              : <Box>Loading class data...</Box>
            }
          </Column>
        </Column.Group>
      </Container>
    </Section>
  );
};

export default App;
