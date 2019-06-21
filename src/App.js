import React from 'react';
import { useRoutes } from 'hookrouter';
import Login from './components/Login'
import NotFound from './components/NotFound';
import Request from './components/Request';
import RequestList from './components/RequestList';
import Tester from './components/Tester';
import Ticket from './components/Ticket';
import TicketList from './components/TicketList';

const routes = {
  '/': () => <Login />,
  '/request/:netid': ({netid}) => <Request netid={netid} />,
  '/requests/:netid': ({netid}) => <RequestList netid={netid} />,
  '/tester': () => <Tester />,
  '/ticket/:id': ({id}) => <Ticket id={id} />,
  '/tickets/:netid': ({netid}) => <TicketList netid={netid} />,
};

const App = () => (
  useRoutes(routes) || <NotFound />
);

export default App;
