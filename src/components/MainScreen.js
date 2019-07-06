import React, { useState } from 'react';
import TicketList from './TicketList';
import TicketUpdater from './TicketUpdater';
import { cloneTicket } from 'utils/tickets';

const MainScreen = ({ user, course }) => {
  const [ticketState, setTicketState] = useState(null);

  const selectTicket = (id, ticket) => {
    setTicketState({ id, ticket: cloneTicket(ticket) });
  };

  return (
    <React.Fragment>
      <TicketList user={ user } selectTicket ={ selectTicket } />
      {
        !ticketState 
        ? null
        : <TicketUpdater user={ user } course={ course } ticketState={ ticketState } setTicketState={ setTicketState } />
      }
    </React.Fragment>
  );
};

export default MainScreen;