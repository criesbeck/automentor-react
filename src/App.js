import React from 'react';
import { useRoutes } from 'hookrouter';
import Login from './components/Login'
import NotFound from './components/NotFound';
import RequestList from './components/RequestList';
import Tester from './components/Tester';
import TicketResponder from './components/TicketResponder';
import TicketList from './components/TicketList';
import TicketMaker from './components/TicketMaker';

const routes = {
  '/': () => <Login />,
  '/request/:netid': ({netid}) => <TicketMaker netid={netid} />,
  '/requests/:netid': ({netid}) => <RequestList netid={netid} />,
  '/tester': () => <Tester />,
  '/ticket/:id': ({id}) => <TicketResponder id={id} />,
  '/tickets/:netid': ({netid}) => <TicketList netid={netid} />,
};

const App = () => (
  useRoutes(routes) || <NotFound />
);

export default App;
