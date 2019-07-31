import React from 'react';
import PropTypes from 'prop-types';
import 'rbx/index.css';
import {Column, Select } from 'rbx';
import { useCachedValue } from 'hooks/useCachedValue';
import { useFirebase } from 'hooks/useFirebase';

// sort by last, first, not at all robust
const reverseName = name => {
  const parts = name.split(' ');
  return [parts[parts.length - 1]].concat(parts.slice(1)).join(' ');
};

const byMemberDisplayName = (m1, m2) => (
  reverseName(m1.displayName).localeCompare(reverseName(m2.displayName))
);

const SignIn = ({ members, signIn }) => (
  <Column size={4} offset={5}>
    <Select.Container>
      <Select onChange={(event) => signIn(members[event.target.value] || null)}>
        <Select.Option key={0} value={0}>Sign in as...</Select.Option>
        {
          Object.values(members)
          .sort(byMemberDisplayName)
          .map(member => (
            <Select.Option key={ member.uid } value={ member.uid }>
             { member.displayName }
             { member.role === 'mentor' ? ' (mentor)' : '' }
            </Select.Option>
          ))
        }
      </Select>
    </Select.Container>
  </Column>
);

const TestLogin = ({ offering, setUser }) => {
  const [members, setMembers] = useCachedValue('cachedMembers');

  useFirebase(offering ? `offerings/${offering}/members` : null, setMembers);

  const signIn = (user) => { 
    setUser(user);
  };

  return (
    <SignIn signIn={ signIn } members={ members || {} } />
  );
};

TestLogin.propTypes = {
  offering: PropTypes.string.isRequired,
  setUser: PropTypes.func.isRequired
};

export default TestLogin;
