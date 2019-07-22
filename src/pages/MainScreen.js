import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Banner from 'components/Banner';
import TicketList from '../components/TicketList';
import TicketUpdater from '../components/TicketUpdater';
import { cloneTicket } from 'utils/tickets';
import { firebase } from 'utils/firebase';

const MainScreen = ({ user, setUser, course }) => {
  const [ticketState, setTicketState] = useState(null);

  const selectTicket = (id, ticket) => {
    setTicketState({ id, ticket: cloneTicket(ticket) });
  };


  const signOut = () => { 
    firebase.auth().signOut().then(() => {
      sessionStorage.removeItem('cachedUser');
      setUser(null);
    });
  };

  return (
    <React.Fragment>
      <Banner user={user} course={course.title} signOut={signOut} />
      <TicketList user={ user } selectTicket ={ selectTicket } />
      {
        !ticketState 
        ? null
        : <TicketUpdater user={ user } course={ course } ticketState={ ticketState } setTicketState={ setTicketState } />
      }
    </React.Fragment>
  );
};

MainScreen.propTypes = {
  user: PropTypes.object.isRequired,
  setUser: PropTypes.func.isRequired,
  course: PropTypes.object.isRequired
};

export default MainScreen;