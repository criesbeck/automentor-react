import React, { useState } from 'react';
import TicketList from './TicketList';
import TicketUpdater from './TicketUpdater';

const MainScreen = ({ user, offering }) => {
  const [ticketState, setTicketState] = useState(null);

  return (
    <React.Fragment>
      <TicketList user={ user } setTicketState={ setTicketState } />
      {
        !ticketState 
        ? null
        : <TicketUpdater user={ user } offering={ offering } ticketState={ ticketState } />
      }
    </React.Fragment>
  );
};

export default MainScreen;