import React, { useState } from 'react';
import PropTypes from 'prop-types';
import 'rbx/index.css';
import { Divider, Level } from 'rbx';
import Diagnoses from 'components/Diagnoses';
import ResponseEditor from 'components/ResponseEditor';
import TicketData from 'components/TicketData';
import { cloneTicket, updateTicket } from 'utils/tickets';
import KB from 'utils/kb';
import concepts from 'data/concepts.json';
import diagnoses from 'data/diagnoses.json';

const SampleSource = ({ url }) => (
  url
  ? <Level>
      <Level.Item align="right">
        <a href={ url } target="_blank" rel="noopener noreferrer">
          <em>Piazza source</em>
        </a> 
      </Level.Item>
    </Level>
  : null
);

const TicketUpdater = ({user, offering, ticketState: { id, ticket } }) => {
  const [ block, setBlock ] = useState(null);
  const kb = new KB({ concepts, diagnoses });
  const exNames = kb.search(['exercise'], { course: offering.course });
  const exercises = kb.toObject(exNames, ['name']);

   // for highlighting matches
   const [ pattern, setPattern ] = useState(null);

  const highlightMatches = (text, rexps) =>  {
    const reducer = (html, rexp) => html.replace(rexp, '<span class="matched">$&</span>');
    return rexps.reduce(reducer, text);
  };
 
  const highlighter =  pattern ? text => highlightMatches(text, pattern.rexps) : null;
   
  const labels = { divider: 'Update problem report', submit: 'Send to mentors' };
 
  const selectBlock = user.role === 'mentor' ? null : (block) => setBlock(block);

const ticketSubmitHandler = ticket => {
    updateTicket(id, ticket);
    window.scrollTo(0, 0);
  };

  return (
    <React.Fragment>
      <TicketData ticket={ ticket } selectBlock={ selectBlock }  highlighter={ highlighter } />
      <ResponseEditor labels={ labels } block={ block } exercises={ exercises } ticket={ cloneTicket(ticket) }
        ticketSubmitHandler={ ticketSubmitHandler } user={ user } />
      {
        user.role === 'mentor'
        ? <React.Fragment>
            <Divider color="primary">diagnoses</Divider>
            <Diagnoses ticket={ ticket } kb={kb} setPattern={ setPattern }/>
            <SampleSource url={ ticket.url } />
          </React.Fragment>
        : null
      }
    </React.Fragment>
  )
};

TicketUpdater.propTypes = {
  user: PropTypes.object.isRequired,
  offering: PropTypes.object.isRequired, 
  ticketState: PropTypes.object.isRequired
};

SampleSource.propTypes = {
  url: PropTypes.string.isRequired
};

export default TicketUpdater;
