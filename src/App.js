import React, { useEffect, useState } from 'react';
import { Column, Container, Section } from 'rbx';
import { setQueryParams } from 'hookrouter';
import Login from './components/Login';
import TicketList from './components/TicketList';
import TicketMaker from './components/TicketMaker';
import TopMenu from './components/TopMenu';

const getLocalState = () => (
  window.localStorage.getItem('ccContext')
  ? JSON.parse(localStorage.getItem('ccContext'))
  : {}
);

const setLocalState = (context) => {
  window.localStorage.setItem('ccContext', JSON.stringify(context));
};

const MainScreen = ({context}) => (
  <React.Fragment>
    <TicketList context={ context } />
    <TicketMaker context={ context } />
  </React.Fragment>
);

const App = () => {
  const state = useState(getLocalState());
  const [context] = state;
  console.log(context);

  useEffect(() => setLocalState(context), [context]);

  if (!context.netid) {
    setQueryParams({}, true);
  };
  

  return (
    <Section>
      <Container>
        <Column.Group>
          <Column size={10} offset={1}>
            <TopMenu state={state} />
            {
              context.netid ? <MainScreen context={context} /> : <Login state={ state }/>
            }
          </Column>
        </Column.Group>
      </Container>
    </Section>
  )
};

export default App;
