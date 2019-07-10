import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { Column, Notification, Select } from 'rbx';
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

const EntryScreen = ({ course, members }) => {
  const [user, setUser] = useState(null);

  const getMember = useCallback(({ uid, displayName, email}) => {
    const member = members[uid] || { uid, displayName, email };
    if (!members[uid]) {
      console.log(`enrolling ${uid} ${displayName}`);
      addMember(member);
    }
    return member;
  }, [members]);
  
  const setMember = useCallback(user => setUser(user ? getMember(user) : null), [getMember]);

  useEffect(() => {
    return firebase.auth().onAuthStateChanged(setMember);
  }, [setMember]);

  const signIn = (user) => { setMember(user); };

  return (
    <>
      <Notification color="warning">
        This is a page for app testing only.
      </Notification>
      {
        user
        ? <MainScreen user={ user } setUser={ setUser } course={ course } /> 
        : <SignIn signIn={ signIn } members={ members } />
      }
    </>
  );
};

EntryScreen.propTypes = {
  members: PropTypes.object.isRequired,
  course: PropTypes.string.isRequired
};

export default EntryScreen;
