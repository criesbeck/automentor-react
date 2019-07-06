import React, { useCallback, useEffect, useState } from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { Column, Select } from 'rbx';
import Banner from 'components/Banner';
import MainScreen from 'components/MainScreen';
import { addMember} from 'utils/course';
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

const EntryScreen = ({ offering }) => {
  const [user, setUser] = useState(null);

  const getMember = useCallback(({ uid, displayName, email}) => {
    const member = offering.members[uid] || { uid, displayName, email };
    if (!offering.members[uid]) {
      console.log(`enrolling ${uid} ${displayName}`);
      addMember(member);
    }
    return member;
  }, [offering]);
  
  const setMember = useCallback(user => setUser(user ? getMember(user) : null), [getMember]);

  useEffect(() => {
    return firebase.auth().onAuthStateChanged(setMember);
  }, [setMember]);

  const signIn = (user) => { setMember(user); };
  const signOut = () => { firebase.auth().signOut().then(() => setUser(null)); };

  return (
    user
    ? <React.Fragment>
        <Banner user={ user } offering={ offering } signOut={ signOut } />
        <MainScreen user={ user } offering={ offering } /> 
      </React.Fragment>
    : <SignIn signIn={ signIn } members={ offering.members } />
  );
};

export default EntryScreen;
