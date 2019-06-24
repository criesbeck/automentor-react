import React, { useState } from 'react';
import { useRoutes } from 'hookrouter';
import Login from './components/Login'
import NotFound from './components/NotFound';
import RequestList from './components/RequestList';
import Tester from './components/Tester';
import TicketResponder from './components/TicketResponder';
import TicketList from './components/TicketList';
import TicketMaker from './components/TicketMaker';

const routes = {
  '/': () => (context, setContext) => <Login state={ [context, setContext] }/>,
  '/request': () => context => <TicketMaker context={context} />,
  '/requests': () => context => <RequestList context={context} />,
  '/tester': () => () => <Tester />,
  '/ticket/:id': ({id}) => context => <TicketResponder id={id} context={context} />,
  '/tickets': () => context => <TicketList context={context} />,
};

const reroute = (route, context, setContext) => (
  !context.netid
  ? <Login state={ [context, setContext] }/>
  : !route ? <NotFound />
  : route(context, setContext)
);

const App = () => {
  const [context, setContext] = useState({})

  const route = useRoutes(routes);
  return reroute(route, context, setContext);
};

export default App;
